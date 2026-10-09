class PayrexxHandler {
    constructor($that, config) {
        this.$form = $that.form;
        this.payformHandler = $that;
        this.config = config;
        this.formId = config?.form_id;
        this.generalConfig = window.wp_payform_general;
    }

    init() {
        this.$form.on('wppayform_next_action_payrexx', (event, data) => {
            const response = data.response;
            jQuery('<div/>', {
                'id': 'form_success',
                'class': 'wpf_form_notice_success wpf_payrexx_text'
            })
                .html(response.data.message)
                .insertAfter(this.$form);

            if(response.data.actionName === 'initPayrexxModal') {
                this.initPayrexxModal(response.data);
            } else {
                alert('No method found');
            }
        });
    }

    initPayrexxModal(res) {
        const that = this;
        const options = res.modal_data;
        const successUrl = res.success_url;
        const uniqueId = `form-payrexx-${this.formId}`;
        const $url = `<a style="display: none;" id="${uniqueId}" data-href="${options.link}"><a/>`;
        that.$form.append($url);
        jQuery("#" + uniqueId).payrexxModal({
            hidden: function(transaction) {
                if (Object.keys(transaction).length !== 0) {
                    location.href = successUrl;
                };
                that.payformHandler.buttonState('loading', '', false);
                that.$form.parent().find('.wpf_payrexx_text').remove();
            }
        }).click();
    }
}

(function ($) {
    function initPayrexx() {
        $('form.wppayform_has_payment').each(function () {
            const $form = $(this);
            if (!$form.data('payrexx_initialized')) {
                $form.off('wppayform_init_single.payrexx').on('wppayform_init_single.payrexx', function (event, $that, config) {
                    new PayrexxHandler($that, config).init();
                });
                $form.data('payrexx_initialized', true);
            }
        });
    }

    $(document).ready(function () {
        initPayrexx();

        // Observe dynamically added forms (ensures it works across all themes)
        if (document.body) {
            new MutationObserver(initPayrexx).observe(document.body, { childList: true, subtree: true });
        }
    });

    // Reinitialize Payrexx for Bootstrap, jQuery UI, and AJAX-loaded modals.
    $(document).on('shown.bs.modal dialogopen ajaxComplete', initPayrexx);

})(jQuery);