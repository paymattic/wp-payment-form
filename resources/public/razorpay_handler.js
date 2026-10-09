class RazorpayHandler {
    constructor($that, config) {
        this.$form = $that.form;
        this.payformHandler = $that;
        this.config = config;
        this.formId = config?.form_id;
        this.generalConfig = window.wp_payform_general;
    }

    init() {
        this.$form.on('wppayform_next_action_razorpay', (event, data) => {
            const response = data.response;
            jQuery('<div/>', {
                'id': 'form_success',
                'class': 'wpf_form_notice_success wpf_razorpay_text'
            })
                .html(response.data.message)
                .insertAfter(this.$form);

            if(response.data.actionName === 'initRazorPayModal') {
                this.initRazorPayModal(response.data);
            } else {
                alert('No method found');
            }
        });
    }

    initRazorPayModal(res) {
        const that = this;
        const options = res.modal_data;
        options.handler = function (response) {
            const data = {
                action: 'wppayform_razorpay_confirm_payment',
                transaction_hash:  res.transaction_hash,
                submission_id: res.submission_id,
                form_id: that.formId,
                wpf_nonce: that.generalConfig.wpf_nonce,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            }

            that.$form.parent().find('.wpf_razorpay_text').remove();
            that.payformHandler.handleStripePaymentConfirm(data);
        }

        options.modal = {
            escape: false,
            ondismiss: function () {
                that.$form.parent().find('.wpf_razorpay_text').remove();
                that.payformHandler.buttonState('normal', '', false);
            }
        }

        const pay = new Razorpay(options);
        pay.on('payment.failed', function (response){
            that.payformHandler.buttonState('payment_failed', '', false, response.error.description);
        });

        that.payformHandler.buttonState('loading', '', false);
        pay.open();
    }
}

(function ($) {
    function initRazorpay() {
        $('form.wppayform_has_payment').each(function () {
            const $form = $(this);
            if (!$form.data('razorpay_initialized')) {
                $form.off('wppayform_init_single.razorpay').on('wppayform_init_single.razorpay', function (event, $that, config) {
                    new RazorpayHandler($that, config).init();
                });
                $form.data('razorpay_initialized', true);
            }
        });
    }

    $(document).ready(function () {
        initRazorpay();
        // Observe dynamically added forms (ensures it works across all themes)
        if (document.body) {
            new MutationObserver(initRazorpay).observe(document.body, { childList: true, subtree: true });
        }
    });

    // Reinitialize Moneris for Bootstrap, jQuery UI, and AJAX-loaded modals.
    $(document).on('shown.bs.modal dialogopen ajaxComplete', initRazorpay);

})(jQuery);