import each from 'lodash/each'

const inputFieldValidation = (element) => {
    return element.type === 'customer_name' ||
     element.type === 'customer_email' ||
     element.type === 'number' ||
     element.type === 'date' ||
     element.type === 'password' ||
     element.type === 'text' ||
     element.type === 'mask_input' ||
     element.type === 'item_quantity' || 
     element.type === 'coupon' 
 }

 const formTipsMethod = (builder_elements) => {
    let hasPaymentField = false;
    let hasItemField = false;

    each(builder_elements, (element) => {
        if (element.group == 'payment') {
            hasPaymentField = true;
        }
        if (element.group == 'payment_method_element') {
            hasItemField = true;
        }
    });

    if (!hasPaymentField && hasItemField) {
        return 'You have added payment method field, to accept payments add <b>Product Fields</b>';
    }
    if (hasPaymentField && !hasItemField) {
        return 'You have added order item field, to accept payments add <b>Payment Method Field</b>';
    }
    if (builder_elements.length && !hasPaymentField && !hasItemField) {
        return 'Add <b>Product Fields</b> and <b>Payment Method Field</b> to accept payment';
    }
    return false;
 }

 const hasPaymentField = (builder_elements) => {
    let hasField = false;
    each(builder_elements, (element) => {
        if (element.group == 'payment_method_element') {
            hasField = true;
            return true;
        }
    });
    return hasField;
 }

 const textComponentData = (search) => {
    return {
        type: "text",
    editor_title: "Single Line Text",
    quick_checkout_form: true,
    group: "input",
    postion_group: "general",
    isNumberic: "no",
    editor_elements: {
        label: {
            label: "Field Label",
            type: "text",
            group: "general"
        },
        placeholder: {
            label: "Placeholder",
            type: "text",
            group: "general"
        },
        required: {
            label: "Required",
            type: "switch",
            group: "general"
        },
        default_value: {
            label: "Default Value",
            type: "text",
            group: "general"
        },
        admin_label: {
            label: "Admin Label",
            type: "text",
            group: "advanced"
        },
        wrapper_class: {
            label: "Field Wrapper CSS Class",
            type: "text",
            group: "advanced"
        },
        element_class: {
            label: "Input Element CSS Class",
            type: "text",
            group: "advanced"
        },
        conditional_render: {
            type: "conditional_render",
            group: "advanced",
            label: "Conditional render",
            selection_type: "Conditional logic",
            conditional_logic: {
                yes: "Yes",
                no: "No"
            },
            conditional_type: {
                any: "Any",
                all: "All"
            }
        }
    },
    field_options: {
        label: "Single Line Text",
        placeholder: search || "",
        required: "no",
        conditional_logic_option: {
            conditional_logic: "no",
            conditional_type: "any",
            options: [
                {
                    target_field: "",
                    condition: "",
                    value: ""
                }
            ]
        }
    }
    }
}

const preparedAllComponents = (components) => {
    let general = [];
    let payment = [];
    let payment_method_element = [];
    each(components, (component) => {
        if (component?.postion_group == 'general') {
            general.push(component);
        } else if (component?.postion_group == 'payment') {
            payment.push(component);
        } else if (component?.postion_group == 'payment_method') {
            payment_method_element.push(component);
        }
    });
    const array = general.concat(payment, payment_method_element);
    return array;
}

const hasConditionalLogic = (builder_elements) => {
    return builder_elements?.conditional_logic_option?.conditional_logic == 'yes';
}

const labelPlacementOptions = {
    'top': 'Top',
    'left': 'Left',
    'right': 'Right'
}

const getContainersFields = (builder_elements) => {
    let container_fields = [];
    let containers = builder_elements.filter(element => element?.type === 'container');
    for (const container of containers) {
        container_fields = container_fields.concat(getContainerFields(container));
    }
    // console.log({container_fields});
    return container_fields;
}

const getContainerFields = (container) => {
    let container_fields = [];
    let container_columns = container?.field_options?.columns;
        for (const column of container_columns) {
            let column_fields = column?.fields;
            for (const field of column_fields) {
                container_fields.push(field);
            }
        }
    return container_fields;
}

export {hasConditionalLogic, labelPlacementOptions, inputFieldValidation, formTipsMethod, hasPaymentField, textComponentData, preparedAllComponents, getContainersFields, getContainerFields };