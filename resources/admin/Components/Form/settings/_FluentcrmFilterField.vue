<template>
    <div>
        <div v-if="settings.list_conditional.status" class="wpf_conditional_block">
            <div class="wpf_table_container">
                <div class="wpf_table_header_row">
                    <div class="wpf_table_cell wpf_field_header">Field</div>
                    <div class="wpf_table_cell wpf_operator_header">Operator</div>
                    <div class="wpf_table_cell wpf_value_header">Value</div>
                    <div class="wpf_table_cell wpf_list_header">FluentCRM List</div>
                    <div class="wpf_table_cell wpf_action_header">Actions</div>
                </div>
                
                <div 
                    v-for="(logic, key) in items" 
                    :key="key"
                    class="wpf_table_row">
                    
                    <div class="wpf_table_cell wpf_field_cell">
                        <el-select 
                            size="medium" 
                            v-model="items[key].field" 
                            placeholder="Select field"
                            @change="onFieldChange(key)">
                            <el-option 
                                v-for="field in availableFields" 
                                :key="field.id"
                                :label="getFieldLabel(field)" 
                                :value="field.id">
                            </el-option>
                        </el-select>
                    </div>
                    <el-input 
                        v-model="items[key].field_type" 
                        type="hidden" 
                        value="getSelectedType(items[key].field)">
                    </el-input>

                    <div class="wpf_table_cell wpf_operator_cell">
                        <el-select 
                            size="medium" 
                            v-model="items[key].operator"
                            placeholder="Select operator"
                            :disabled="!items[key].field || !items[key].field">
                            <el-option 
                                v-for="(label, value) in getConditionList(items[key].field)" 
                                :key="value" 
                                :value="value" 
                                :label="value">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="wpf_table_cell wpf_value_cell">
                        <el-select 
                            v-if="items[key].field && isSelectField(items[key].field)"
                            size="medium" 
                            v-model="items[key].value"
                            placeholder="Select value">
                            <el-option 
                                v-for="(option, optionKey) in getFieldOptions(items[key].field)" 
                                :key="optionKey"
                                :label="getOptionLabel(option)" 
                                :value="getOptionValue(option, optionKey, items[key].field)">
                            </el-option>
                        </el-select>
                        
                        <el-input 
                            v-else 
                            size="medium" 
                            placeholder="Enter value" 
                            v-model="items[key].value">
                        </el-input>
                    </div>

                    <div class="wpf_table_cell wpf_list_cell">
                        <el-select 
                            size="medium" 
                            v-model="items[key].list"
                            placeholder="Select CRM list">
                            <el-option 
                                v-for="(list, listKey) in crm_lists" 
                                :key="listKey"
                                :label="list" 
                                :value="listKey">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="wpf_table_cell wpf_action_cell">
                        <el-button 
                            :disabled="items.length === 1" 
                            @click="remove(key)" 
                            size="mini">
                            <Icon icon="wpf-delete" />
                            <el-tooltip 
                                class="item" 
                                effect="dark" 
                                content="Delete condition" 
                                placement="top">
                            </el-tooltip>
                        </el-button>
                    </div>
                </div>
            </div>

            <div class="wpf_block-add_more" @click="addCondition">
                <Icon icon="wpf-black-add"/>
                <span class="wpf_block-add_more-button">Add More</span>
            </div>

             <!-- Default List Fallback Section -->
            <div class="wpf_default_list_section">
                <el-checkbox 
                    v-model="settings.list_conditional.enable_default"
                    class="wpf_default_list_checkbox">
                    Enable Default List (when no conditions match)
                </el-checkbox>
                
                <div v-if="settings.list_conditional.enable_default" class="wpf_default_list_content">
                    <div class="wpf_default_list_selector">
                        <el-select 
                            size="medium" 
                            v-model="settings.list_conditional.default_list"
                            placeholder="Select default CRM list"
                            class="wpf_default_list_select">
                            <el-option 
                                v-for="(list, listKey) in crm_lists" 
                                :key="listKey"
                                :label="list" 
                                :value="listKey">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="wpf_default_list_description">
                        <small>This list will be used when none of the above conditions are met.</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Icon from '../../Icons/Index.vue';
import { getContainersFields } from '../editor/editorHelper';

export default {
    name: 'FluentcrmFilterField',
    components: { Icon },
    props: {
        settings: {
            type: Object,
            required: true,
            default: () => ({})
        },
        all_elements: {
            type: Array,
            default: () => []
        },
        fluentCrmLists: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            defaultRules: {
                field: '',
                field_type: '',
                operator: '',
                value: '',
                list: ''
            },
            comingSoon: false,
            crm_lists: {}
        }
    },
    computed: {
        items() {
            if (!this.settings.list_conditional.conditions) {
                this.$set(this.settings.list_conditional, 'conditions', []);
            }
            return this.settings.list_conditional.conditions;
        },
        availableFields() {
            return this.getExpandedFields();
        },
        // conditionTypes() {
        //     return { all: 'All', any: 'Any' };
        // }
    },
    methods: {
        getExpandedFields() {
            const expandedFields = [];
            const container_fields = getContainersFields(this.all_elements);
            const all_fields = [...this.all_elements, ...container_fields];
            all_fields?.forEach(element => {
                if (!element?.conditional_hide) {
                    if (element.type === 'address_input') {
                        // Create separate options for each address subfield
                        const subfields = element?.field_options?.subfields || {};

                        Object.keys(subfields).forEach(subfieldKey => {
                            expandedFields.push({
                                id: `${element.id}[${subfieldKey}]`, // e.g., "billing_address[country]"
                                type: 'address_subfield',
                                parent_type: 'address_input',
                                parent_id: element.id,
                                subfield_key: subfieldKey,
                                label: `${this.getMainFieldLabel(element)} - ${this.getSubfieldDisplayName(subfieldKey)}`,
                                field_options: element.field_options,
                                subfield_data: subfields[subfieldKey],
                                // Copy relevant properties from parent
                                admin_label: element.admin_label,
                                isNumberic: 'no' // Address subfields are typically text-based
                            });
                        });
                    } else {
                        // Add regular fields as-is
                        expandedFields.push(element);
                    }
                }
            });

            return expandedFields;
        },
        getMainFieldLabel(field) {
            return field?.field_options?.label || field?.label || field?.admin_label || 'Address';
        },
        getSubfieldDisplayName(subfieldKey) {
            const displayNames = {
                'address_line_1': 'Address Line 1',
                'address_line_2': 'Address Line 2',
                'city': 'City',
                'country': 'Country',
                'state': 'State',
                'zip_code': 'ZIP Code'
            };
            return displayNames[subfieldKey] || subfieldKey;
        },
        onFieldChange(index) {
            this.items[index].value = '';
            this.items[index].operator = '';
            this.items[index].field_type = this.getSelectedType(this.items[index].field);
        },
        addCondition() {
            this.items.push({ ...this.defaultRules });
        },
        remove(index) {
            this.items.splice(index, 1);
        },
        getFieldLabel(field) {
            if (!field) return '';
            if (field.type === 'address_subfield') {
                return field.label;
            }
            return field?.field_options?.label || field?.label || field?.admin_label || 'Unknown Field';
        },
        getSelectedType(fieldId) {
            const field = this.findField(fieldId);
            if (!field) return '';
            return field.type;
        },
        getConditionList(targetField) {
            const field = this.findField(targetField);
            if (!field) return {};

            // Handle address subfields
            if (field.type === 'address_subfield') {
                const subfieldKey = field.subfield_key;

                // Different operators for different address subfields
                if (['country', 'state', 'zip_code'].includes(subfieldKey)) {
                    return { equal: "=", not_equal: "!=" };
                }

                if (['city', 'address_line_1', 'address_line_2'].includes(subfieldKey)) {
                    return {
                        equal: "=",
                        not_equal: "!=",
                        starts_with: "startsWith",
                        ends_with: "endsWith",
                        contains: "contains",
                        not_contains: "doNotContains"
                    };
                }

                return { equal: "=", not_equal: "!=" };
            }

            const isNumeric = field.isNumberic === 'yes' || field.type === 'recurring_payment_item';
            const isSinglePayment = field?.field_options?.pricing_details?.one_time_type === 'single';
            const isSingleRecurringPayment = field?.field_options?.recurring_payment_options?.choice_type === 'simple';
            if (isNumeric) {
                if (field.type === 'payment_item' && !isSinglePayment || field.type === 'recurring_payment_item' && !isSingleRecurringPayment || field.type === 'tabular_products' && field?.field_options?.layout !== 'table') {
                    return { equal: "=", not_equal: "!=" };
                }

                return {
                    equal: "=",
                    not_equal: "!=",
                    greater_than: ">",
                    less_than: "<",
                    greater_or_equal: ">=",
                    less_or_equal: "<="
                };
            }
            
            if (field.isNumberic === 'no') {
                return {
                    equal: "=",
                    not_equal: "!=",
                    starts_with: "startsWith",
                    ends_with: "endsWith",
                    contains: "contains",
                    not_contains: "doNotContains"
                };
            }

            return { equal: "=", not_equal: "!=" };
        },
        isSelectField(fieldId) {
            const field = this.findField(fieldId);
            if (!field) return false;

            if (field.type === 'payment_item') {
                return field?.field_options?.pricing_details?.one_time_type !== 'single';
            }

            if (field.type === 'recurring_payment_item') {
                return field?.field_options?.recurring_payment_options?.choice_type !== 'simple'; 
            }

            if(field.type === 'tabular_products') {
                return field?.field_options?.layout !== 'table';
            }

             if (field.type === 'address_subfield') {
                // Check if this subfield has options (like country dropdown)
                const subfieldOptions = field.subfield_data?.options;
                if (field.subfield_key === 'country') {
                    return true;
                }
                return !!(subfieldOptions && Object.keys(subfieldOptions).length > 0);
            }
            
            return ['radio', 'checkbox', 'select'].includes(field.type);
        },
        getFieldOptions(fieldId) {
            const field = this.findField(fieldId);
            if (!field) return {};

            if (field.subfield_key === 'country' && field.type === 'address_subfield') {
                return window.wpPayFormsAdmin.countries;
            }
            
            if (field.type === 'payment_item') {
                return field?.field_options?.pricing_details?.multiple_pricing || {};
            }

            if (field.type === 'recurring_payment_item') {
                return field?.field_options?.recurring_payment_options?.pricing_options || {};
            }

            if(field.type === 'tabular_products') {
                return field?.field_options?.products || {};
            }
            
            return field?.field_options?.options || {};
        },
        getOptionLabel(option) {
             if (option === 'country') {
                return window.wpPayFormsAdmin.countries[option];
            }
            if (typeof option === 'object') {
                return option.label || option.value || option.text || option.name || option.product_name || 'Unknown Option';
            }
            return option;
        },
        getOptionValue(option, optionKey, field) {
            field = field.replace(/_\d+/g, '');
            if (typeof option === 'object' && (field == 'radio' || field == 'checkbox' || field == 'select')) {
                return option.value;
            } 
            return optionKey;
        },
        findField(fieldId) {
            return this.availableFields?.find(element => element.id === fieldId);
        },
        initializeConditions() {
            if (!this.items.length) {
                this.addCondition();
            }
            this.crm_lists = this.fluentCrmLists || [];
            
            // Initialize default list settings
            if (!this.settings.list_conditional.hasOwnProperty('enable_default')) {
                this.$set(this.settings.list_conditional, 'enable_default', false);
            }
            if (!this.settings.list_conditional.hasOwnProperty('default_list')) {
                this.$set(this.settings.list_conditional, 'default_list', '');
            }
        }
    },
    mounted() {
        this.initializeConditions();
    }
};
</script>

<style lang="scss" scoped>
.wpf_conditional_block {
    margin-top: 15px;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fafafa;
}

.wpf_conditional_block-if {
    margin-bottom: 15px;
    font-weight: 500;
}

.wpf_conditional_block-select {
    margin: 0 8px;
    width: 80px;
}

.wpf_conditional_block-row {
    margin-bottom: 10px;
    align-items: center;
}

.wpf_block-add_more {
    margin-top: 15px;
    cursor: pointer;
    color: #409eff;
    display: flex;
    align-items: center;
    
    &:hover {
        color: #66b1ff;
    }
}

.wpf_block-add_more-button {
    margin-left: 5px;
}

.wpf_table_container {
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
}

.wpf_table_header_row {
    display: flex;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
    font-size: 13px;
    color: #495057;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    line-height: 30px;
}

.wpf_table_row {
    display: flex;
    border-bottom: 1px solid #f1f3f4;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: #f8f9fa;
    }
    
    &:last-child {
        border-bottom: none;
    }
}

.wpf_table_cell {
    padding: 12px 8px;
    display: flex;
    align-items: center;
    
    &.wpf_field_header,
    &.wpf_field_cell {
        flex: 0 0 20%;
        min-width: 180px;
    }
    
    &.wpf_operator_header,
    &.wpf_operator_cell {
        flex: 0 0 20%;
        min-width: 120px;
    }
    
    &.wpf_value_header,
    &.wpf_value_cell {
        flex: 0 0 20%;
        min-width: 160px;
    }
    
    &.wpf_list_header,
    &.wpf_list_cell {
        flex: 0 0 20%;
        min-width: 170px;
    }
    
    &.wpf_action_header,
    &.wpf_action_cell {
        flex: 0 0 8%;
        min-width: 80px;
        justify-content: center;
    }
}

.wpf_placeholder_text {
    color: #999;
    font-style: italic;
    font-size: 12px;
}

// Element UI overrides for better integration
.wpf_table_cell {
    .el-select,
    .el-input {
        width: 100%;
    }
    
    .el-button {
        padding: 8px 12px;
        border-radius: 4px;
        
        &.is-disabled {
            opacity: 0.5;
        }
    }
}

// Responsive design
@media (max-width: 1200px) {
    .wpf_table_container {
        overflow-x: auto;
    }
    
    .wpf_table_header_row,
    .wpf_table_row {
        min-width: 800px;
    }
}

@media (max-width: 768px) {
    .wpf_table_header_row,
    .wpf_table_row {
        flex-direction: column;
        min-width: auto;
    }
    
    .wpf_table_cell {
        flex: 1 1 auto;
        min-width: auto;
        border-bottom: 1px solid #f1f3f4;
        
        &:last-child {
            border-bottom: none;
        }
    }
    
    .wpf_table_header_row .wpf_table_cell {
        background: #e9ecef;
        font-weight: 600;
    }
}

.wpf_default_list_section {
    margin-top: 7px;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #f9f9f9;
}

.wpf_default_list_checkbox {
    margin-bottom: 12px;
    font-weight: 500;
}

.wpf_default_list_selector {
    margin-top: 10px;
}

.wpf_default_list_select {
    width: 100%;
    max-width: 300px;
}
</style>
