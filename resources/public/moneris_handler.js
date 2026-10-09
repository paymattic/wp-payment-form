class MonerisHandler {
    constructor($that, config) {
        this.$form = $that.form;
        this.payformHandler = $that;
        this.config = config;
        this.formId = config?.form_id;
        this.generalConfig = window.wp_payform_general;
    }

    init() {
        this.$form.on('wppayform_next_action_moneris', (event, data) => {
            const response = data.response;
            console.log('moneris response', response);
            jQuery('<div/>', {
                'id': 'form_success',
                'class': 'wpf_form_notice_success wpf_moneris_text'
            })
                .html(response.data.message)
                .insertAfter(this.$form);

            if(response.data.actionName === 'initMonerisModal') {
                this.initMonerisCheckout(response.data);
            } else {
                alert('No method found');
            }
        });
    }

    initMonerisCheckout(res) {
        const that = this;
        window.myForm = this.$form;
        // outerdiv
        // var outerDiv = jQuery('<div/>', {
        //     id: 'outerDiv',
        //     style: 'width: 400px; height: 300px;'
        // });

        // // omneris div
        // var monerisCheckoutDiv = jQuery('<div/>', {
        //     id: 'monerisCheckout'
        // });

        var outerDiv = jQuery.parseHTML(`
           <div id="outerDiv" style="width:400px; height:100vh;">
                <div id="monerisCheckout"></div>
            </div>
        `);

        outerDiv = jQuery(outerDiv);

        // Append the inner div to the outer div
        //outerDiv.append(monerisCheckoutDiv);
        // Insert the outer div after the form
        console.log('outerDiv', outerDiv);
        this.$form.hide();
        outerDiv.insertAfter(this.$form);
        
        
        const checkoutData = res.checkout_data;
        const metData = checkoutData['metadata'];
        const ticket = checkoutData['ticket'];
        var myCheckout = new monerisCheckout();
        myCheckout.setMode(checkoutData['environment']);
        myCheckout.setCheckoutDiv("monerisCheckout");
        myCheckout.startCheckout(ticket);

        // on moneris page loaded
        myCheckout.setCallback("page_loaded", function(res) {
            // add style to div with id monerisCheckout
            jQuery('#monerisCheckout').css({
                position : 'absolute',
                left: '0px',
                top: '0px',
                border: 'none',
                background: 'rgb(250, 250, 250)',
                minWidth: '100%',
                width: '100%',
                minHeight: '100%',
                height: '100%',
                zIndex: 9999
            });
        });
        // on moneris page cancelled/returned
        myCheckout.setCallback("cancel_transaction", function(res) {
            console.log("Moneris transaction cancelled");
            that.$form.show();
            outerDiv.remove();
        });

        myCheckout.setCallback("error_event", function(res) {
            console.log("Moneris error", res);
            that.$form.show();
        });

        myCheckout.setCallback("payment_complete", function(res) {
            console.log('payment complete', res);
            outerDiv.remove();
            that.$form.show();
        });

        myCheckout.setCallback("payment_receipt", function(res) {
            let jsonResponse = JSON.parse(res);
            console.log('payment receipt', jsonResponse, jsonResponse.ticket, typeof(jsonResponse));
            let data = {
                action: 'wppayform_moneris_confirm_payment',
                form_id: that.formId,
                transaction_id: metData.transaction_id,
                submission_id: metData.submission_id,
                ...jsonResponse
            }
            that.$form.parent().find('.wpf_moneris_text').remove();
            that.payformHandler.handleStripePaymentConfirm(data);
            outerDiv.remove();
            that.$form.show();
        });

        // myCheckout.setCallback("payment_receipt", myPaymentReceipt);
        myCheckout.setCallback("payment_complete", function(res) {
            console.log('payment complete', res);
        });

        that.payformHandler.buttonState('loading', '', false);
    }

    myPaymentComplete(response) {
        console.log('payment complete', response);
    
    }
}

(function ($) {
    function initMoneris() {
        $('form.wppayform_has_payment').each(function () {
            const $form = $(this);
            if (!$form.data('moneris_initialized')) {
                $form.off('wppayform_init_single.moneris').on('wppayform_init_single.moneris', function (event, $that, config) {
                    new MonerisHandler($that, config).init();
                });
                $form.data('moneris_initialized', true);
            }
        });
    }

    $(document).ready(function () {
        initMoneris();

        // Observe dynamically added forms (ensures it works across all themes)
        if (document.body) {
            new MutationObserver(initMoneris).observe(document.body, { childList: true, subtree: true });
        }
    });

    // Reinitialize Moneris for Bootstrap, jQuery UI, and AJAX-loaded modals.
    $(document).on('shown.bs.modal dialogopen ajaxComplete', initMoneris);

})(jQuery);
