jQuery(() => {
    class DynamicCalculation {
        constructor() {
            this.inputFields = [];
            this.form = jQuery('[data-wpf_form_id]');
            this.isCalculating = false;
            this.registerCustomFunctions();
            this.init();
        }

        registerCustomFunctions() {
            const customFunctions = [
                {
                    type: 8,
                    token: 'round',
                    show: 'round',
                    value: (value, decimals = 2) => {
                        const factor = Math.pow(10, decimals);
                        return Math.round(value * factor) / factor;
                    }
                },
                {
                    type: 0,
                    token: 'ceil',
                    show: 'ceil',
                    value: Math.ceil
                },
                {
                    type: 0,
                    token: 'floor',
                    show: 'floor',
                    value: Math.floor
                },
                {
                    type: 0,
                    token: 'abs',
                    show: 'abs',
                    value: Math.abs
                },
                {
                    type: 8,
                    token: 'max',
                    show: 'max',
                    value: Math.max
                },
                {
                    type: 8,
                    token: 'min',
                    show: 'min',
                    value: Math.min
                }
            ];
            mexp.addToken(customFunctions);
        }

        init() {
            if (typeof mexp === 'undefined') {
                console.error('mexp library is not loaded');
                return;
            }
            const $calculateFields = this.form.find('[data-numeric_calculation]');
            this.processCalculationFields($calculateFields);
        }

        processCalculationFields($calculateFields) {
            $calculateFields.each((_, field) => {
                const $field = jQuery(field);
                const fieldId = $field.attr('id');
                const name = $field.attr('name');
                const formula = $field.data('numeric_calculation');
                if (fieldId && formula) {
                    this.inputFields.push({
                        $element: $field,
                        name,
                        formula,
                        id: fieldId
                    });
                }
            });

            this.form.on('input change', (event) => {
                if (this.isCalculating) return;
                setTimeout(() => {
                    this.performCalculations();
                }, 0);
            });
            this.performCalculations();
        }

        performCalculations() {
            if (this.isCalculating) return;
            try {
                this.isCalculating = true;
                const formData = this.collectFormData();
                if (formData === null) return;
                this.inputFields.forEach(field => {
                    if (!field.formula) return;
                    const expression = this.evaluateExpression(field.formula, formData);
                    const calculatePercentage = this.calculatePercentage(expression);
                    const calculatedValue = this.calculateExpression(calculatePercentage);
                    const roundedValue = this.roundHalfUp(calculatedValue, 2);
                    const formatCalculatedValue = roundedValue.toFixed(2);

                    // Only update and trigger if value actually changed  
                    const currentValue = parseFloat(field.$element.val()) || 0;
                    const formatCurrentValue = currentValue.toFixed(2);
                    if (formatCurrentValue !== formatCalculatedValue.toString()) {
                        field.$element.val(formatCalculatedValue);
                        field.$element.trigger('change');
                    }
                    formData[field.name] = formatCalculatedValue;
                    // Update Tax Calculation Result  
                    this.updateTaxCalculation(field, formatCalculatedValue);  

                    // Update Dynamic Payment Item  
                    this.updateDynamicPaymentItem(field, formatCalculatedValue, formData); 
                });
            } finally {
                this.isCalculating = false;
            }
        }

        roundHalfUp(num, decimals) {
            const multiplier = Math.pow(10, decimals);
            return Math.round(num * multiplier + Number.EPSILON) / multiplier;
        }

        evaluateExpression(formula, formData) {
            return formula.replace(/\{input\.(.*?)\}/g, (_, key) => {
                let value = formData[key.trim()] || 0;
                if (Array.isArray(value)) {
                    value = value.reduce((sum, val) => sum + parseFloat(val), 0);
                }
                return this.toNumeric(value);
            });
        }

        // calculatePercentage(expression){
        //     const percentageRegex = /(\d+(\.\d+)?)\s*%\s*(\d+(\.\d+)?)/g;  
        //     return expression.replace(percentageRegex, (match, base, _, total) => {  
        //         return (parseFloat(base) * parseFloat(total)) / 100;  
        //     });  
        // }

        calculatePercentage(expression){
            const percentageRegex = /(\(.*?\)|\d+(\.\d+)?)\s*%\s*(\(.*?\)|\d+(\.\d+)?)/g;  
            return expression.replace(percentageRegex, (match, base, _, total) => {  
                try {
                    const baseValue = this.evaluateNestedExpression(base);
                    const totalValue = this.evaluateNestedExpression(total);
                    return (parseFloat(baseValue) * parseFloat(totalValue)) / 100;
                } catch (error) {
                    console.error('Percentage calculation error:', error);
                    return 0;
                }
            });  
        }

        evaluateNestedExpression(expression) {
            expression = expression.trim();
            if(expression.startsWith('(') && expression.endsWith(')')){
                expression = expression.slice(1, -1);
            }
            try {
                // Use mexp to evaluate nested expressions
                return mexp.eval(expression);
            } catch (error) {
                console.error('Error evaluating expression:', error);
                return 0;
                }
        }

        calculateExpression(expression) {
            try {
                return this.toNumeric(mexp.eval(expression));
            } catch (error) {
                console.error('Expression evaluation error:', error);
                return 0;
            }
        }

        toNumeric(value) {
            const numValue = parseFloat(value);
            return isNaN(numValue) ? 0 : numValue;
        }
        formatCurrencyDisplay(calculatedValue, currencySymbol, paymentItem) {  
            const absValue = Math.abs(calculatedValue);  
            const displayValue = `${currencySymbol}${absValue.toFixed(2)}`;  
            paymentItem.removeClass('negative')
            if (calculatedValue < 0) {  
                paymentItem.addClass('negative');  
            }  
            return displayValue;  
        }

        updateTaxCalculation(field, formatCalculatedValue) {  
            const taxSpan = field.$element.find(`.wpf_calc_tax[data-target_tax="${field.$element.attr('id')}"]`);  
            if (taxSpan.length) {  
                const currencySymbol = taxSpan.text().match(/^[^\d]+/)?.[0] || '$';  
                taxSpan.text(`${currencySymbol}${formatCalculatedValue}`);  
            }  
        }  

        updateDynamicPaymentItem(field, formatCalculatedValue, formData) {  
            const dynamicSpan = field.$element.find('.wpf_calc_dynamic_payment_item');  
            const dynamicInput = field.$element.find('.wpf_input_dynamic_payment_item');  

            if (dynamicSpan.length && dynamicInput.length) {  
                const currencySymbol = dynamicSpan.text().match(/^[^\d]+/)?.[0] || '$';  
                const formattedValue = this.formatCurrencyDisplay(formatCalculatedValue, currencySymbol, dynamicSpan);  
                dynamicSpan.text(formattedValue);    
                dynamicInput.val(formatCalculatedValue);

                const dynamicInputName = dynamicInput.attr('name');
                const dynamicInputData = dynamicInput.attr('data-price', formatCalculatedValue);
                formData[dynamicInputName] = formatCalculatedValue;
                dynamicInput.trigger('change');
            }  
        }  

        collectFormData() {
            const numericCalculation = this.form.find('[data-numeric_calculation]');  
            if (!numericCalculation.length) return null;  
            const formData = {}; 
            this.collectNumberInputs(formData);
            this.collectRadioInputs(formData);
            this.collectCheckboxInputs(formData);
            this.collectTabularProduct(formData);
            this.collectPaymentItem(formData);
            this.collectSelectInputs(formData);
            this.collectTaxAmount(formData);
            this.collectSubscriptionPayment(formData);
            this.collectCustomDonationItem(formData);
            return formData;
        }

        collectTabularProduct(formData) {
            const tabularElements = this.form.find('[data-element_type="tabular_products"]');
            tabularElements.each((_, element) => {
                const $element = jQuery(element);
                const hiddenInputs = $element.find('input[type="hidden"][name^="tabular_products"]');
                hiddenInputs.each((_, inputElement) => {
                    const $inputElement = jQuery(inputElement);
                    const name = $inputElement.attr('name');
                    formData[name] = parseFloat($inputElement.val()) || 0;
                });
            });
        }
        collectPaymentItem(formData) {
            const paymentItems = this.form.find('[single-paymen-item]')
            paymentItems.each((_, element) => {
                const $element = jQuery(element);
                const paymentItem = $element.find('.wpf_payment_item');
                paymentItem.each((_, item) => {
                    const $item = jQuery(item);
                    const name = $item.attr('name');
                    const itemValue = $item.val();
                    formData[name] = parseFloat(itemValue) || 0;
                })
            })
        }
        collectNumberInputs(formData) {
            this.form.find('input[type="number"][name]').each((_, input) => {
                const $input = jQuery(input);
                const name = $input.attr('name');
                const value = $input.val().trim();

                if (name) {
                    formData[name] = value || 0;
                }
            });
        }
        collectRadioInputs(formData) {
            this.form.find('input[type="radio"][name]:checked').each((_, radio) => {
                const $radio = jQuery(radio);
                const name = $radio.attr('name');
                if (name === '__wpf_selected_payment_method') return;
                const baseName = name.replace(/(_\d+)$/, '');
                formData[name] = ($radio.data('price') / 100).toFixed(2);
                // if (baseName === 'payment_item') {  
                //     formData[name] = ($radio.data('price') / 100).toFixed(2);   
                // } else {
                //     formData[name] = $radio.val(); 
                // } 
            });
        }
        collectCheckboxInputs(formData) {
            const checkedCheckboxes = this.form.find('input[type="checkbox"][name]:checked');
            checkedCheckboxes.each((_, checkbox) => {
                const $checkbox = jQuery(checkbox);
                if ($checkbox.data('tabular_product') === 'tabular_products') {
                    return;
                }
                const name = $checkbox.attr('name');
                if (!name) return;
                let value;
                let groupName = name;
                if (name.startsWith('payment_item')) {
                    const baseNameMatch = name.match(/^(payment_item(?:_\d+)?)/);
                    const baseName = baseNameMatch ? baseNameMatch[1] : name;
                    groupName = $checkbox.data('group_id') || baseName;
                    value = ($checkbox.data('price') / 100).toFixed(2);
                } else {
                    value = $checkbox.val();
                }
                this.addCheckboxValue(formData, groupName, value);
            });
        }

        addCheckboxValue(formData, name, value) {
            if (!name) return;

            if (formData[name]) {
                if (Array.isArray(formData[name])) {
                    formData[name].push(value);
                } else {
                    formData[name] = [formData[name], value];
                }
            } else {
                formData[name] = [value];
            }
        }

        collectSelectInputs(formData) {
            const selectInputs = this.form.find('select, input[type="select"]');
            let value;
            selectInputs.each((_, selectElement) => {
                const $select = jQuery(selectElement);
                const name = $select.attr('name');
                // const baseName = name.replace(/(_\d+)$/, '');
                const option = $select.find('option:selected');
                const priceData = option.data('price');
                const value = (typeof priceData === 'number' && !isNaN(priceData))
                ? (priceData / 100).toFixed(2) : '0.00';  
                // if(baseName === 'payment_item'){
                //     value = (option.data('price') / 100).toFixed(2);
                // } else {
                //     value = (option.data('price') / 100).toFixed(2);
                // }  
                if (name) {
                    if (Array.isArray(value)) {
                        formData[name] = value;
                    } else {
                        formData[name] = value;
                    }
                }
            });
        }
        collectTaxAmount(formData) {
            const $taxElements = this.form.find('[data-element_type="tax_payment_input"]');
            $taxElements.each((_, element) => {
                const $element = jQuery(element);
                const taxLabels = $element.find('[data-target_product]');
                taxLabels.each((_, taxLabel) => {
                    const $taxLabel = jQuery(taxLabel);
                    const targetProduct = $taxLabel.attr('id');
                    const targetProductId = targetProduct.replace(/.*?(tax_payment_input)/, '$1');
                    const taxAmountText = $taxLabel.find('.wpf_calc_tax').text().trim();
                    const taxAmount = taxAmountText.replace(/[^\d.]/g, '');
                    formData[targetProductId] = taxAmount;
                })
            })
        }

        collectSubscriptionPayment(formData) {
            const subscriptionPaymentElements = this.form.find('[data-element_type="recurring_payment_item"]');
            subscriptionPaymentElements.each((_, element) => {
                const $element = jQuery(element);
                const inputElements = $element.find('input[type="hidden"].wpf_payment_item');
                const customInputElements = $element.find('.wpf_custom_subscription_input');
               if(inputElements.length){
                    inputElements.each((_, inputElement) => {
                        const $input = jQuery(inputElement);
                        const name = $input.attr('name');
                        formData[name] = ($input.data('price') / 100).toFixed(2) || 0;
                    })
               }
                if(customInputElements.length){
                    customInputElements.each((_, customInputElement) => {
                        const $customInput = jQuery(customInputElement);
                        const name = $customInput.attr('name');
                        const baseKey = name.replace(/__\d+$/, '');
                        // console.log('baseKey', baseKey)
                        const value = $customInput.val();
                        formData[baseKey] = parseFloat(value) || 0;
                    })
                }  
            })
        }
        collectCustomDonationItem(formData) {
            const customDonationElements = this.form.find('[data-element_type="donation_item"]');
            customDonationElements.each((_, element) => {
                const $element = jQuery(element);
                const customInputElements = $element.find('.wpf_donation_custom_amount');
                if(customInputElements.length){
                    customInputElements.each((_, customInputElement) => {
                        const $customInput = jQuery(customInputElement);
                        const name = $customInput.attr('name');
                        const baseKey = name.replace(/_custom$/, '');
                        const value = $customInput.attr('base-currency-price');
                        formData[baseKey] = parseFloat(value) || 0;
                    })
                }  
            })
        }
    }

    new DynamicCalculation();
});
