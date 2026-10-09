import ConditionLogic from './conditional_logic.js'
const formConditional = function (theForm, form) {
    const formCondition = function () {
        const watchableFields = {};

        let formData = {};
        const getWatchAbleField = () => {
            jQuery.each(form.conditional_logic, function (fieldName, field) {
                if (!fieldName) {
                    return;
                }
                jQuery.each(field.options, function (index, condition) {
                    let el = getElement(condition.target_field);
                    let name = el.prop('name');
                    if(el.prop('class')?.includes('wpf_payment_item') && el.prop('type') === 'checkbox') {
                        let change_name = el.prop('name').replace(/\[\d]/g, '');
                        watchableFields[change_name] = el;
                    } else if (el.prop('class')?.includes('wpf_payment_item') && (el.prop('type') === 'radio')) {
                        // Handle donation_item radio buttons (they use wpf_payment_item class)
                        watchableFields[name] = el;
                    } else if (name?.includes('address_input')) {
                        let address_name = name.match(/\[(.*?)\]/);
                        watchableFields[address_name[1]] = el;
                    } else if (condition.target_field === 'customer_full_name' || name?.includes('[first_name]') || name?.includes('[middle_name]') || name?.includes('[last_name]')) {
                        // Handle customer_full_name field - get all name part fields
                        let baseFieldName = condition.target_field;
                        if (name?.includes('[')) {
                            // Extract base field name from individual name part field
                            baseFieldName = name.substring(0, name.indexOf('['));
                        }
                        // Find all name part fields for this customer_full_name field
                        let namePartFields = jQuery(`[name^="${baseFieldName}["]`);
                        if (namePartFields.length > 0) {
                            watchableFields[baseFieldName] = namePartFields;
                        } else {
                            watchableFields[el.prop('name')] = el;
                        }
                    } else {
                        watchableFields[el.prop('name')] = el;
                    }

                });
            });
        }
        const init = function () {
            if (!form?.conditional_logic) {
                return;
            }
            getWatchAbleField();
            formData = getFormData();
            const conditionAppInstance = new ConditionLogic(form.conditional_logic, formData);
            jQuery.each(watchableFields, (name, el) => {
                el.off('.wpfCond').on('change.wpfCond', () => {
                    formData = getFormData();
                    conditionAppInstance.setFormData(formData);
                    hideShowElements(conditionAppInstance.getCalculatedStatuses());
                });
            });
            hideShowElements(conditionAppInstance.getCalculatedStatuses());
        }

        // get required field for condition logic
        const getRequireField = (itemName) => {
            let required_field = jQuery(`[required_id*="${itemName}"]`);
           
            required_field = required_field?.length ? required_field : jQuery(`[condition_id*="${itemName}"]`);
            required_field = required_field?.length ? required_field : jQuery( `[name*="${itemName}"]`);
            
            return required_field;
        }

        // get required field for condition logic
        const setRequiredField = (itemName, conditionals, required_field) => {
            if(itemName?.includes('address_input')) {
                jQuery(`[required_id*=${itemName}] .wpf-t-cell .wpf_input_content .wpf_form_control`).map(function() {
                    let name = jQuery(this).attr('name');
                    let obj = conditionals?.conditional_logic[`${itemName}`];
                    if(obj[name] === 'yes') {
                        jQuery(this).attr('required', '1');
                        jQuery(this).attr('data-required', 'yes');
                    }
                })
    
            } else {
                if(conditionals?.conditional_logic[`${itemName}`]?.required_front === 'yes') {
                    required_field.attr('required', '1');
                    required_field.attr('data-required', 'yes');
                    conditionals.conditional_logic[`${itemName}`].required = 'yes'
                }
            }
        }
        // remove html attributes and local variable for required
        const removeRequireAttributes = (itemName, conditionals, required_field) => {
            if(itemName?.includes('address_input')) {
                jQuery(`[required_id*=${itemName}] .wpf-t-cell .wpf_input_content .wpf_form_control`).map(function() {
                    if(jQuery(this).attr('data-required') === 'yes') {
                        jQuery(this).attr('data-required', 'no');
                        jQuery(this).removeAttr('required');
                        let name = jQuery(this).attr('name');
                        let obj = conditionals.conditional_logic[`${itemName}`];
                        obj[name] = 'yes'
                    }
                })
            } else {
                if(jQuery(`[data-element_type*="${itemName}"]` ).attr('class')?.includes('wpf_has_condition')) {
                    if(required_field.attr( "data-required") === 'yes' || required_field.data('checkbox_required') === 'yes') {
                        required_field.removeAttr('required');
                        required_field.data('checkbox_required') ? required_field.attr('data-checkbox_required', 'no') : required_field.attr('data-required', 'no');
                        conditionals.conditional_logic[`${itemName}`].required_front = 'yes';
                        conditionals.conditional_logic[`${itemName}`].required = 'no'
                    }
                } 
            }
        }
       
        const hideShowElements = function (items) {
            let conditionals = window['wp_payform_'+theForm.attr('wpf_form_instance')];
            jQuery.each(items, (itemName, status) => {
                // get required field
                let required_field = getRequireField(itemName);
                // get form element         
                const el = getElement(itemName);
                let $parent = el.closest('.wpf_has_condition');
                el.prop('required',0);
                if (status) {
                    setTimeout(function () {
                        $parent.addClass('wpf_cond_v');
                    }, 100);
                    setRequiredField(itemName, conditionals, required_field)
                    $parent.removeClass('wpf_excluded')
                        .slideDown(200);
                } else {
                    setTimeout(function () {
                        $parent.removeClass('wpf_cond_v');
                    }, 100);
                    removeRequireAttributes(itemName, conditionals, required_field)
                    $parent
                        .addClass('wpf_excluded')
                        .slideUp(200);               
                     }
            });
            // $theForm.trigger('do_calculation');
        };
        const getFormData = function () {
            const data = {};
            jQuery.each(watchableFields, (name, el) => {
                // Handle customer_full_name field specially
                if (isCustomerFullNameField(el)) {
                    data[name] = getCustomerFullNameValue(el);
                    return true; // Continue to next iteration
                }

                let type = el.prop('type') || el.attr('data-type');
                if (type == 'text') {
                    data[name] = el.val();
                } else if (type == 'radio') {
                    data[name] = '';
                    el.each((index, item) => {
                        if(item.classList.contains('wpf_payment_item')) {
                            if (jQuery(item).is(':checked')) {
                                let wpf_donation_controls_radio = jQuery(item).closest('.wpf_donation_controls_radio');
                                if (wpf_donation_controls_radio.length > 0) {
                                    let base_price = jQuery(item).attr('base-price');
                                    data[name] = base_price ? base_price / 100 : jQuery(item).val();
                                } else {
                                    data[name] = jQuery(item).attr('customname');
                                }
                            }
                        } else {
                            if (jQuery(item).is(':checked')) {
                                let id = jQuery(item).attr('id');
                                data[name] = jQuery(item).val();
                                // data[name] = (jQuery(`label[for=${id}]`).text().replace(/^\s+|\s+$/gm, ''));
                            }
                        }
                    });
                } else if (type == 'select-one') {
                    if(el.attr('class').includes('wpf_payment_item')) {
                        // data[name] = el.find(":selected").data('price') / 100;
                        data[name] = el.find(":selected").attr('customname');

                    } else {
                        // data[name] = el.find(":selected").text();
                        data[name] = el.find(":selected").val();
                    }
                } else if (type == 'checkbox') {
                    name = name.replace('[]', '');
                    data[name] = [];
                    el.each((index, item) => {
                        if(item.classList.contains('wpf_payment_item')) {
                            if (jQuery(item).is(':checked')) {
                                // let check_value = jQuery(item).data('price') / 100;
                                let check_value = jQuery(item).val()
                                data[name].push(check_value);
                            }
                        } else {
                            if (jQuery(item).is(':checked')) {
                                let id = jQuery(item).attr('id');
                                data[name].push(jQuery(item).val());
                                // data[name].push(jQuery(`label[for=${id}]`).text().replace(/^\s+|\s+$/gm, ''));
                            }
                        }
                    });
                }  else if(type == 'file') {
                    let file_urls = '';
                    let $el = theForm.find('input[name='+name+']')
                    $el
                        .closest('.ff-el-input--content')
                        .find('.ff-uploaded-list')
                        .find('.ff-upload-preview[data-src]')
                        .each(function (i, div) {
                            file_urls += $(this).data('src');
                        });
                    data[name] = file_urls;
                } else if (type == 'tel') {
                    data[name] = el.val();
                } else {
                    data[name] = el.val();
                }
            });
            return data;
        };
        const getElement = function (name) {
            let $theform = theForm;
            // check for only last();
            var el = name?.includes('radio') ? jQuery(":input[name='" + name + "']", $theform) : jQuery(":input[name='" + name + "']", $theform).last();
            var el = jQuery(":input[name='" + name + "']", $theform);
            el = el.length ? el : jQuery("[condition_id='" + name + "']", $theform);
            return el.length ? el : jQuery("[condition_id='" + name + "']", $theform);
        };
        return {init};
    }
    formCondition().init();
}

export default formConditional

// Helper method to check if element is a customer full name field
const isCustomerFullNameField = (el) => {
    return el.length > 1 && el.attr('data-name-group');
};

// Helper method to extract full name value from multiple name parts
const getCustomerFullNameValue = (el) => {
    const fullNameParts = [];
    el.each((index, item) => {
        const value = jQuery(item).val()?.trim();
        if (value) {
            fullNameParts.push(value);
        }
    });
    return fullNameParts.join(' ');
};
