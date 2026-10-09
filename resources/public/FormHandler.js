import Promise from 'promise-polyfill';
import formatPrice from "../common/formatPrice";
import formConditional from './form_conditional';
import StepForm from './step_form';
import validateData from './form_validation';
import showMessages from './show_error_message';
import resetMessages from './helpers';

class PayFormHandler {
    constructor(form, config) {
        this.form = form;
        this.totalAmountWithoutDiscount = 0;
        this.selector = '.' + form.attr('wpf_form_instance');
        this.config = config;
        this.formId = config?.form_id;
        this.paymentMethod = '';
        this.generalConfig = window.wp_payform_general;
        this.formConfigInstance = 'wp_payform_' + form.attr('wpf_form_instance');
        this.formConfig = window[this.formConfigInstance];
        this.$formNoticeWrapper = form.parent().find('.wpf_form_notices');
        this.appliedCoupons = {};
        this.currencyRates = {};
        this.currency_settings = window['wp_payform_' + this.form.attr('wpf_form_instance')]?.currency_settings;

    }

    $t(stringKey) {
        if (this.generalConfig.i18n[stringKey]) {
            return this.generalConfig.i18n[stringKey];
        }
        return '';
    }
    initForm() {
        // Remove all previously-attached .wpf handlers so Elementor popup re-opens
        // (which fire wpf_reinit and call initForm() again) don't stack duplicate listeners.
        this.form.off('.wpfFormHandler');

        const submitButton = this.form.find('button.wpf_submit_button');
        // Add the 'disabled' attribute to the submit button
        submitButton.attr('disabled', false);
        // trigger single form (maybe use for any third party payment handler)
        this.form.trigger('wppayform_init_single', [this, this.config]);
        this.setQuickFormLayoutWidth();
        let has_pro = window.wp_payform_general.has_pro;
        // form conditional
        if (has_pro === '1') {
            let conditionals = window['wp_payform_' + this.form.attr('wpf_form_instance')];
            formConditional(this.form, conditionals);
        }
        // Sync hidden price checkbox to visible checkbox state (no inversion).
        this.form.on('change.wpfFormHandler', '.wpf-product-checkbox_input', (e) => {
            const $checkbox = jQuery(e.target);
            const checked = $checkbox.prop('checked');
            $checkbox.parent().find('input.wpf_tabular_price').prop('checked', checked);
        });

        // Auto-tick the card checkbox when qty > 0 so subtotal includes the line.
        // Must register BEFORE the change handler that calls calculatePayments,
        // so the checkbox state is in sync before recompute.
        this.form.on('input.wpfFormHandler change.wpfFormHandler', '.wpf_tabular_qty', (e) => {
            const $qty = jQuery(e.target);
            const $card = $qty.closest('.wpf-product-card');
            if (!$card.length) {
                return;
            }
            const qty = parseInt($qty.val(), 10) || 0;
            const $visible = $card.find('.wpf-product-checkbox_input');
            const $hidden = $card.find('input.wpf_tabular_price');
            const next_checked = qty > 0;
            if ($visible.prop('checked') !== next_checked) {
                $visible.prop('checked', next_checked);
            }
            $hidden.prop('checked', next_checked);
        });

        this.calculatePayments();
        this.form.on('change.wpfFormHandler', '.wpf_payment_item, .wpf_item_qty, .wpf_tabular_qty, .wpf_form_control, .wpf-product-checkbox_input, .wpf_tabular_multiple_option, .wpf_input_dynamic_payment_item', (e) => {
            this.calculatePayments();
        });
        this.form.on('click.wpfFormHandler', '.wpf-product-checkbox', (e) => {
            const $cb = jQuery(e.target).prev();
            const next_checked = !$cb.prop('checked');
            this.setMinimumQtyInCheckedTabularItem(e, next_checked);
            $cb.prop('checked', next_checked).trigger('change');
        });
        // add css for simple donation form
        let simple_donation_class = this.form.find('.wpf_simple_donation_form').attr('class');
        if (simple_donation_class?.includes('wpf_simple_donation_form')) {
            jQuery('.wpf_form_preview_wrapper').addClass('wpf_simple_donation_form_wrapper');
            jQuery('.wpf_form').addClass('simple_wpf_form');
            jQuery('.wpf_donation_image_container').removeClass('wpf_donation_image_container');
        }

        this.form.on('change.wpfFormHandler', '.wpf_payment_item, .wpf_item_qty, .wpf_tabular_qty', () => {
            // check applied coupon is valid or not
            let appliedCoupons = this.form.find('.__wpf_all_applied_coupons').val();
            if (appliedCoupons?.length) {
                let coupons = JSON.parse(appliedCoupons);
                coupons?.map(coupon => this.applyCoupon(coupon, 're_check_coupon'));
            }
        });

        const stepFormInstance = new StepForm('hello hit condition');
        stepFormInstance.step_form_handler(this.form, this.$formNoticeWrapper);

        // donation fields actions
        this.handleDonationComponents();
        this.initPaymentMethodChange();
        this.initDiscountCode();
        this.initCurrencyChange();

        this.form.on('change.wpfFormHandler', '.wpf_tabular_qty', () => {
            if (has_pro === '1') {
                let conditionals = window['wp_payform_' + this.form.attr('wpf_form_instance')];
                formConditional(this.form, conditionals);
            }
        });
        if (this.config?.stripe_checkout_style == 'embedded_form' || this.config.stripe_checkout_style == 'embeded_form') {
            this.stripe = Stripe(this.config.stripe_pub_key);
            this.initStripeElement();
        } else if (this.config?.stripe_checkout_style == 'stripe_checkout') {
            this.stripe = Stripe(this.config.stripe_pub_key);
        } 

        this.form.off('submit.wpfFormHandler').on('submit.wpfFormHandler', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Subscription Setup
        this.maybeSubscriptionSetup();
        this.maybeCustomSubscriptionItemSetup();
        this.maybeSingleSelectionSetup();
    }
    maybeSingleSelectionSetup() {
        const selectionLimit = parseInt(this.form.find('.wpf_selection_limit').attr('data-selection_limit'), 10) || 0;
        if (selectionLimit <= 0) return;

        this.form.on('change.wpfFormHandler', '.wpf_selection_limit input[type=checkbox]', (e) => {
            const checkboxes = this.form.find('.wpf_selection_limit input[type=checkbox]');
            const checkedBoxes = checkboxes.filter(':checked');

            if (checkedBoxes.length > selectionLimit) {
                jQuery(e.target).prop('checked', false);
                return;
            }

            // Enable/disable checkboxes based on limit
            if (checkedBoxes.length >= selectionLimit) {
                checkboxes.not(':checked')
                .prop('disabled', true)
                .css('opacity', '0.5');
                checkboxes.not(':checked').each((index, element) => {
                    jQuery(element).parent().find('.form-check-label').css('opacity', '0.5');
                });
            } else {
                checkboxes.prop('disabled', false)
                .css('opacity', '1');
                checkboxes.not(':checked').each((index, element) => {
                    jQuery(element).parent().find('.form-check-label').css('opacity', '1');
                });
            }
        });
    }


    setMinimumQtyInCheckedTabularItem(e, is_checked) {
        let minimumValue = jQuery(e.target).parent().find('.wpf_tabular_qty').attr('mini');
        let val = jQuery(e.target).parent().find('.wpf_tabular_qty').val();
        let defValue = jQuery(e.target).parent().find('.wpf_tabular_qty').attr('def');
        defValue = defValue > minimumValue ? defValue : minimumValue;
        defValue = defValue > val ? defValue : val;
        if (is_checked) {
            jQuery(e.target).parent().find('.wpf_tabular_qty').val(defValue);
            jQuery(e.target).parent().find('.wpf_tabular_qty').attr('min', 0);
        } else {
            jQuery(e.target).parent().find('.wpf_tabular_qty').val(defValue);
            jQuery(e.target).parent().find('.wpf_tabular_qty').attr('min', minimumValue);
        }
    }

    setQuickFormLayoutWidth() {
        let has_image_in_donation = this.form.find('.wpf_donation_image_container').attr('class');
        if (has_image_in_donation) {
            // should check
        } else {
            jQuery('div.wpf_form_group').css('padding-left', '0px')
            jQuery('.wpf_all_payment_methods_wrapper').css('padding-left', '0px');
            jQuery('.wpf_form_preview_wrapper').addClass('wpf_donation_wrapper');
        }
    }

    handleDonationComponents() {
        this.form.on('change.wpfFormHandler', '.wpf_donation_controls_custom input', e => {
            this.calculatePayments(parseInt(e.target.value) * 100);
        });
        this.form.on('click.wpfFormHandler', '.wpf_donation_controls_custom input', () => {
            this.form.find('.wpf_donation_controls_radio input').prop('checked', true);
        });

        this.form.on('change.wpfFormHandler', '.wpf_donation_controls_radio input', (e) => {
            const price = e.target.attributes['data-price'].value;
            const custom = this.form.find('.wpf_donation_controls_custom input');
            this.form.find('.wpf_donation_custom_amount').attr('base-currency-price', price/100)
            if (e.target.value == 'custom') {
                custom.get(0).focus();
                this.calculatePayments(parseInt(custom.get(0).value) * 100);
            } else {
                let formatPrice = (parseInt(price) / 100)
                custom.attr('data-price', formatPrice);
                custom.val(formatPrice);
                this.calculatePayments();
            }
        });

        this.form.on('input.wpfFormHandler', '.wpf_donation_custom_amount', (e) => {
            const amountInput = jQuery(e.currentTarget);
            const amountValue = amountInput.val();
            amountInput.attr('base-currency-price', amountValue);
            this.form.find('.wpf_multi_form_controls_radio').each((index, element) => {
                const $element = jQuery(element);
                const radioElement = $element.find('.form-check-input.wpf_payment_item');
                radioElement.prop('checked', false);
            });
            jQuery('.wpf_multi_form_controls_select').find('select').val('').trigger('change');
            this.calculatePayments();
        });

        this.form.on('change.wpfFormHandler', '.wpf_donation_recurring_controller input[type=checkbox]', e => {
            const recurringInfo = this.form.find('.wpf_donation_recurring_infos').get(0);
            if (jQuery(e.target).prop('checked')) {
                recurringInfo.style.display = 'flex';
            } else {
                recurringInfo.style.display = 'none';
            };
        });

        this.form.on('change.wpfFormHandler', '.wpf_gift_aid_card .wpf_gift_aid_toggle', (e) => {
            const addressSection = jQuery(e.target).closest('.wpf_gift_aid_card').find('.wpf_gift_aid_address').get(0);
            if (!addressSection) return;
            if (jQuery(e.target).prop('checked')) {
                addressSection.style.display = 'flex';
            } else {
                addressSection.style.display = 'none';
                jQuery(addressSection).find('input').val('');
            }
        });

        this.form.on('click.wpfFormHandler', '[data-donation_interval_button]', function() {
            const selectedInput = jQuery(this).find('input[type="radio"]');

            // Mark input as checked and selected, remove 'selected' from siblings
            selectedInput.prop('checked', true);
            jQuery(this).addClass('selected')
                        .siblings('[data-donation_interval_button]')
                        .removeClass('selected');

            // Trigger change event if needed for additional logic
            selectedInput.trigger('change');
        });
    }

    conditionalFormValidation(formId) {
        const $inputs = this.form.find(':input').filter(function (i, el) {
            return !jQuery(el).closest('.wpf_has_condition').hasClass('wpf_excluded');
        });

        // this.form
        //     .find('.wpf_has_condition').filter(function (i, el) {
        //         if (jQuery(el).hasClass('wpf_excluded')) {
        //             if (jQuery(el).attr('field_name')?.includes('phone')) {
        //                 let phone_error_id = `#error_phone_code_wpf_input_${formId}_${jQuery(el).attr('field_name')}_input`
        //                 jQuery(phone_error_id).remove()
        //             }
        //             jQuery(el).remove();
        //         }
        //     });

        // remove unchecked tabular product
        this.calculateTabularTotal('', '', true);
        return $inputs.serialize();
    }

    handleFormSubmit() {
        resetMessages(this.form, this.$formNoticeWrapper);
        const instance =
            validateData(this.form, this.$formNoticeWrapper)
                .then(response => {
                    jQuery('#wpf_step_prev').hide();
                    return this.validateRecaptcha();
                }) // step 2
                .then((response) => {
                    return this.stripeElementPaymentToken();
                }) // step 3
                .then((response) => {
                    return this.resolvePaymentGateways()
                })
                .then(response => {
                    // get serialized data remove excluded fields
                     const serialized_data = this.conditionalFormValidation(this.formId);
                    // Before send ajax request
                    this.buttonState('submitting_form', this.$t('button_state'), true, response);
                    jQuery.post(this.generalConfig.ajax_url, {
                        action: 'wpf_submit_form',
                        form_id: this.formId,
                        payment_total: this.form.data('payment_total'),
                        form_data: serialized_data,
                        tax_total: this.form.data('tax_total'),
                        wpf_nonce: this.generalConfig.wpf_nonce
                    })
                        .then(response => {
                            if (!response || !response.data || typeof response == 'string') {
                                this.handleServerUnexpectedError(response);
                                return;
                            }

                            if (response.data.nextAction) {
                                this.form.trigger('wppayform_next_action_' + response.data.nextAction, {
                                    form: this.form,
                                    response: response
                                });
                                return;
                            }

                            if (response.data.call_next_method) {
                                this[response.data.call_next_method](response.data);
                                return;
                            }
                            this.form.trigger('wpf_submission_success', {
                                form: this.form,
                                config: this.config,
                            });
                            this.handlePaymentSuccess(response.data);
                        })
                        .fail(error => {
                            if (typeof error == 'string' || !error.responseJSON || !error.responseJSON.data) {
                                this.handleServerUnexpectedError(response);
                            } else {
                                showMessages(error.responseJSON.data.errors, 'error', error.responseJSON.data.message, this.form, this.$formNoticeWrapper);
                            }

                            if (error.responseJSON?.errors) {
                                this.handleServerUnexpectedError(error.responseJSON.errors);
                            }
                            if (error && error.responseJSON && error.responseJSON.data) {
                                this.form.trigger('wpf_form_fail_submission', error.responseJSON.data);
                            }
                            this.form.trigger('server_error', [error]);
                            this.form.removeClass('wpf_submitting_form');
                            this.form.find('button.wpf_submit_button').removeAttr('disabled');
                            this.buttonState('normal', '', false);
                        })
                        .always((response) => {
                            if (response && response.responseJSON && response.responseJSON.data && response.responseJSON.data.form_events) {
                                this.fireFormEvents(response.responseJSON.data.form_events, response.responseJSON.data);
                            }
                        });
                })
                .catch((error) => {
                    jQuery(`.step-form-item`).last().addClass("error");
                    showMessages(error, 'error', this.$t('validation_failed'), this.form, this.$formNoticeWrapper);
                    this.buttonState('state_normal', '', false, error);
                });
    }

    normalRedirect(data) {
        showMessages(data.message, 'success', '', this.form, this.$formNoticeWrapper);
        window.location.href = data.redirect_url;
    }

    initDiscountCode() {
        var couponCodes = this.form.find('.wpf_item_coupon');
        if (!couponCodes.length) {
            return false;
        }
        if (!this.form.find('.__wpf_all_applied_coupons').length) {
            this.form.append('<input type="hidden" class="__wpf_all_applied_coupons" name="__wpf_all_applied_coupons"/>');
        }
        this.form.on('click.wpfFormHandler', '.wpf_coupon_action', () => {
            this.applyCoupon();
        });
    }

    //discountHandler
    applyCoupon(val = '', re_check = '') {
        let code = this.form.find('.wpf_coupon_field').val() || val;
        var $codeWrapper = this.form.find('.wpf_item_coupon');
        const $input = $codeWrapper.find('input.wpf_coupon_field');
        jQuery.post(this.generalConfig.ajax_url, {
            action: 'wpf_coupon_apply',
            route: 'validate',
            form_id: this.formId,
            coupon: code,
            payment_total: this.form.data('payment_total_without_discount'),
            form_data: jQuery(this.form).serialize(),
            other_coupons: this.form.find('.__wpf_all_applied_coupons').val(),
            wpf_nonce: this.generalConfig.wpf_nonce
        })
            .then(response => {
                const coupon = response.coupon;
                this.appliedCoupons[coupon.code] = coupon;
                this.form.find('.__wpf_all_applied_coupons').attr('value', JSON.stringify(Object.keys(this.appliedCoupons)));
                let couponAmount = coupon.amount + '%';
                if (coupon.coupon_type == 'fixed') {
                    couponAmount = this.getFormattedPrice(coupon.amount * 100);
                }
                let message = `${coupon.code} <span>-${couponAmount}</span>`;
                this.recordCouponMessage($codeWrapper, code, message, 'success');
                this.calculatePayments();
                $input.val('');
            })
            .fail((errors) => {
                this.recordCouponMessage($codeWrapper, code, errors.responseJSON.message, 'error', re_check);
            })
            .always(() => {
                this.calculatePayments();
                $input.val('');
            });
    }

    getDiscounts() {
        let discounts = Object.values(this.appliedCoupons);
        discounts.sort((a, b) => {
            if (a.coupon_type === 'fixed' && b.coupon_type !== 'fixed') {
                return -1; // 'fixed' coupon comes before non-fixed coupon
            } else if (a.coupon_type !== 'fixed' && b.coupon_type === 'fixed') {
                return 1; // non-fixed coupon comes after 'fixed' coupon
            } else {
                return 0; // no change in order
            }
        });
        return discounts;
    }

    recordCouponMessage($wrapper, coupon_code, message, type, re_check) {
        if (!$wrapper.find('.wpf_coupon_responses').length) {
            $wrapper.append('<ul class="wpf_coupon_responses"></ul>');
        }

        const $responseDiv = $wrapper.find('.wpf_coupon_responses');
        if (re_check === 're_check_coupon') {
            type === 'error' ? $responseDiv.find('.wpf_success, .wpf_resp_item_' + coupon_code).remove() : '';
            $responseDiv.find('.wpf_resp_item_' + coupon_code).remove();
            delete this.appliedCoupons[coupon_code];
            // this.form.find('.__wpf_all_applied_coupons').attr('value', JSON.stringify(Object.keys(this.appliedCoupons)));
            this.calculatePayments();
        }
        $responseDiv.find('.wpf_error, .wpf_resp_item_' + coupon_code).remove();

        let errorHtml = jQuery('<li/>', {
            'class': `wpf_${type} wpf_resp_item_${coupon_code}`
        });

        let cross = jQuery('<span/>', {
            class: 'error-clear',
            html: '&times;',
            click: (e) => {
                $responseDiv.find('.wpf_resp_item_' + coupon_code).remove();
                delete this.appliedCoupons[coupon_code];
                this.form.find('.__wpf_all_applied_coupons').attr('value', JSON.stringify(Object.keys(this.appliedCoupons)));
                this.calculatePayments();
            }
        });

        $responseDiv.append(errorHtml.append(cross, message));
    }

    async stripeSetupItent(data) {
        showMessages(data.message, 'info', '', this.form, this.$formNoticeWrapper);
        this.buttonState('validating_form', 'Validating Card Info', true, data);
        const result = await this.stripe.confirmCardPayment(
            data.client_secret,
            {
                payment_method: data.payment_method_id
            }
        );

        if (result.error) {
            showMessages(result.error.message, 'error', this.$t('stripe_checkout_error'), this.form, this.$formNoticeWrapper);
            this.buttonState('sca_declined', '', false, result.error);
            return;
        }


        this.handleStripePaymentConfirm({
            action: 'wppayform_sca_inline_confirm_payment_setup_intents',
            wpf_nonce: this.generalConfig.wpf_nonce,
            form_id: this.formId,
            payment_method: result.paymentIntent.payment_method,
            payemnt_method_id: data.payemnt_method_id,
            payment_intent_id: result.paymentIntent.id,
            submission_id: data.submission_id,
            stripe_subscription_id: data.stripe_subscription_id,
            type: 'handleCardSetup'
        });

    }

    // This is for one time payment
    async initStripeSCAModal(data) {

        this.buttonState('authenticating_sca', 'Authenticating Payment', true, data);

        showMessages(data.message, 'info', '', this.form, this.$formNoticeWrapper);

        const {
            error: errorAction,
            paymentIntent
        } = await this.stripe.handleCardAction(
            data.stripe_payment_intent_client_secret
        );

        if (errorAction) {
            showMessages(errorAction.message, 'error', this.$t('stripe_checkout_error'), this.form, this.$formNoticeWrapper);
            this.buttonState('sca_declined', '', false, errorAction);
            return;
        }

        this.handleStripePaymentConfirm({
            action: 'wppayform_sca_inline_confirm_payment',
            wpf_nonce: this.generalConfig.wpf_nonce,
            form_id: this.formId,
            payment_method: paymentIntent.payment_method,
            payment_intent_id: paymentIntent.id,
            submission_id: data.submission_id,
            type: 'handleCardAction'
        });
    }

    // Not only stripe, it can be used for all payment module as well
    handleStripePaymentConfirm(data) {
        showMessages('Confirming Payment. Please wait a little bit...', 'info', '', this.form, this.$formNoticeWrapper);
        this.buttonState('confirming_payment', 'Confirming Payment', true, data);

        jQuery.post(this.generalConfig.ajax_url, data)
            .then(response => {
                if (!response || !response.data || typeof response == 'string') {
                    this.handleServerUnexpectedError(response);
                    return;
                }
                this.handlePaymentSuccess(response.data);
            })
            .fail(error => {
                if (typeof error == 'string' || !error.responseJSON.data) {
                    this.handleServerUnexpectedError(response);
                } else {
                    showMessages(error.responseJSON.data.errors, 'error', error.responseJSON.data.message, this.form, this.$formNoticeWrapper);
                }

                this.buttonState('payment_failed', '', false, error);
            })
            .always(() => {

            });
    }

    handlePaymentSuccess(data) {
        let confirmation = data.confirmation;
        this.form.parent().addClass('wpf_form_submitted');
        this.form.trigger('wpf_form_submitted', data);
        this.form.trigger('wpf_form_sucess', data);

        this.form.removeClass('wpf_submitting_form');
        this.form.find('button.wpf_submit_button').removeAttr('disabled');
        this.form.removeClass('wpf_submitting_form');

        if (confirmation.redirectTo == 'samePage') {
            this.form.removeClass('wpf_submitting_form');
            this.form.find('button.wpf_submit_button').removeAttr('disabled');
            this.form.parent().removeClass('wpf_form_has_errors');

            showMessages(confirmation.messageToShow, 'success', '', this.form, this.$formNoticeWrapper);
            if (confirmation.samePageFormBehavior == 'hide_form') {
                this.form.hide();
                jQuery([document.documentElement, document.body]).animate({
                    scrollTop: this.$formNoticeWrapper.offset().top - 100
                }, 200);
            }

            this.form.find('button.wpf_submit_button .wpf_txt_loading').hide();
            this.form.find('button.wpf_submit_button .wpf_txt_normal').show();

            jQuery('#wpf_form_id_' + this.formId)[0].reset();
            this.form.trigger('stripe_clear');
        } else if (confirmation.redirectTo == 'customUrl') {
            if (confirmation.messageToShow) {
                showMessages(confirmation.messageToShow, 'success', '', this.form, this.$formNoticeWrapper);
            }
            window.location.href = confirmation.customUrl;
            return false;
        }
    }


    // Step 2
    validateRecaptcha() {
        var that = this;
        return new Promise(function (resolve, reject) {
            if (that.form.attr('data-recaptcha_version') == 'v2') {
                let recaptchInstance = recaptchInstances['form_' + that.formId];
                if (recaptchInstance != undefined) {
                    let response = grecaptcha.getResponse(recaptchInstance);
                    if (!response) {
                        showMessages('', 'error', that.$t('verify_recaptcha'), that.form, that.$formNoticeWrapper);
                        reject('reCAPTCHA validation error');
                    } else {
                        resolve(response);
                    }
                }
            } else {
                resolve(true);
            }
        });
    }

    // Step 3
    stripeElementPaymentToken() {
        var that = this;
        return new Promise(function (resolve, reject) {

            if (that.paymentMethod != 'stripe') {
                resolve(true);
                return;
            }

            if (!that.stripeCard) {
                resolve(true);
                return;
            }

            that.buttonState('validating_form', 'Validating...', true);

            that.stripe.createPaymentMethod(
                'card',
                that.stripeCard
            ).then((result) => {
                if (result.error) {
                    reject(result.error.message);
                    return;
                }
                let paymentMethodId = result.paymentMethod.id;
                // Append the Payment Method ID to Form
                that.form.find('input[name=__stripe_payment_method_id]').remove();
                var hiddenInput = document.createElement('input');
                hiddenInput.setAttribute('type', 'hidden');
                hiddenInput.setAttribute('name', '__stripe_payment_method_id');
                hiddenInput.setAttribute('value', paymentMethodId);
                that.form.append(hiddenInput);
                resolve(true);
                return;
            });
        });
    }

    // step 4
    resolvePaymentGateways() {
      // call resolve_authorizedotnet dynamically by this.paymentMethod, and also check if that method exists
        if (typeof this['resolve_' + this.paymentMethod] === 'function') {
            return this['resolve_' + this.paymentMethod]();
        }

    }

    resolve_authorizedotnet() {
        var that = this;
        return new Promise(function (resolve, reject) {

            if (that.paymentMethod != 'authorizedotnet') {
                resolve(true);
                return;
            }

            // trigger onClick event for the button with class 'AcceptUI'
            jQuery('.AcceptUI').trigger('click');
            // now define the responseHandler function
            window.responseHandler = function (response) {
                if (response.messages.resultCode === "Error") {
                    showMessages(response.messages.message[0].text, 'error', that.$t('authorize_checkout_error'), that.form, that.$formNoticeWrapper);
                    that.buttonState('state_normal', '', false, response);
                    console.error('Error: ' + response.messages.message[0].code + ' ' + response.messages.message[0].text);
                    console.log('responseHandler', response);
                    reject(response.messages.message[0].text);
                } else {
                    // populate the hidden fields with the dataValue and dataDescriptor
                    jQuery("#dataValue").val(response.opaqueData.dataValue);
                    jQuery("#dataDescriptor").val(response.opaqueData.dataDescriptor);
                    // remove any instance of accept.js if anything remains so that everything is clean
                    // jQuery('.AcceptUI').remove();

                    resolve(true);
                }
            }

        
        });
    }

    // step 3.1 - If It's Stripe Hosted Checkout Option
    stripeRedirectToCheckout(data) {
        showMessages(data.message, 'success', '', this.form, this.$formNoticeWrapper);
        try {
            this.stripe.redirectToCheckout({
                sessionId: data.session_id
            }).then((result) => {
                
            });
        } catch (error) {
            showMessages(error.message, 'error', this.$t('stripe_checkout_error'), this.form, this.$formNoticeWrapper);
            this.buttonState('state_normal', '', false, error);
        }
    }

    // Payment Calculations
    calculatePayments(calculateFrom = 0) {
        let form = this.form;
        let hasCurrencySwitcher = false;
        if (this.form.find('select[name=currency_switcher]').length > 0 || this.form.find('input[name=currency_switcher]').length > 0) {
            hasCurrencySwitcher = true;
        }
        let elements = form.find('.wpf_payment_item, .wpf_donation_item, .wpf_input_dynamic_payment_item');
        let initialAmount = 0;
        // Get form id for table id
        let tableId = form.attr('id');
        let itemTotalValue = {};
        let itemTotalSummaryValue = {};

        let subscriptonAmountTotal = 0;
        elements.each(function (index, elem) {
            let donation_item_custom_name = jQuery(elem).attr('name');
            if (donation_item_custom_name?.includes('donation_item_custom') && hasCurrencySwitcher == false) {
                let percentage_name = `${tableId}_bar`;
                let raised_donation_name = `${tableId}_raised_donation`;
                let goal_amount_name = `${tableId}_goal_amount`;

                let progress_bar = jQuery(`div[name=${percentage_name}]`);
                let percent = jQuery(`div[name=${percentage_name}]`).data('percentage');
                let form_value = parseInt(jQuery(elem).val());
                let current_raised = jQuery(`div[name=${raised_donation_name}]`).data('raised');
                let goal_ammount = jQuery(`div[name=${goal_amount_name}]`).data('goal');

                let current_percentage = form_value ? (current_raised + form_value * 100) / goal_ammount : percent / 100;
                let round_parcentage_value = Math.round(current_percentage * 100);
                let bar_width = Math.min(round_parcentage_value, 100);
                progress_bar.animate(
                    {
                        width: bar_width + "%"
                    },
                    1000
                );

                current_percentage * 100 < 100 ? progress_bar.text(`${round_parcentage_value}%`)
                    : progress_bar.text('Goal reached');

            }
            let elementType = elem.type;
            let $elem = jQuery(elem);
            let elementName = $elem.attr('name');
            if (elementType == 'radio') {
                let $element = form.find('input[name=' + elementName + ']:checked');
                let subscriptionAmount =  $element.attr('data-subscription_amount');
                let itemValue = subscriptionAmount || $element.data('price');
                let customName = $element.attr('customname')
                initialAmount = $element.data('initial_amount');
                let hasCondition = $element.parents().eq(2).hasClass('wpf_excluded');
                if (itemValue && !elementName?.includes('donation_item') && !hasCondition) {
                    itemTotalValue[elementName] = parseInt(itemValue);
                    itemTotalSummaryValue[elementName] = {
                        name: elementName,
                        total: parseInt(itemValue),
                        initialTotal: parseInt(itemValue),
                        customName,
                        itemNames: []
                    }
                }
                if ($element.data['subscription_amount']) {
                    subscriptonAmountTotal += parseInt($element.data['subscription_amount']);
                }
                if(initialAmount) {
                    itemTotalValue[elementName + '_signup_fee'] = parseInt(initialAmount);
                    itemTotalSummaryValue[elementName + '_signup_fee'] = {
                        name: 'signup_fee',
                        total: initialAmount,
                        initialTotal: initialAmount,
                        customName: 'Signup Fee',
                        itemNames: []
                    }
                }
            }
            else if (elementType == 'hidden') {
                jQuery(`[single-paymen-item*=${elementName}]`)
                let payment_item_condition = jQuery(`[single-paymen-item*=${elementName}]`).attr('class')?.includes('wpf_excluded') ||
                $elem.parent().hasClass('wpf_excluded') || $elem.parents().hasClass('wpf_excluded');
                let itemClass = $elem.attr('class');
                let itemDataValue = $elem.attr('data-price');
                let dynamicPaymentAmount = itemClass !== 'wpf_input_dynamic_payment_item' ? itemDataValue : itemDataValue * 100;
                let subscriptionAmount =  $elem.attr('data-subscription_amount');
                let initialAmount = $elem.data('initial_amount');
                let itemValue = subscriptionAmount || dynamicPaymentAmount || $elem.attr('data-price');
                let customName = $elem.attr('customname');
                if (itemValue && payment_item_condition !== true) {
                    itemTotalValue[elementName] = parseInt(itemValue);
                    itemTotalSummaryValue[elementName] = {
                        name: elementName,
                        total: parseInt(itemValue),
                        initialTotal: parseInt(itemValue),
                        customName,
                        itemNames: []
                    }
                }
                if ($elem.attr('data-subscription_amount')) {
                    subscriptonAmountTotal += parseInt($elem.attr('data-subscription_amount'));
                }
                if(initialAmount) {
                    itemTotalValue[elementName + '_signup_fee'] = parseInt(initialAmount);
                    itemTotalSummaryValue[elementName + '_signup_fee'] = {
                        name: 'signup_fee',
                        total: initialAmount,
                        initialTotal: initialAmount,
                        customName: 'Signup Fee',
                        itemNames: []
                    }
                }
            } else if ($elem.data('is_custom_price') == 'yes') {
                let itemValue = jQuery(this).val();
                let condition = jQuery($elem)?.closest(".wpf_excluded")?.hasClass('wpf_excluded');
                if (itemValue && !condition) {
                    let customName = $elem.attr('customname');
                    itemTotalValue[elementName] = parseInt(parseFloat(itemValue) * 100);
                    itemTotalSummaryValue[elementName] = {
                        name: elementName,
                        total: parseInt(parseFloat(itemValue) * 100),
                        initialTotal: parseInt(parseFloat(itemValue) * 100),
                        customName,
                        itemNames: []
                    }
                }
            } else if (elementType == 'checkbox') {
                let groupId = $elem.data('group_id');
                let groups = form.find('input[data-group_id="' + groupId + '"]:checked');
                let customName = $elem.attr('groupname');
                let itemNames = [];
                let groupTotal = 0;
                groups.each((index, group) => {
                    let itemPrice = jQuery(group).data('price');
                    let groupname = jQuery(group).attr('customname');
                    itemNames.push(groupname)
                    if (itemPrice) {
                        groupTotal += parseInt(itemPrice);
                    }
                });
                if (groupTotal > 0) {
                    itemTotalValue[groupId] = groupTotal;
                    itemTotalSummaryValue[groupId] = {
                        name: groupId,
                        total: groupTotal,
                        initialTotal: groupTotal,
                        customName,
                        itemNames

                    }
                }
            }
            else if (elementType == 'select-one') {
                let $element = form.find('select[name=' + elementName + '] option:selected');
                let subscriptionAmount =  $element.attr('data-subscription_amount');
                let itemValue = subscriptionAmount || $element.data('price');
                let customName = $element.attr('customname');
                let hasCondition = $element.parents().eq(2).hasClass('wpf_excluded');
                if (itemValue && !hasCondition) {
                    itemTotalValue[elementName] = parseInt(itemValue);
                    itemTotalSummaryValue[elementName] = {
                        name: elementName,
                        total: parseInt(itemValue),
                        initialTotal: parseInt(itemValue),
                        customName,
                        itemNames: []
                    }
                }
                initialAmount = $element.data('initial_amount');
                if ($element.attr('data-subscription_amount')) {
                    subscriptonAmountTotal += parseInt($element.attr('data-subscription_amount'));
                }

                if(initialAmount) {
                    itemTotalValue[elementName + '_signup_fee'] = parseInt(initialAmount);
                    itemTotalSummaryValue[elementName + '_signup_fee'] = {
                        name: 'signup_fee',
                        total: initialAmount,
                        initialTotal: initialAmount,
                        customName: 'Signup Fee',
                        itemNames: []
                    }
                }
            }
        });

        let allTotalAmount = calculateFrom;

        itemTotalValue = this.calculateTabularTotal(itemTotalValue, itemTotalSummaryValue);
        // Get The Total Now
        allTotalAmount = 0;
        const toDelete = [];
        jQuery.each(itemTotalValue, (itemName, itemValue) => {
            if (itemValue) {
                // check if there has a quantity
                let targetQuantity = form.find('.wpf_item_qty[data-target_product=' + itemName + ']');
                if (targetQuantity.length) {
                    let qty = jQuery(targetQuantity).val();
                    const parsedQty = parseInt(qty, 10);
                    if (!isNaN(parsedQty)) {
                        let lineTotal = Math.abs(parsedQty) * itemValue;
                        itemTotalValue[itemName] = lineTotal;
                        itemTotalSummaryValue[itemName].total = lineTotal;
                        itemTotalSummaryValue[itemName].qty = qty;
                        allTotalAmount += lineTotal;
                        if (parsedQty > 1 && parseInt(initialAmount) > 0) {
                            allTotalAmount = allTotalAmount - ((parsedQty - 1) * parseInt(initialAmount));
                        }
                    } else {
                        toDelete.push(itemName);
                    }
                } else {
                    const isExcluded = jQuery(`.wpf_item_${itemName}`)
                        .closest('.wpf_has_condition').hasClass('wpf_excluded');
                    if (!isExcluded) {
                        allTotalAmount += itemValue;
                    }
                }
            }
        });
        toDelete.forEach(itemName => {
            delete itemTotalValue[itemName];
            delete itemTotalSummaryValue[itemName];
        });
        //* Render payment summary table
        let paymentWithoutDis = allTotalAmount;

        // DISCOUNT CALCULATION START
        const discounts = this.getDiscounts();
        var totalDiscounts = 0;
        jQuery.each(discounts, (index, discount) => {
            let discountAmount = discount.amount;
            if (discount.coupon_type == 'percent') {
                discountAmount = (discount.amount / 100) * allTotalAmount;
            } else {
                discountAmount = (discount.amount * 100)
            }
            allTotalAmount -= discountAmount;
            totalDiscounts += discountAmount;
        });
        let formId = `total_discount_${jQuery(this.form).attr('id')}`;
        itemTotalSummaryValue[formId] = {
            name: formId,
            total: totalDiscounts,
            initialTotal: '',
            customName: 'Discounts',
            itemNames: [],
            is_discount_tax_field: true
        }
        // DISCOUNT CALCULATION END

        this.toggleChoosePaymentMethodWithCoupon(paymentWithoutDis, totalDiscounts);

        let subTotal = allTotalAmount;
        let taxAmount = this.calCulateTaxAmount(itemTotalValue, totalDiscounts, allTotalAmount, itemTotalSummaryValue);
        if (taxAmount) {
            allTotalAmount += taxAmount;
        }

        form.find('.wpf_calc_tax_total').html(this.getFormattedPrice(taxAmount));
        form.find('.wpf_calc_sub_total').html(this.getFormattedPrice(subTotal));
        form.find('.wpf_calc_payment_total').html(this.getFormattedPrice(allTotalAmount));
        form.data('payment_total', allTotalAmount);
        form.data('payment_total_without_discount', paymentWithoutDis);
        form.data('subscription_total', subscriptonAmountTotal);
        form.data('wpf_total_discount', totalDiscounts);
        form.data('tax_total', taxAmount);
        this.payemntSummaryTable(itemTotalSummaryValue, allTotalAmount, tableId);
        // Defer so scripts that depend on wppayform_public (e.g. fee-recovery.js) have
        // had their jQuery DOM-ready callback run and registered their listeners first.
        const _form = this.form;
        setTimeout(() => _form.trigger('wpf_payment_calculated'), 0);
    }

    toggleChoosePaymentMethodWithCoupon(paymentWithoutDis, totalDiscounts) {
        if (paymentWithoutDis == totalDiscounts) {
            jQuery(this.form).find('#wpf_choose_payment_method').addClass('wpf_hide_choose_payment_method');
            jQuery(this.form).find('input[name=__wpf_selected_payment_method]').attr('checked', false);
            jQuery(this.form).find('input[name=__wpf_selected_payment_method]').attr('required', false);
            jQuery(this.form).find('p.wpf_payment_gateway_validation_error').css('display', 'none');
            let paymentMethod = jQuery(this.form).find('.wpf_all_payment_methods_wrapper');
            if (jQuery(this.form).find('[data-checkout_style=embedded_form]').length > 0) {
                paymentMethod.css('display', 'block');
            } else {
                paymentMethod.css('display', 'none');
            }            

            const choosePaymentMethod = jQuery(this.form).find('#wpf_choose_payment_method');  
            const selectedInput = choosePaymentMethod.find('input[name=__wpf_selected_payment_method]')
            .attr('required', true)
            .filter('.default_selected')
            .attr('checked', true); 
            const default_input = selectedInput?.prevObject[0] ?? null;
            if(default_input){
                default_input.click();
            }
            // jQuery(this.form).find('div.error').css('display', 'none');
        } else {
            // jQuery(this.form).find('#wpf_choose_payment_method').removeClass('wpf_hide_choose_payment_method');
            // jQuery(this.form).find('input[name=__wpf_selected_payment_method]').attr('required', true);
            // jQuery(this.form).find('.wpf_payment_gateway_validation_error').css('display', 'block');

            const choosePaymentMethod = jQuery(this.form).find('#wpf_choose_payment_method');  
            choosePaymentMethod.removeClass('wpf_hide_choose_payment_method');
            const selectedInput = choosePaymentMethod.find('input[name=__wpf_selected_payment_method]')
            .attr('required', true)
            .filter('.default_selected')
            .attr('checked', true); 

            choosePaymentMethod.find('.wpf_payment_gateway_validation_error').css('display', 'block');
            choosePaymentMethod
                .off('click.wpfFormHandler', 'input[name=__wpf_selected_payment_method]')
                .on('click.wpfFormHandler', 'input[name=__wpf_selected_payment_method]', function() {
                    selectedInput.removeClass('default_selected');
                    choosePaymentMethod.find('input[name=__wpf_selected_payment_method]').removeClass('selected');
                    jQuery(this).addClass('selected')
                                .attr('checked', true);
                    jQuery(this).trigger('change');
                });
        }
    }

    getRecurringItems() {
        // get initial amount from subscription items
        let recurringItems = this.form.find('[data-element_type="recurring_payment_item"]');
        let initialAmountTotal = 0;        
        // Process initial amounts from subscription items
        recurringItems.each((_, element) => {
            const $element = jQuery(element);
            
            // Find all relevant payment elements in one selector
            const inputElements = $element.find(
                'select.wpf_payment_item option:selected[data-initial_amount], ' + 
                'input[type="radio"].wpf_payment_item:checked[data-initial_amount], ' +
                'input[type="hidden"].wpf_payment_item[data-initial_amount]'
            );

            // Process each element
            inputElements.each((_, inputElement) => {
                const $input = jQuery(inputElement);
                const initialAmount = $input.attr('data-initial_amount');
                
                if (initialAmount && !isNaN(parseFloat(initialAmount))) {
                    initialAmountTotal += parseFloat(initialAmount);
                }
            });
        });

        return initialAmountTotal;
    }

    calCulateTaxAmount(itemizedValue, totalDiscounts, allTotalAmount, itemTotalSummaryValue) {
        let form = this.form;
        if (!form.hasClass('wpf_has_tax_item')) {
            return 0;
        }
        // get initial amount from subscription items
        const initialAmountTotal = this.getRecurringItems();
        
        let taxLines = form.find('label.wpf_tax_line_item');
        let taxTotal = 0;
        let signupFeeTax = 0;
        jQuery.each(taxLines, (index, lineItem) => {
            let $line = jQuery(lineItem);
            let targetItem = $line.data('target_product');
            targetItem = targetItem?.includes('donation_item') ? targetItem + '_custom' : targetItem;
            let taxPercent = parseFloat($line.data('tax_percent'));
            let taxId = $line.attr('id');
            let isExcluded = $line.closest('.wpf_has_condition.wpf_excluded');
            if (isExcluded.length > 0) {  
                return;
            }
            let taxLineAmount = 0;
            if (itemizedValue[targetItem] && taxPercent) {
                if (totalDiscounts) {
                    let targetVal = itemizedValue[targetItem];
                    let percentDiscount = (totalDiscounts * 100) / (allTotalAmount + totalDiscounts);
                    let baseVal = targetVal - (targetVal * (percentDiscount / 100))
                    taxLineAmount = baseVal * (taxPercent / 100);
                } else {
                    taxLineAmount = itemizedValue[targetItem] * (taxPercent / 100);

                }

                taxTotal += Math.round(taxLineAmount, 0);
            } else {
            }

            // calculate signup fee tax
            if (initialAmountTotal > 0 && taxPercent > 0 && targetItem === 'recurring_payment_item') {
                let initialAmountTax = initialAmountTotal * (taxPercent / 100);
                signupFeeTax = Math.round(initialAmountTax);
            }
            // update tax display
            if (taxLineAmount > 0 && signupFeeTax > 0) {
                jQuery('span[data-target_tax=' + taxId + ']').html(
                    this.getFormattedPrice(taxLineAmount) + 
                    ',' + ' signup fee tax: ' + 
                    this.getFormattedPrice(signupFeeTax)
                );
            } else {
                jQuery('span[data-target_tax=' + taxId + ']').html(this.getFormattedPrice(taxLineAmount));
            }
            
        });
        let formId = `total_tax_${jQuery(this.form).attr('id')}`;
        itemTotalSummaryValue[formId] = {
            name: formId,
            total: taxTotal,
            initialTotal: '',
            customName: 'Total tax',
            itemNames: [],
            is_discount_tax_field: true
        }
        if (signupFeeTax > 0) {
            let signupFeeTaxId = `signup_fee_tax_${jQuery(this.form).attr('id')}`;
            itemTotalSummaryValue[signupFeeTaxId] = {
                name: signupFeeTaxId,
                total: signupFeeTax,
                initialTotal: '',
                customName: 'Signup Fee Tax',
                itemNames: [],
                is_discount_tax_field: true
            }
        }

        if (signupFeeTax > 0) {
            taxTotal += signupFeeTax;
        }
        return taxTotal;
    }

    payemntSummaryTable(calculateTableData, allTotalAmount, tableId) {
        // Get the current form's table div
        const currentFormTableDiv = this.form.find('#wpf_table_div');
        // Clear only this form's table content
        currentFormTableDiv.find(`#${tableId} > tbody`).html("");
        // If table doesn't exist, create it
        if (currentFormTableDiv.find(`#${tableId}`).length <= 0) {
            currentFormTableDiv.append(`<table id=${tableId}>
                <thead>
                    <tr>
                        <th>${this.$t('Item')}</th>
                        <th>${this.$t('Price')}</th>
                        <th>${this.$t('Qty')}</th>
                        <th>${this.$t('Line Total')}</th>
                    </tr>
                </thead>
                <tbody></tbody></table>`);
            currentFormTableDiv.find(`table#${tableId}`).addClass('wpf_regular_table ');
        }
        const renderData = (item = []) => {
            if (item?.length) {
                let listItem = item.map(it => (
                    `<li>${it}</li>`
                ))
                return listItem;
            }
        }

        const tabularProductCalculation = (item = []) => {
            if (item?.length) {
                let listItem = '';
                // If condition added for these currencies because right now I couldn't find why they are casuing issue for tabular product item and quantity related calculation, will remove it later.
                if ('AED' !== this.currency_settings?.currency && 'AFN' !== this.currency_settings?.currency && 'SAR' !== this.currency_settings?.currency && 'QAR' !== this.currency_settings?.currency && 'LBP' !== this.currency_settings?.currency) {
                    listItem = item.map(it => (
                        `<span><strong>${it?.product_name}: </strong>${it?.qty} X ${this.getFormattedPrice(it?.price)} = ${this.getFormattedPrice(it?.qty * (it?.price))} </span><br>`
                    ))
                } else {
                    listItem = item.map(it => (
                        `<span><strong>${it?.product_name}: </strong>${it?.qty} X ${it?.price / 100} = ${it?.qty * (it?.price / 100)} </span><br>`
                    ))
                }

                return listItem;
            }
        }
        const renderQty = (item = {}) => {
            if (item?.totalQty || item?.qty) {
                return item.totalQty || item.qty;
            }
            return 1;
        }
        for (let key in calculateTableData) {
            currentFormTableDiv.find(`tr#${tableId}_total`).remove();
            let item = calculateTableData[key];
            if (item.total >= 1) {

                currentFormTableDiv.find(`#${tableId} > tbody:last-child`)
                    .append(`<tr id=${key}>
                            <td id=${key}_name>
                            ${item.customName || ''}
                                <ul>
                                    ${item.itemNames.length ? renderData(item.itemNames).join('') : ''}
                                </ul>
                            </td>
                            <td id=${key}_price>
                                ${Array.isArray(item?.initialTotal) ? tabularProductCalculation(item?.initialTotal).join('') : item?.is_discount_tax_field ? '' : this.getFormattedPrice(item.initialTotal)}
                            </td>
                            <td id=${key}_qty>
                                ${item?.is_discount_tax_field ? '' : renderQty(item)}
                            </td>
                            <td id=${key}_total>${this.getFormattedPrice(item.total) || this.getFormattedPrice(item.initialTotal)}</td>
                        </tr>`
                    );
            }
        }
        // add table total row
        currentFormTableDiv.find(`#${tableId} > tbody:last-child`)
            .append(`<tr id=${tableId}_total>
                <td colspan="3" align="right">
                    <strong>${this.$t('Total')}</strong>
                </td>
                <td id=${tableId}_total><strong>${allTotalAmount ? this.getFormattedPrice(allTotalAmount) : 0}</strong></td>
            </tr>`
            );
    }

    getTotalFeaturePrice(productLine) {
        let totalFeaturePrice = 0;
        jQuery(productLine).find('.wpf_tabular_multiple_option').each(function () {
            let featurePrice = jQuery(this).find(':selected').attr('price');
            totalFeaturePrice = totalFeaturePrice + +featurePrice;
        });
        let defaultPrice = jQuery(productLine).find('.wpf-product-price').data('value');
        let updatedPrice = defaultPrice + totalFeaturePrice;
        jQuery(productLine).find('.wpf-product-price').html(this.currency_settings?.currency_sign + updatedPrice);
        return totalFeaturePrice;
    }

    calculateTabularTotal(itemizedValue, itemTotalSummaryValue, isTabularProductSelected = false) {
        let form = this.form;
        // Tabular product calculation
        let productTables = form.find('table.wpf_tabular_items, .wpf_tabular_items');
        // Lopp for each tabular product table
        jQuery.each(productTables, (index, productTable) => {
            let $productTable = jQuery(productTable);
            // Get tabular product id
            let productId = $productTable.data('produt_id');
            // check the conditional logic
            let approve_condition = jQuery(`[tabular_item_id*=${productId}]`).attr('class').includes('wpf_excluded');
            // find the total product cost
            if (approve_condition === false) {
                let productLines = $productTable.find('tbody tr');
                // get product lines for grid and row template
                productLines = productLines?.length === 0 ? $productTable.find('.wpf-product-body') : productLines;
                let customName = $productTable.attr('customname');
                let tableTotal = 0;
                let totalQty = 0;
                let totalPrice = [];
                // Loop for each product of single product table
                jQuery.each(productLines, (index, productLine) => {
                    let price_input = jQuery(productLine).find('input.wpf_tabular_price');
                    let is_checked = jQuery(price_input).is(':checked');
                    let type = jQuery(price_input).attr('type');
                    if (!is_checked && type == 'checkbox') {
                        return;
                    }
                    let totalFeaturePrice = this.getTotalFeaturePrice(productLine);
                    let price = jQuery(productLine).find('input.wpf_tabular_price').data('price');
                    price = price + totalFeaturePrice * 100;
                    // console.log(jQuery(productLine).find('.wpf-product-price').text(price), 'sdjkg')
                    // If product is not selected then skip the calculation for that product
                    if (jQuery(productLine).parent().find('input:checkbox').length === 1) {
                        if (jQuery(productLine).parent().find('input:checkbox:checked').length === 0) {
                            // isTabularProductSelected will be true only form submitted time and if any product is not selected then it will remove the product from the calculation
                            if (isTabularProductSelected) {
                                jQuery(productLine).remove();
                            }
                            return;
                        }
                    }
                    let product_name = jQuery(productLine).find('td.wpf_tabular_price').prev().text();
                    // get product name for grid template
                    product_name = product_name ? product_name : jQuery(productLine).find('input.wpf_tabular_price').attr('wpf_product_name');
                    // console.log('clicked', product_name);
                    let qty = jQuery(productLine).find('input.wpf_tabular_qty').val();
                    if (price && qty && qty !== '0') {
                        tableTotal = tableTotal + (parseInt(price) * parseInt(qty));
                        totalQty = totalQty + parseInt(qty);
                        totalPrice.push({ qty, price, product_name });
                    }
                });
                // isTabularProductSelected will be true only form submitted time and not required to update the total price in submitted time
                if (isTabularProductSelected) {
                    return;
                }
                form.find('span.wpf_calc_tabular_' + productId).html(this.getFormattedPrice(tableTotal));
                // let conditional_id = `conditional_${productId}`
                form.find(`[name=${productId}]`).val(tableTotal / 100);
                $productTable.attr('data-item_total', tableTotal);
                itemizedValue[productId] = tableTotal;
                itemTotalSummaryValue[productId] = {
                    name: productId,
                    total: tableTotal,
                    initialTotal: totalPrice,
                    customName,
                    itemNames: [],
                    qty: 1,
                    totalQty
                }
            }
        });

        return itemizedValue;
    }

    getFormattedPrice(amount) {
        return formatPrice(amount, this.config?.currency_settings);
    }

    // Payment Method change Detector
    initPaymentMethodChange() {
        let form = this.form;
        if (parseInt(this.form.find('input[name=__wpf_valid_payment_methods_count]').val()) > 1) {
            let defaultSelected = this.form.find('input[name=__wpf_selected_payment_method]:checked').val();
            this.handlePaymentMethodChange(defaultSelected);
            form.on('change.wpfFormHandler', 'input[name=__wpf_selected_payment_method]', function () {
                form.trigger('payment_method_changed', jQuery(this).val());
            });
            form.on('payment_method_changed.wpfFormHandler', (event, value) => {
                this.handlePaymentMethodChange(value);
            });
        } else {
            // We have to check if any hidden / single payment method exists or not
            let paymentMethod = this.form.find('[data-wpf_payment_method]').data('wpf_payment_method');
            if (paymentMethod) {
                this.form.data('selected_payment_method', paymentMethod);
                this.paymentMethod = paymentMethod;
            }
        }
    }

    // Currency change detector
    initCurrencyChange() {
        this.currencyRates = this?.formConfig && this.formConfig['rates'];
        let form = this.form;
        form.on('change.wpfFormHandler', 'select[name=currency_switcher]', function () {
            form.trigger('currency_changed', jQuery(this).val());
        });
        form.on('change.wpfFormHandler', 'input[name=currency_switcher]', function () {
            form.trigger('currency_changed', jQuery(this).val());
        });

        form.on('currency_changed.wpfFormHandler', (event, value) => {
            if (undefined != this.currencyRates && undefined != this.currencyRates[value]['value']) {
                this.handleCurrencyChange(value);
            }
        });
    }

    // Handle currecny change
    handleCurrencyChange(currency) {
        const rate = this.currencyRates[currency]['value'];
        if (rate != NaN || undefined != rate) {
            const symbol = this.convertHtmlEntityToSymbol(this.generalConfig.currency_symbols[currency]);
            const inputPreElement = this.form.find('.wpf_input-group-text.wpf_input-group-text-prepend');
            inputPreElement[0].innerHTML = symbol;

            const customDonationElement = this.form.find('.wpf_donation_custom_amount');
            const customDonation = customDonationElement[0].getAttribute('base-currency-price');
            /**
             * To keep the exact precise value first we get the converted value with rate
             * then we get the total value in int by multiplying by 100
             * then get the exact precise float vlaue by parsing with deviding by 100
             * ex: 1729.8784 to get 1729.87 , first we get 172987 in int then we get 1729.87 after parsing float by deviding by 100
             * If we wanted to make it round to 2 as 1729.88 we could just parseFloat().toFixed(2)
             */
            let convertedValue = parseFloat(customDonation * rate);
            let totalValueInInt = Math.floor(convertedValue * 100);
            let exactPreciseFloatValue = parseFloat(totalValueInInt / 100);
            customDonationElement[0].setAttribute('data-price', exactPreciseFloatValue);
            customDonationElement[0].value = exactPreciseFloatValue;
            customDonationElement.trigger('change');

            const donationItems = document.querySelectorAll('.wpf_input_content.wpf_donation_controls_radio .form-check');
            // Loop through each pair of elements
            donationItems.forEach((item) => {
                // Get the <input> element within the current <div>
                const inputElement = item.querySelector('input.wpf_payment_item');
                // Get the <span> element within the current <div>
                const spanElement = item.querySelector('span.wpf_price_option_name');

                // Check if the input and span elements exist before proceeding
                if (inputElement && spanElement) {
                    // Get the data-price attribute value from the input element
                    const basePrice = parseFloat(inputElement.getAttribute('base-price'));
                    if (basePrice != '' && basePrice != 0) {
                        let convertedValue = parseFloat(basePrice * rate).toFixed(2);
                        inputElement.setAttribute('data-price', convertedValue);
                        let result = Math.floor((convertedValue / 100) * 100);
                        // check is it a text or currencyvalue in html view of the element
                        let innerText = spanElement.innerHTML;
                        const letterPattern = /^[A-Za-z]+$/;
                        let isNormalText = letterPattern.test(innerText);
                        // if (!isNormalText) {
                        //     spanElement.innerHTML = symbol + parseFloat(result / 100);
                        // }
                    }
                }
            });
        }
    }

    convertHtmlEntityToSymbol(htmlEntity) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlEntity;
        return tempElement.textContent;
    }

    handlePaymentMethodChange(paymentMethod) {
        this.form.data('selected_payment_method', paymentMethod);
        if (!paymentMethod) {
            this.paymentMethod = '';
            this.form.find('.wpf_all_payment_methods_wrapper').hide();
            return;
        }
        this.paymentMethod = paymentMethod;
        this.form.find('.wpf_all_payment_methods_wrapper').show();
        this.form.find('.wpf_all_payment_methods_wrapper .wpf_payment_method_element').hide();
        this.form.find('.wpf_all_payment_methods_wrapper .wpf_payment_method_element_' + paymentMethod).show();
    }

    // Stripe Element Handler
    initStripeElement() {
        let elements = this.stripe.elements();
        var style = {
            base: {
                color: "#32325d",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        };

        var card = elements.create("card", {
            style: style,
            hidePostalCode: this.config.stripe_verify_zip != 'yes'
        });
        // Add an instance of the card Element into the `card-element` <div>.
        card.mount("#" + this.config.stripe_element_id);

        card.addEventListener('change', (event) => {
            if (event.error) {
                this.form.find('.wpf_card-errors').html(event.error.message);
            } else {
                this.form.find('.wpf_card-errors').html('');
            }
        });

        this.stripeCard = card;

        this.form.on('stripe_clear.wpfFormHandler', () => {
            card.clear();
        });
    }

    // Error and Success Messages
    handleServerUnexpectedError(response) {
        showMessages(response, 'error', this.$t('submission_error'), this.form, this.$formNoticeWrapper);
        this.buttonState('normal', '', false);
    }

    fireFormEvents(events, dataOrEvent) {
        if (typeof events == 'object') {
            jQuery.each(events, (index, eventName) => {
                this.form.trigger(eventName, [dataOrEvent]);
            });
        }
    }

    buttonState(state, loadingText, isDisabled, data) {

        let knownStates = 'wpf_submitting wpf_validating_form wpf_submitting_form wpf_authenticating_sca wpf_sca_declined wpf_confirming_payment';
        this.form.removeClass(knownStates);

        if (loadingText) {
            this.form.find('button.wpf_submit_button .wpf_txt_normal').hide();
            this.form.find('button.wpf_submit_button .wpf_txt_loading').text(loadingText).show();
        } else {
            this.form.find('button.wpf_submit_button .wpf_txt_loading').hide();
            this.form.find('button.wpf_submit_button .wpf_txt_normal').show();
        }

        if (isDisabled) {
            this.form.addClass('wpf_has_disabled_btn');
            this.form.find('button.wpf_submit_button').attr('disabled', true);
        } else {
            this.form.removeClass('wpf_has_disabled_btn');
            this.form.find('button.wpf_submit_button').attr('disabled', false);
        }

        this.form.addClass('wpf_' + state);
        this.form.trigger('wpf_' + state, [this.formId, data]);
    }

    /*
    * Subscription related functions
     */
    maybeSubscriptionSetup() {
        // Handle Radio Button Select
        let form = this.form;
        let that = this;

        function checkForRadio(element) {
            let elementName = jQuery(element).attr('name');
            let selectedIndex = parseInt(jQuery(element).val());
            if (isNaN(selectedIndex)) {
                selectedIndex = 0;
            }
            let $wrapper = jQuery(element).closest('.wpf_subscription_controls_radio');
            $wrapper.find('.wpf_subscription_plan_summary_item').hide();
            $wrapper.find('.wpf_subscription_plan_summary_' + elementName + ' .wpf_subscription_plan_index_' + selectedIndex).show();

            $wrapper.find('.subscription_radio_custom').hide();
            $wrapper.find('.subscription_radio_custom_' + selectedIndex).show();
        }

        jQuery.each(form.find('.wpf_subscription_controls_radio input:checked'), function (index, element) {
            checkForRadio(element);
        });

        form.on('change.wpfFormHandler', '.wpf_subscription_controls_radio input[type=radio]', function () {
            checkForRadio(this);
        });

        // Handle Selection Button Select
        function checkForSelections(element) {
            let elementName = jQuery(element).attr('id');
            let selectedIndex = parseInt(jQuery(element).val());
            if (isNaN(selectedIndex)) {
                selectedIndex = 0;
            }
            form.find('.wpf_subscription_plan_summary_' + elementName + ' .wpf_subscription_plan_summary_item').hide();
            form.find('.wpf_subscription_plan_summary_' + elementName + ' .wpf_subscription_plan_index_' + selectedIndex).show();
        }

        jQuery.each(form.find('.wpf_subscrion_plans_select option:selected'), function (index, element) {
            if (jQuery(element).attr('value') != '') {
                checkForSelections(jQuery(element).parent());
            }
        });

        form.on('change.wpfFormHandler', '.wpf_subscrion_plans_select select', function () {
            checkForSelections(this);
        });
    }
    maybeCustomSubscriptionItemSetup() {
        let that = this;
        let form = this.form;
        let formSettings = this.config;
        form.on('change.wpfFormHandler', '.wpf_custom_subscription_input', function () {
            var $el = jQuery(this);
            var value = Math.round($el.val() * 100);
            var $hiddenEl = $el.parent().parent().parent().find('.wpf_payment_item'); $hiddenEl.attr('data-subscription_amount', value);
            var totalAmount = value;

            if (parseInt($el.data('initial_amount')) > 0) {
                totalAmount += parseInt($el.data('initial_amount'))
            }
            
            $hiddenEl.attr('data-price', totalAmount);
            let $parent = $el.closest('.wpf_form_group');

            $parent.find('.wpfbs_subscription_amount').html(formatPrice(value, formSettings.currency_settings))
            $parent.find('.wpfbs_first_interval_total').html(formatPrice(totalAmount, formSettings.currency_settings))

            $hiddenEl.trigger('change');
        });
        form.on('change.wpfFormHandler', '.wpf_custom_subscription_amount_radio, .wpf_custom_subscription_amount_select', function () {
            let $el = jQuery(this);
            let index = $el.data('plan_index');
            let value = parseInt($el.val() * 100);

            let $parent = $el.closest('.wpf_multi_form_controls');
            let $summary = $parent.find('.wpf_subscription_plan_summary')
                .find('.wpf_subscription_plan_index_' + index);

            var $input = $parent.find('.wpf_option_custom_' + index);
            var totalAmount = value;
            if (parseInt($input.data('initial_amount')) > 0) {
                totalAmount += parseInt($input.data('initial_amount'))
            }

            $input.attr('data-subscription_amount', value);
            $input.attr('data-price', totalAmount);

            $summary.find('.wpfbs_subscription_amount')
                .html(formatPrice(value, formSettings.currency_settings));

            $summary.find('.wpfbs_first_interval_total')
                .html(formatPrice(totalAmount, formSettings.currency_settings));

            // $input
            //     .data('subscription_amount', value)
            //     .data('price', totalAmount);

            that.calculatePayments();
        });
    }

}

export default PayFormHandler;