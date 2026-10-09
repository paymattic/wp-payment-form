class ConditionLogic {

    constructor(fields, formData) {
        this.fields = fields;
        this.formData = formData;
        this.counter = 0;
        this.field_statues = {};
    }

    setFields(fields) {
        this.fields = fields;
    }

    setFormData(data) {
        this.formData = data;
    }

    getCalculatedStatuses() {
        for (const key of Object.keys(this.fields)) {
            let item = this.fields[key];
            this.field_statues[key] = this.evaluate(item, key);
        }
        return this.field_statues;
    }

    evaluate(item, key) {
        let mainResult = false;
        if (item?.conditional_logic === 'yes') {
            this.counter++;
            let type = item.conditional_type;
            let result = 1;
            if (type == 'any') {
                result = 0;
            }
            item.options.forEach(condition => {
                let evalValue = this.getItemEvaluateValue(condition, this.formData[condition.target_field]);
                
                if (evalValue && this.fields[condition.field] && condition.field != key) {
                    evalValue = this.evaluate(this.fields[condition.field], condition.field);
                }
                if (type == 'any') {
                    if (evalValue) {
                        result = 1;
                    }
                } else {
                    // For All
                    if (!evalValue && result) {
                        result = false;
                    }
                }
            });
            mainResult = result == 1;
        }

        if(item.status && item.conditions.length && !mainResult) {
            return mainResult;
        }

        if (item.container_condition) {
            mainResult = this.evaluate(item.container_condition);
        }
        return mainResult;
    }

    getItemEvaluateValue(item, val) {
        val = val || null;

        // Handle customer_full_name field specially
        if (item.target_field === 'customer_full_name' || item.field === 'customer_full_name') {
            // If val is already a string (formatted full name), use it directly
            if (typeof val === 'string') {
                // val is already the formatted full name
            } else if (typeof val === 'object' && val !== null) {
                // If val is an object with name parts, format it
                let nameParts = [];
                ['first_name', 'middle_name', 'last_name'].forEach(part => {
                    if (val[part] && val[part].trim()) {
                        nameParts.push(val[part].trim());
                    }
                });
                val = nameParts.join(' ');
            }
        }

        const isNumericField = jQuery(`[name='${item.field}']`).attr('inputmode') === 'numeric';
        if (isNumericField && val) {
            val = val.replace(/[^0-9.-]/g, '');
        }
        if (item.condition == 'equal') {
            // this value can be array or string
            if (typeof val == 'object') {
                return val !== null && val.indexOf(item.value.toString()) != -1;
            }
            return val == item.value;
        } else if (item.condition == 'not_equal') {
            if (typeof val == 'object') {
                return val !== null && val.indexOf(item.value) == -1;
            }
            return val != item.value;
        } else if (item.condition == 'greater_than') {
            return val && val > Number(item.value);
        } else if (item.condition == 'less_than') {
            return val && val < Number(item.value);
        } else if (item.condition == 'greater_or_equal') {
            return val && val >= Number(item.value);
        } else if (item.condition == 'less_or_equal') {
            return val && val <= Number(item.value);
        } else if (item.condition == 'starts_with' && val !== null) {
            return val && val.startsWith(item.value);
        } else if (item.condition == 'ends_with') {
            return val && val.endsWith(item.value);
        } else if (item.condition == 'contains') {
            return val !== null && val.indexOf(item.value) != -1;
        } else if (item.condition == 'not_contains') {
            return val !== null && val.indexOf(item.value) == -1;
        } else if(item.condition == 'test_regex') {
            const globalRegex = new RegExp(item.value, 'g');
            return  globalRegex.test(val);
        }
        return false;
    }
}

export default ConditionLogic;