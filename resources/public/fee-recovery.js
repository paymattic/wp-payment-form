jQuery(() => {
    class FeeRecovery {
        constructor() {
            this.bindEvents();
            this.initExistingForms();
        }

        // wpf_payment_calculated fires during FormHandler.initForm() which runs in its own
        // jQuery DOM-ready — before this script's DOM-ready runs. Catch those forms here.
        initExistingForms() {
            jQuery('.wpf_form').each((_, formEl) => {
                const $form = jQuery(formEl);
                if ($form.find('.wpf_fee_recovery_wrap').length) {
                    this.updateFeeDisplay($form);
                }
            });
        }

        bindEvents() {
            jQuery(document).on('wpf_payment_calculated', '.wpf_form', (e) => {
                this.updateFeeDisplay(jQuery(e.currentTarget));
            });

            jQuery(document).on('change', '.wpf_form .wpf_fee_recovery_checkbox', (e) => {
                this.updateFeeDisplay(jQuery(e.currentTarget).closest('.wpf_form'));
            });

            // FormHandler fires 'payment_method_changed' on .wpf_form when gateway switches
            jQuery(document).on('payment_method_changed', '.wpf_form', (e) => {
                this.updateFeeDisplay(jQuery(e.currentTarget));
            });
        }

        // Mirrors collectFormData() in dynamic_calculation.js — single place where
        // all form state is read so updateFeeDisplay stays pure.
        collectPaymentData(form) {
            const $wrap     = form.find('.wpf_fee_recovery_wrap');
            const baseCents = parseInt(form.data('payment_total') || 0, 10);
            const gateway   = this.getActiveGateway(form);
            const rate      = $wrap.length ? this.getRate($wrap, gateway) : null;
            const donorOptIn = $wrap.length ? $wrap.data('donor-opt-in') : false;
            return { $wrap, baseCents, gateway, rate, donorOptIn };
        }

        calcFee(baseCents, percent, fixedCents) {
            if (percent > 0 && fixedCents > 0) {
                return Math.ceil((baseCents + fixedCents) / (1 - percent / 100)) - baseCents;
            }
            return Math.ceil(baseCents * (percent / 100) + fixedCents);
        }

        getRate($wrap, gateway) {
            const rateType = $wrap.data('rate-type');

            if (rateType === 'global_rate') {
                return $wrap.data('global-rate');
            }

            const rows = $wrap.data('gateway-rates') || [];
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].gateway === gateway) {
                    return { percent: rows[i].percent, fixed: rows[i].fixed };
                }
            }
            return null;
        }

        // Mirrors wpPayFormFormattedMoney() in boot/wppayform-globals.php exactly.
        getFormattedAmount(cents, form) {
            const formConfig = window[`wp_payform_${form.attr('wpf_form_instance')}`] || {};
            const cs         = formConfig.currency_settings || {};
            const sign       = cs.currency_sign || '$';
            const position   = cs.currency_sign_position || 'left';
            const dotComma   = (cs.currency_separator || 'dot_comma') === 'dot_comma';
            const decSep     = dotComma ? '.' : ',';
            const thouSep    = dotComma ? ',' : '.';
            const decPoints  = (cents % 100 === 0 && parseInt(cs.decimal_points, 10) === 0) ? 0 : 2;

            const raw    = (cents / 100).toFixed(decPoints);
            const parts  = raw.split('.');
            parts[0]     = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thouSep);
            const amount = parts.length > 1 ? parts[0] + decSep + parts[1] : parts[0];

            switch (position) {
                case 'left_space':  return sign + ' ' + amount;
                case 'right':       return amount + sign;
                case 'right_space': return amount + ' ' + sign;
                default:            return sign + amount;
            }
        }

        getActiveGateway(form) {
            // FormHandler sets this via handlePaymentMethodChange — most reliable source
            const stored = form.data('selected_payment_method');
            if (stored) return stored;

            // Multi-gateway: radio buttons (name="__wpf_selected_payment_method")
            const checked = form.find('input[name="__wpf_selected_payment_method"]:checked').val();
            if (checked) return checked;

            // Single-gateway: hidden wrapper with data attribute
            const single = form.find('[data-wpf_payment_method]').data('wpf_payment_method');
            if (single) return single;

            return 'stripe';
        }

        updateFeeDisplay(form) {
            const { $wrap, baseCents, gateway, rate, donorOptIn } = this.collectPaymentData(form);

            if (!$wrap.length) return;

            if (!rate || baseCents <= 0) {
                $wrap.find('.wpf_fee_amount').text('--');
                $wrap.find('.wpf_fee_recovery_amount').val(0);
                $wrap.find('.wpf_fee_recovery_gateway').val('');
                this.removeFeeRow(form, baseCents);
                return;
            }

            const feeCents     = this.calcFee(baseCents, rate.percent, rate.fixed);
            const feeFormatted = this.getFormattedAmount(feeCents, form);

            $wrap.find('.wpf_fee_amount').text(feeFormatted);
            $wrap.find('.wpf_fee_recovery_gateway').val(gateway);
            $wrap.find('.wpf_fee_recovery_amount').val((feeCents / 100).toFixed(2));

            const isOptedIn = !donorOptIn || $wrap.find('.wpf_fee_recovery_checkbox').is(':checked');

            if (isOptedIn) {
                this.injectFeeRow(form, feeFormatted, feeCents, baseCents);
            } else {
                this.removeFeeRow(form, baseCents);
            }
        }

        injectFeeRow(form, feeFormatted, feeCents, baseCents) {
            const tableId   = form.attr('id');
            const $tableDiv = form.find('#wpf_table_div');
            const $tbody    = $tableDiv.find(`#${tableId} > tbody`);

            if (!$tbody.length) return;

            $tbody.find('tr#wpf_fee_recovery_row').remove();

            const $totalRow = $tbody.find(`tr#${tableId}_total`);
            const label = (typeof wpf_fee_recovery_i18n !== 'undefined') ? wpf_fee_recovery_i18n.label : 'Processing Fee';

            const $feeRow = jQuery('<tr id="wpf_fee_recovery_row"></tr>');
            $feeRow.append(jQuery('<td></td>').text(label));
            $feeRow.append(jQuery('<td></td>').text(feeFormatted));
            $feeRow.append(jQuery('<td>1</td>'));
            $feeRow.append(jQuery('<td></td>').text(feeFormatted));

            if ($totalRow.length) {
                $totalRow.before($feeRow);
            } else {
                $tbody.append($feeRow);
            }

            // Update display only — do NOT write back to form.data('payment_total').
            // FormHandler owns that value; overwriting it causes compounding fee on
            // repeated gateway switches (each read would include the previous fee).
            const newTotal     = baseCents + feeCents;
            const newFormatted = this.getFormattedAmount(newTotal, form);
            form.find('.wpf_calc_payment_total').text(newFormatted);
            $tableDiv.find(`tr#${tableId}_total td:last-child`).text(newFormatted);
        }

        removeFeeRow(form, baseCents) {
            form.find('#wpf_table_div tr#wpf_fee_recovery_row').remove();
            if (baseCents > 0) {
                const baseFormatted = this.getFormattedAmount(baseCents, form);
                form.find('.wpf_calc_payment_total').text(baseFormatted);
                form.find('#wpf_table_div').find(`tr#${form.attr('id')}_total td:last-child`).text(baseFormatted);
            }
        }
    }

    new FeeRecovery();
});
