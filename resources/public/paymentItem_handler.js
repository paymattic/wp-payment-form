
jQuery(() => {

    class PaymentItem {

        constructor() {
            this.init();
        }

        init() {
            this.radioDiv = jQuery('[data-toggle_payment_item_radiobox]');
            this.checkBoxDiv = jQuery('[data-toggle_payment_item_checkbox]');
            this.actionRadioKey();
            this.actionCheckboxKey();
        }

        actionRadioKey() {
            this.radioDiv.on('click', function(event) {
                const radioInput = jQuery(this).find('input[type="radio"]');
        
                radioInput.prop('checked', true);
                jQuery(this).addClass('selected').siblings().removeClass('selected');
        
                // Trigger change event
                radioInput.trigger('change');
            });
        }

        actionCheckboxKey(){
            this.checkBoxDiv.on('click', function(event){
                if (jQuery(event.target).is('input[type="checkbox"]')) {  
                    return;  
                }
                event.preventDefault();
                const checkboxInput = jQuery(this).find('input[type="checkbox"]');

                checkboxInput.prop('checked', !checkboxInput.prop('checked'));
                jQuery(this).toggleClass('selected', checkboxInput.prop('checked'));

                checkboxInput.trigger('change')
            })
        }
    }

    new PaymentItem();
});

