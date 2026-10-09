<template>
    <div>
        <el-switch v-model="conditionals.status" v-if="!disabled" active-text="Enable conditional logic">
            {{ labels.status_label }}
        </el-switch>

        <el-checkbox v-else disabled @click.native="comingSoon = true">
            {{ labels.status_label }}
        </el-checkbox>

        <div v-if="conditionals.status" class="wpf_conditional_block">
            <div class="wpf_conditional_block-if"> 
                {{ labels.notification_if_start }}

                <el-select v-model="conditionals.type" class="wpf_conditional_block-select">
                    <el-option v-for="(label, value) in {all: 'All', any: 'Any'}" :key="value" :value="value">
                        {{ label }}
                    </el-option>
                </el-select>

                <!-- <select v-model="conditionals.type" class="wpf_conditional_block-select" :value="value" >
                    <option value="all">All</option>
                    <option value="any">Any</option>
                </select> -->

                {{ labels.notification_if_end }}
            </div>

            <el-row v-for="(logic, key) in items" :key="key"
                class="wpf_conditional_block-row"
            >
                <el-col :md="9">
                    <el-select size="medium" v-model="items[key].field" style="width: 100%" @change="onFieldChange(key)">
                        <el-option v-for="(field, key) in fields" :key="key"
                                   :label="(field.attributes && field.attributes.name) ? field.attributes.name : field.admin_label" :value="key"
                        ></el-option>
                    </el-select>
                </el-col>

                <el-col :md="6">
                    <el-select size="medium" v-model="items[key].operator">
                        <el-option-group
                            v-for="group in getConditionList(items[key].field)"
                            :key="group.group"
                            :label="group.group">
                            <el-option
                            v-for="opt in group.options"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-col>

                <el-col :md="9">
                    <template v-if="items[key].operator == 'length_equal' || items[key].operator == 'length_less_than' || items[key].operator == 'length_greater_than'">
                        <el-input size="medium" type="number" step="1" placeholder="Enter length in number" v-model="items[key].value" />
                    </template>
                    <template v-else-if="items[key].operator == 'donation_payment_type'">
                        <el-select size="medium" v-model="items[key].value" style="width: 100%">
                            <el-option value="0" label="One Time Donation"></el-option>
                            <el-option value="1" label="Recurring Donation"></el-option>
                        </el-select>
                    </template>
                    <template v-else-if="items[key].field == 'donation_item'">
                        <el-select v-if="items[key].operator === 'donation_payment_type' || items[key].operator === 'donation_items'" size="medium" v-model="items[key].value" style="width: 100%">
                            <el-option v-for="(label, value) in getDonationItems(items[key].field)" :key="value" :value="value" :label="label"></el-option>
                        </el-select>
                        <el-input size="medium" v-else placeholder="Enter a value" v-model="items[key].value"></el-input>
                    </template>
                    <template v-else>
                        <el-select size="medium" v-if="fields[logic.field] && Object.keys(fields[logic.field].options).length"
                                   v-model="items[key].value" style="width: 100%">
                            <el-option v-for="(label, value) in fields[logic.field].options" :key="value"
                                       :label="label" :value="value"
                            ></el-option>
                        </el-select>
                        <el-input size="medium" v-else placeholder="Enter a value" v-model="items[key].value"></el-input>
                    </template>
                </el-col>

                <!-- <span @click="remove(key)" style="cursor: pointer;"> <Icon icon="wpf-delete"  v-if="items.length > 1" class="wpf_conditional_block-delete"/> </span> -->
                <el-button :disabled="items.length == 1" @click="remove(key)" size="mini">
                    <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                        <Icon icon="wpf-delete" />
                    </el-tooltip>
                </el-button>
                <!-- <el-col :md="3" class="action-btns ">

                    <i class="el-icon-minus" @click="remove(key)"
                       v-if="items.length > 1"
                    ></i>
                </el-col> -->
            </el-row>
            <div class="wpf_block-add_more" @click="add(items.length - 1)"> 
                <Icon icon="wpf-black-add"/>
                <span class="wpf_block-add_more-button">
                    Add More
                </span>
            </div>
        </div>

    </div>
</template>

<script>
import Icon from '../../Icons/Index.vue';
export default {
    name: 'FilterFields',
    props: {
        conditionals: {
            type: Object,
            required: true,
            default: {}
        },
        fields: {
            type: Object,
            required: true,
            default: {}
        },
        editorShortcodes: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            required: true,
            default: false,
        },
        labels: {
            default: () => ({
                status_label: 'Enable conditional logic',
                notification_if_start: 'Send this notification if',
                notification_if_end: 'of the following match:'
            })
        }
    },
    components: {
        Icon
    },
    data() {
        return {
            defaultRules: {
                field: null,
                operator: '=',
                value: null,
                field_type: ''
            },
            comingSoon: false,
        }
    },
    computed: {
        items() {
            return this.conditionals.conditions;
        }
    },
    methods: {
        add(index) {
            this.items.splice(index + 1, 0, {...this.defaultRules});
        },
        remove(index) {
            this.items.splice(index, 1);
        },
        getConditionList(value) {
            if (value === 'donation_item') {
                return [
                    {
                        group: "Basic",
                        options: [
                            { label: "Equal", value: "=" },
                            { label: "Not Equal", value: "!=" },
                            { label: "Greater Than", value: ">" },
                            { label: "Less Than", value: "<" },
                            { label: "Greater or Equal", value: ">=" },
                            { label: "Less or Equal", value: "<=" }
                        ]
                    },
                    {
                        group: "Donation Filters",
                        options: [
                            { label: "Donation Payment Type", value: "donation_payment_type" },
                            { label: "Donation Items", value: "donation_items" }
                        ]
                    }
                ];
            } else if (value === 'choose_payment_method') {
                return [
                    {
                        group: "Basic",
                        options: [
                            { label: "Equal", value: "=" },
                            { label: "Not Equal", value: "!=" }
                        ]
                    },
                ];
            } else if (this.fields[value] && this.fields[value].attributes && this.fields[value].attributes.type === 'payment_item') {
                var paymentOptions = this.fields[value].options;
                var hasOptions = paymentOptions && Object.keys(paymentOptions).length;
                if (hasOptions) {
                    return [
                        { group: "Basic", options: [
                            { label: "Equal", value: "=" },
                            { label: "Not Equal", value: "!=" }
                        ]}
                    ];
                }
                return [
                    { group: "Basic", options: [
                        { label: "Equal", value: "=" },
                        { label: "Not Equal", value: "!=" },
                        { label: "Greater Than", value: ">" },
                        { label: "Less Than", value: "<" },
                        { label: "Greater or Equal", value: ">=" },
                        { label: "Less or Equal", value: "<=" }
                    ]}
                ];
            } else if (value) {
                return [
                    {
                        group: "Basic",
                        options: [
                            { label: "Equal", value: "=" },
                            { label: "Not Equal", value: "!=" },
                            { label: "Greater Than", value: ">" },
                            { label: "Less Than", value: "<" },
                            { label: "Greater or Equal", value: ">=" },
                            { label: "Less or Equal", value: "<=" }
                        ]
                    },
                    {
                        group: "Text Operators",
                        options: [
                            { label: "Starts With", value: "startsWith" },
                            { label: "Ends With", value: "endsWith" },
                            { label: "Contains", value: "contains" },
                            { label: "Does Not Contain", value: "doNotContains" }
                        ]
                    },
                    {
                        group: "Advanced",
                        options: [
                            { label: "Length Equal", value: "length_equal" },
                            { label: "Length Less Than", value: "length_less_than" },
                            { label: "Length Greater Than", value: "length_greater_than" }
                        ]
                    }
                ];
            }

            // Default
            return [
                {
                    group: "Basic",
                    options: [
                        { label: "Equal", value: "=" },
                        { label: "Not Equal", value: "!=" }
                    ]
                }
            ];
        },
        getDonationItems(value) {
            if(this.fields[value]?.options) {
                return this.fields[value]?.options;
            }
            return this.fields[value]?.options;
        },
        onFieldChange(key) {
            this.items[key].value = '';
            this.items[key].operator = '=';
            var field = this.fields[this.items[key].field];
            this.$set(this.items[key], 'field_type', (field && field.attributes) ? field.attributes.type : '');
        }
    },
    mounted() {
        if (!this.conditionals.conditions.length) {
            this.conditionals.conditions.push({...this.defaultRules});
        } else {
            this.items.forEach((item) => {
                if (!item.field_type) {
                    var field = this.fields[item.field];
                    this.$set(item, 'field_type', (field && field.attributes) ? field.attributes.type : '');
                }
            });
        }
    }
};
</script>
