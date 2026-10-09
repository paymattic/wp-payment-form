class PaystackHandler {
    constructor($that, config) {
        this.$form = $that.form;
        this.payformHandler = $that;
        this.config = config;
        this.formId = config?.form_id;
        this.generalConfig = window.wp_payform_general;
    }

    init() {
        this.$form.on('wppayform_next_action_paystack', (event, data) => {
            const response = data.response;
            jQuery('<div/>', {
                'id': 'form_success',
                'class': 'wpf_form_notice_success wpf_paystack_text'
            })
                .html(response.data.message)
                .insertAfter(this.$form);

            if(response.data.actionName === 'initPaystackModal') {
                this.initPaystackModal(response.data);
            } else {
                alert('No method found');
            }
        });
    }

    initPaystackModal(res) {
        const that = this;
        const options = res.modal_data;

        options.callback = function (response) {
            let data = {
                action: 'wppayform_paystack_confirm_payment',
                form_id: that.formId,
                wpf_nonce: that.generalConfig.wpf_nonce,
                ...response
            }
            that.$form.parent().find('.wpf_paystack_text').remove();
            that.payformHandler.handleStripePaymentConfirm(data);
        }

        that.payformHandler.buttonState('loading', '', false);

        options.onClose = function (error) {
            that.$form.parent().find('.wpf_paystack_text').remove();
        }

        let handler = PaystackPop.setup(options);
        handler.openIframe();
    }
}

(function ($) {
    function initPaystack() {
        $('form.wppayform_has_payment').each(function () {
            const $form = $(this);
            if (!$form.data('paystack_initialized')) {
                $form.off('wppayform_init_single.paystack').on('wppayform_init_single.paystack', function (event, $that, config) {
                    new PaystackHandler($that, config).init();
                });
                $form.data('paystack_initialized', true);
            }
        });
    }

    $(document).ready(function () {
        initPaystack();
        // Observe dynamically added forms (ensures it works across all themes)
        if (document.body) {
            new MutationObserver(initPaystack).observe(document.body, { childList: true, subtree: true });
        }
    });

    // Reinitialize Paystack for Bootstrap, jQuery UI, and AJAX-loaded modals.
    $(document).on('shown.bs.modal dialogopen ajaxComplete', initPaystack);

})(jQuery);
