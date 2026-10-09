<template>
    <div>
        <el-row v-for="(field, index) in item" :key="index">
            <el-col :span="8" style="padding-right: 10px">
                <el-select :allow-create="true" filterable class="item_full_width" size="small"
                    v-model="field.target_field">
                    <el-option v-for="(option_name, option_key) in getAllOptionInputs(all_inputs)" :key="option_name.id"
                        :label="option_name.field_options ? option_name.field_options.label : option_name.label" :value="option_name.id"></el-option>
                </el-select>
            </el-col>
            <el-col :span="8" style="padding-right: 10px">
                <el-select :allow-create="true" filterable class="item_full_width" size="small"
                    v-model="field.condition">
                    <el-option v-if="field.target_field"
                        v-for="(option_name, option_key) in getConditionList(field.target_field)" :key="option_key"
                        :label="option_key.replaceAll('_', ' ')" :value="option_key"></el-option>
                </el-select>
            </el-col>
            <el-col :span="7" v-show="field.target_field" style="padding-right: 10px">
                <template v-for="(element) in all_inputs">
                    <el-select v-if="(element.id === field.target_field) && (checkConditionforSelectOrInput(element))"
                        :allow-create="true" filterable class="item_full_width" size="small" v-model="field.value">
                        <el-option v-for="(el_name, el_key) in getSelectOptioinValues(element, field.target_field)"
                            :key="el_key" :label="el_name.label" :value="getOptionValue(el_name, field.target_field)"></el-option>
                    </el-select>
                    <el-input v-else-if="element.id === field.target_field" size="mini" v-model="field.value"
                        type="text"></el-input>
                </template>
            </el-col>
            <el-col :span="1" class="wpf_el_action">
                <el-button :disabled="item.length == 1" @click="deleteItem(index)">
                    <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                        <Icon icon="wpf-delete" />
                    </el-tooltip>
                </el-button>

                <!-- <el-button @click="add()" v-show="(index + 1) == item.length" type="success" size="mini">+
                </el-button> -->
            </el-col>
        </el-row>
        <div class="wpf_add_item">
            <a :underline="false" @click="add()">
                <Icon icon="wpf-black-add" /> <span>Add More</span>
            </a>
        </div>
    </div>
</template>
<script type="text/babel">
import { getContainerFields, getContainersFields } from '../editorHelper.js';
import each from 'lodash/each';
import Icon from '../../../Icons/Index.vue';

export default {
    name: 'conditional_render_options',
    props: ['value', 'all_elements', 'current_item'],
    components: {
        Icon
    },
    data() {
        return {
            value_option: false,
            item: [{}],
            conditions: {},
            all_inputs: []
        }
    },
    watch: {
        item: {
            handler() {
                this.$emit('update:value', JSON.parse(JSON.stringify(this.item)));
            },
            deep: true
        }
    },
    methods: {
        getAllOptionInputs(item) {
            let conditional_field = item.filter(element => element?.conditional_hide !== true);
            let conditional_options = [];
            conditional_field?.map((item) => {
                if (item?.type === 'address_input') {
                    let subFields = item.field_options.subfields;
                    for (const key in subFields) {
                        let obj = subFields[key]
                        conditional_options.push(obj);
                    }
                }
                else if (item?.type === 'donation_item') {
                    conditional_options.push(item);
                } else {
                    conditional_options.push(item);
                }
            })
            return conditional_options;
        },

        checkTargetField(element, target_field) {
            let found = false;

            const getTargetField = (field) => {
                if (field.id === target_field) {
                    found = true;
                }
            };

            if (element.field_options && element.field_options.columns) {
                element.field_options.columns.forEach((column) => {
                    column.fields.forEach((field) => {
                        getTargetField(field);
                    });
                });
            } else {
                getTargetField(element);
            }

            return found;
        },

        checkConditionforSelectOrInput(element) {
            if (element.type === 'payment_item') {
                if (element?.field_options?.pricing_details?.one_time_type === 'single') {
                    return false;
                }
                return element.type === 'payment_item';
            }
            if (element.type === 'donation_item') {
                return element.type === 'donation_item';
            }
            else {
                return element.type === 'radio' || element.type === 'checkbox' || element.type === 'select'
            }
        },

        getSelectOptioinValues(data_item) {
            if (data_item?.id?.includes('country')) {
                let countries = [];
                for (const key in window.wpPayFormsAdmin.countries) {
                    countries.push({
                        label: window.wpPayFormsAdmin.countries[key],
                        value: key
                    })
                }
                return countries;

            } else if (data_item?.id?.includes("payment_item")) {
                return data_item?.field_options?.pricing_details?.multiple_pricing;
            } else if (data_item?.id?.includes("donation_item")) {
                // in multiple pricing, if label is empty, then use value as label
                let multiple_pricing = data_item?.field_options?.pricing_details?.multiple_pricing;
                if (multiple_pricing && Array.isArray(multiple_pricing)) {
                    return multiple_pricing.map( item => {
                        if (!item.label || item.label === '') {
                            return {
                                ...item,
                                label: item.value
                            };
                        }
                        return item;
                    });
                }
                return multiple_pricing;
            } else {
                return data_item.field_options.options;
            }
        },

        getConditionList(target_field) {
            let all_elements = this.all_elements;
            let container_fields = getContainersFields(this.all_elements);
            all_elements = [...container_fields, ...all_elements];
            const selected_field = all_elements.find(element => element.id === target_field);

            let single_payment_item = selected_field?.field_options?.pricing_details?.one_time_type;
            if (selected_field?.isNumberic === 'yes') {
                if (selected_field?.is_payment_field && single_payment_item !== 'single') {
                    return { equal: "=", not_equal: "!=" };
                } else {
                    return {
                        equal: "=",
                        not_equal: "!=",
                        greater_than: ">",
                        less_than: "<",
                        greater_or_equal: ">=",
                        less_or_equal: "<="
                    }
                }
            } else if (selected_field?.isNumberic === 'no') {
                return {
                    equal: "=",
                    not_equal: "!=",
                    starts_with: "startsWith",
                    ends_with: "endsWith",
                    contains: "contains",
                    not_contains: "doNotContains"
                }
            }
            return { equal: "=", not_equal: "!=" };
        },

        deleteItem(index) {
            this.item.splice(index, 1);
        },
        add() {
            this.item.push({
                target_field: '',
                condition: '',
                value: ''
            });
        },
        getOptionValue(el_name, targetField) {
            if(targetField === 'country') {
                return el_name.value;
            } else if(targetField === 'radio') {
                return el_name.value;
            } else if(targetField === 'checkbox') {
                return el_name.value;
            } else if(targetField === 'select') {
                return el_name.value;
            } else if(targetField === 'donation_item') {
                return el_name.value;
            } else {
                return el_name.label;
            }
            // return targetField === 'country' ? el_name.value : el_name.label;
        }
    },
    mounted() {
        let current_item = this.current_item
        let all_elements = this.all_elements;
        let container_fields = getContainersFields(all_elements);
        all_elements = [...container_fields, ...all_elements];
        let all_inputs_item = all_elements.filter(function (item) {
            return !item.id.includes(current_item)
        });
        let all_inputs_data = [];
        all_inputs_item?.map((item) => {
            // if (item?.field_options?.pricing_details?.one_time_type !== 'single') {
            if (item?.type === 'address_input') {
                let subFields = item.field_options.subfields;
                for (const key in subFields) {
                    let obj = subFields[key]
                    all_inputs_data.push(obj);
                }
            } else {
                all_inputs_data.push(item);
            }
            // }
        })
        this.all_inputs = all_inputs_data;
        if (this.value) {
            this.item = JSON.parse(JSON.stringify(this.value));
        }
    }
}
</script>

<style lang="scss" scoped>
.enableImageContainer {
    float: left;
}

.el-col {
    padding: 5px 0;
}

.wpf_el_action {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 3px;
}

.el-button {
    padding: 6px 12px;
}
</style>
