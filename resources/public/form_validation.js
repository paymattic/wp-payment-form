import isEmpty from 'lodash/isEmpty';
import showMessages from './show_error_message';

const  validateData = ($range, $formNoticeWrapper, $t) => {
    var that = this;
    $t = (stringKey) => {
        const generalConfig = window.wp_payform_general;
        if (generalConfig.i18n[stringKey]) {
            return generalConfig.i18n[stringKey];
        }
        return '';
    }
    return new Promise(function (resolve, reject) {
        function getLabel($input) {
            let errorLabel = $input.closest('.wpf_form_group').find('label').text();
            if (!errorLabel) {
                let placeholder = $input.attr('placeholder');
                if (placeholder) {
                    errorLabel = placeholder;
                } else {
                    errorLabel = errorId;
                }
            }
            return errorLabel;
        }
        let errors = {};
        // Validate the normal inputs
        let $inputTypes = $range.find('input[data-required="yes"][data-type="input"],input[data-required="yes"][type="checkbox"] ,textarea[data-required="yes"],select[data-required="yes"]');
        if ($inputTypes.length) {
            jQuery.each($inputTypes, (index, inputType) => {
                let $input = jQuery(inputType);
                let has_error = !$input.val();
                if ($input.attr('type') === 'checkbox') {
                    has_error = !$input.prop('checked');
                }
                if ($input.parents('.wpf_excluded')?.length > 0) {
                    has_error = false;
                    $input.prop('required',0);
                }
                if (has_error) {
                    $input.addClass('wpf_has_error');
                    let errorId = $input.attr('name');
                    let fullNameLabel = $input.attr('data-name-label');
                    let label = fullNameLabel ? fullNameLabel : getLabel($input);
                    errors[errorId] = label + ' ' + $t('is_required');
                }
                if ('email' === $input.attr('type') && $input.val()) {

                    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)\.[a-zA-Z]{2,63}$/;
                    // let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
                    // let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    const input = $input.val();
                    const isValidEmail = emailRegex.test(input);
                    if (!isValidEmail) {
                        let errorId = $input.attr('name');
                        let label = getLabel($input);
                        errors[errorId] = label + ' Invalid';
                    }
                    
                }
            });
        }

        // Validate File Upload
        let $fileUploads = $range.find('input[data-required="yes"][data-type="file_upload"]');
        if ($fileUploads.length) {
            jQuery.each($fileUploads, (index, fileUpload) => {
                let $upload = jQuery(fileUpload);
                // Skip required validation when the field is hidden by conditional
                // logic — a hidden file upload cannot be filled, so it must not block
                // step navigation or submission. Mirrors the normal-input guard above.
                if ($upload.parents('.wpf_excluded')?.length > 0) {
                    $upload.prop('required', 0);
                    return; // continue to next file upload
                }
                let associateKey = $upload.val();
                // check if that associate key has any value or not
                if (!$range.find('input[name^=' + associateKey + ']').val()) {
                    let errorId = $upload.attr('name');
                    let label = getLabel($upload);
                    errors[errorId] = label + ' ' + $t('is_required');
                }
            });
        }

        // Validate radio items
        let $radioFields = $range.find('div[data-required="yes"][data-element_type="radio"],div[data-required="yes"][data-required_element="radio"]');
        if ($radioFields.length && $radioFields.closest('.wpf_excluded')?.length === 0) {
            jQuery.each($radioFields, (index, radioField) => {
                let $radioField = jQuery(radioField);
                if (!$radioField.find('input').is(':checked')) {
                    let errorId = $radioField.attr('data-target_element');
                    let errorLabel = $radioField.find('.wpf_input_label label').text();
                    if (!errorLabel) {
                        errorLabel = errorId;
                    }
                    errors[errorId] = errorLabel + ' ' + $t('is_required');
                }
            });
        }

        // Validate select items
        let $sectionFields = $range.find('div[data-checkbox_required="yes"][data-element_type="checkbox"]');
        if ($sectionFields.length && $sectionFields.closest('.wpf_excluded')?.length === 0){
            jQuery.each($sectionFields, (index, selectField) => {
                let $selectField = jQuery(selectField);
                if (!$selectField.find('input').is(':checked')) {
                    let errorId = $selectField.attr('data-target_element');
                    let errorLabel = $selectField.find('.wpf_input_label label').text();
                    if (!errorLabel) {
                        errorLabel = errorId;
                    }
                    errors[errorId] = errorLabel + ' ' + $t('is_required');
                }
            });
        }
        // validation for phone
        let phoneField = $range.find('[data-element_type="wpf_phone_input_error"]');
        phoneField.each(function () {
            if (jQuery(phoneField).text()) {
                let error = jQuery(`#${this.id}`).text();
                let name = jQuery(`#${this.id}`).attr('name');
                if (error.length) {
                    errors[this.id] = name + ' ' + error
                }
            }
        })
        // Validate quantity field min/max on submission
        let $qtyFields = $range.find('input.wpf_item_qty');
        if ($qtyFields.length) {
            jQuery.each($qtyFields, (index, qtyField) => {
                let $qty = jQuery(qtyField);
                if ($qty.parents('.wpf_excluded')?.length > 0) return;
                let val = $qty.val();
                let min = $qty.attr('min');
                let max = $qty.attr('max');
                let errorId = $qty.attr('name');
                let label = getLabel($qty);

                if (val === '') {
                    if (min !== undefined && min !== '' && parseInt(min, 10) > 0) {
                        $qty.addClass('wpf_has_error');
                        errors[errorId] = label + ': ' + 'Minimum quantity is ' + min;
                    }
                    return;
                }

                // Reject scientific notation (e.g. 1e309) and non-integer strings
                if (!/^\d+$/.test(val.trim())) {
                    $qty.addClass('wpf_has_error');
                    errors[errorId] = label + ': ' + 'Quantity must be a whole number';
                    return;
                }
                let num = parseInt(val, 10);
                if (isNaN(num)) return;

                if (min !== undefined && min !== '' && num < parseInt(min, 10)) {
                    $qty.addClass('wpf_has_error');
                    errors[errorId] = label + ': ' + 'Minimum quantity is ' + min;
                } else if (max !== undefined && max !== '' && num > parseInt(max, 10)) {
                    $qty.addClass('wpf_has_error');
                    errors[errorId] = label + ': ' + 'Maximum quantity is ' + max;
                }
            });
        }

        if (!isEmpty(errors)) {
            reject(errors);
            return;
        }
        resolve(true);
    });
}

export default validateData;