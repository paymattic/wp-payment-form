<template>
    <div>
        <div>
            <!-- End Render container -->
            <!-- {{ element }} -->
            <input
                v-if="inputFieldCheck(element)"
                v-model="field_options.placeholder"
                :placeholder="field_options.numeric_calculation === 'yes' && field_options.calculation_expression.length > 0 ? field_options.calculation_expression : 'Enter placeholder'"
                :type="element.type === 'date' ? element.type : 'text'"
                class="input-component"
                :disabled="field_options.disable"
                style="color: #BDC3C7;"
                :class="{ 'wpf_numeric_calculation': field_options.numeric_calculation === 'yes' }"
            >

            <!-- Customer Full Name input component -->
            <div v-if="element.type === 'customer_full_name'" class="customer_full_name">
                <div class="wpf_names_row" style="display: flex; gap: 15px; flex-wrap: wrap; width: 100%;">
                    <template v-for="fieldName in ['first_name', 'middle_name', 'last_name']">
                        <div 
                            v-if="field_options.name_layout.includes(fieldName)"
                            :key="fieldName" 
                            class="wpf_name_field_column" 
                            :style="{ flex: '1', width: 'calc(100% / ' + field_options.name_layout.length + ' - 15px)' }"
                        >
                            <div class="wpf_label_content">
                                <LabelEditor 
                                    v-model="element.field_options.name_layout_labels[fieldName]" 
                                />
                            </div>
                            <div class="wpf_input_content">
                                 <input
                                    v-model="element.field_options.name_layout_placeholders[fieldName]"
                                    :placeholder="element.field_options.name_layout_placeholders[fieldName]"
                                    :disabled="field_options.disable"
                                    class="input-component"
                                    style="color: rgb(189, 195, 199);"
                                />
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <!-- End Customer Full Name input component -->
            <!-- Custom payment input component -->
            <div v-if="element.type === 'custom_payment_input'" style="display: flex;">
                <span class="donation-button">$</span>
                <Input
                    v-model="field_options.placeholder"
                    :placeholder="field_options.placeholder"
                    :visibility="field_options.disable ? 'no' : 'yes'"
                    class="custom_payment_input"
                />
            </div>
            <!-- End Custom payment input component -->
            <!-- Dynamic Payment Item input component -->
             <div v-if="element.type === 'dynamic_payment_item'" style="display: flex">
                <el-input
                    v-model="field_options.placeholder"
                    :placeholder="field_options.numeric_calculation === 'yes' && field_options.calculation_expression.length > 0 ? field_options.calculation_expression : field_options.placeholder"
                    :disabled="field_options.disable"
                    class="custom_payment_input"
                    :class="{ 'wpf_numeric_calculation': field_options.numeric_calculation === 'yes' }"
                >
                </el-input>
             </div>
             <!-- End Dynamic Payment Item input component -->
            <!-- Hidden input component -->
            <Input
                v-if="element.type === 'hidden_input'"
                placeholder="This hidden field will be hidden on the frontend"
                :visibility="'no'"
            />
            <!-- File upload component -->
           <div :style="{opacity: field_options.disable ? 0.2 : 1}" class="dropzone" v-if="element.type === 'file_upload_input'">
                <Icon icon="wpf-upload-file" />
                <span class="dropzone_label">{{ field_options.button_text }}</span>
                <span class="max_file_label">Max. file size up to {{ field_options.max_file_size }} MB.</span>
           </div>
            <!-- Terms end condition component -->
            <div class="terms_description_box" v-if="element.type === 'terms_conditions' && element.field_options.tc_description">
                <p  v-html="element.field_options.tc_description"></p>
            </div>
            <!-- Phone component -->
            <input
                v-if="element.type === 'phone'"
                type="tel"
                class="input-component"
                :disabled="field_options.disable"
                :id="element.id"
            />
            <!-- Texarea component -->
            <textarea
                class="input-component"
                v-model="field_options.placeholder"
                :disabled="field_options.disable"
                v-if="element.type === 'textarea'"
                :rows="4"
                style="color: #BDC3C7;"
            ></textarea>
            <!-- Radio component -->
            <div>
                <Radio v-if="element.type === 'radio'" :field_options="field_options.options" :isDynamic="true" :inline="field_options.inline" />
            </div>
            <!-- Select component -->
            <div  >
                <Select v-if="element.type === 'select'" :field_options="field_options.options" />
            </div>
            <!-- Currency switcher -->
            <div >
                <Select v-if="element.type === 'currency_switcher' && field_options.display_type === 'select'" :field_options="field_options.switch_options" />
                <Radio v-if="element.type === 'currency_switcher'  && field_options.display_type === 'radio'" :field_options="field_options.switch_options" :isDynamic="false" />
            </div>
            <!-- Checkbox component -->
            <div v-if="element.type === 'checkbox'" style="min-width: 400px;" >
            <Checkbox :field_options="field_options.options" :isDynamic="true" :inline="field_options.inline"/>
            </div>
            <!-- Address component -->
            <div v-if="element.type === 'address_input'" class="editor_addresses">
                <div class="address_fields_wrapper">
                    <div v-for="field in addressFields" class="address_item">
                        <div class="address_field">
                            <LabelEditor v-model="field_options.subfields[field].label" />
                            <select
                                v-if="field_options.subfields[field].type === 'select'"
                                v-model="field_options.subfields[field].placeholder"
                                class="input-component"
                                :disabled="field_options.disable"
                            >
                                <option
                                    v-for="(option_name, option_key) in countries"
                                    :key="option_key"
                                    :label="option_name"
                                    :value="option_name"
                                >
                                {{option_name}}
                                </option>
                            </select>
                            <Input
                                v-else
                                v-model="field_options.subfields[field].placeholder"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Payment item component -->
            <div v-if="element.type === 'payment_item'">
                <div v-if="field_options.pricing_details.one_time_type === 'choose_single'">
                    <Radio
                        :field_options="field_options.pricing_details.multiple_pricing"
                        :isDynamic="false"
                        :isPaymentItem="true"
                        :enable_image="field_options.enable_image"
                        :horizontal="field_options.horizontal"
                        :column_numbers="field_options.column_numbers"
                        :currencySign="currencySettings.currency_sign"
                        v-if="element.field_options.pricing_details.prices_display_type === 'radio'"
                        :class="getProductItemClass(element.field_options)"
                    />
                    <Select
                        :field_options="field_options.pricing_details.multiple_pricing"
                        :isDynamic="false"
                        :isPaymentItem="true"
                        :enable_image="field_options.enable_image"
                        :currencySign="currencySettings.currency_sign"
                        v-if="element.field_options.pricing_details.prices_display_type === 'select'"
                    />
                </div>
                <Checkbox
                    v-if="field_options.pricing_details.one_time_type === 'choose_multiple'"
                    :field_options="field_options.pricing_details.multiple_pricing"
                    :isDynamic="false"
                    :isPaymentItem="true"
                    :horizontal="field_options.horizontal"
                    :enable_image="field_options.enable_image"
                    :currencySign="currencySettings.currency_sign"
                    :column_numbers="field_options.column_numbers"
                    :class="getProductItemClass(element.field_options)"
                />
            </div>
            <!-- Subcription Item component -->
            <div v-if="element.type === 'recurring_payment_item'">
                <Radio
                    v-if="field_options.recurring_payment_options.choice_type === 'choose_single'
                        && field_options.recurring_payment_options.selection_type === 'radio'"
                    :field_options="field_options.recurring_payment_options.pricing_options"
                    :enable_image="field_options.enable_image"
                    :option_key = "'name'"
                    :currencySign="currencySettings.currency_sign"
                    style="padding-bottom: 10px;"
                />
                <Select
                    v-if="field_options.recurring_payment_options.choice_type === 'choose_single' && field_options.recurring_payment_options.selection_type === 'select'"
                    :field_options="field_options.recurring_payment_options.pricing_options"
                    :enable_image="field_options.enable_image"
                    :option_key = "'name'"
                    :currencySign="currencySettings.currency_sign"
                    style="margin-bottom: 10px;"
                ></Select>
                <span style="font-weight: 500; font-size: 16px">${{field_options.recurring_payment_options.pricing_options[0].subscription_amount }}
                    for each {{ field_options.recurring_payment_options.pricing_options[0].billing_interval }}
                </span>
            </div>
            <!-- Tabular component -->
            <div v-if="element.type === 'tabular_products'">
                <Table :tableData="field_options" :tabular_id="element.id" />
            </div>
            <!-- Donation component -->
            <div v-if="element.type === 'donation_item'">
                <DonationComponent :field_options="field_options" :currencySign="currencySettings.currency_sign"/>
            </div>
            <!-- Payment method component -->
            <div v-if="element.type === 'choose_payment_method'">
                <PaymentMethodComponent :field_options="field_options" />
            </div>
            <div v-if="element.type === 'payment_summary'">
                <PaymentSummary />
            </div>
        </div>
    </div>
</template>
<script>
    import 'intl-tel-input/build/css/intlTelInput.css';
    import 'intl-tel-input/build/js/intlTelInput.js';
    import intlTelInput from 'intl-tel-input';
    import Input from './CommonFormComponent/Input.vue';
    import LabelEditor from './Widget/LabelEditor.vue';
    import Radio from './CommonFormComponent/Radio.vue';
    import Select from './CommonFormComponent/Select.vue';
    import Checkbox from './CommonFormComponent/Checkbox.vue';
    import Table from './TabularProduct/TabularTable.vue';
    import DonationComponent from './Donation/DonationComponent.vue';
    import PaymentMethodComponent from './ChoosePaymentMethod/PaymentMethodComponent.vue';
    import PaymentSummary from './PaymentItem/PaymentSummary.vue';
    import { inputFieldValidation } from './editorHelper.js';
    // import RenderContainer from './_RenderContainer.vue';
    import Icon from '../../Icons/Index.vue';
    export default {
        name: 'RenderComponent',
        components: {
            Input,
            LabelEditor,
            Radio,
            Select,
            Checkbox,
            Table,
            DonationComponent,
            PaymentMethodComponent,
            PaymentSummary,
            Icon
        },
        data () {
            return {
                countries: window.wpPayFormsAdmin.countries
            }
        },
        props: ['field_options', 'element', 'currencySettings'],
        watch: {
            field_options: {
                handler(newVal) {
                    this.$forceUpdate();
                },
                deep: true
            }
        },
        computed: {
            addressFields() {
                const fields = Object.keys(this.field_options.subfields);
                return fields.filter(field => this.field_options.subfields[field].visibility === 'yes');
            }
        },
        methods: {
            inputFieldCheck(element) {
                return inputFieldValidation(element);
            },
            addFormField() {
                this.$emit('add-form-field');
            },
            getProductItemClass(field_options) {
                if (field_options?.paymattic_template == 'paymattic_inline_template') {
                    return 'payment_item_template';
                } else if (field_options?.paymattic_template == 'paymattic_grid_template') {
                    return 'payment_item_card_template';
                } else {
                    return '';
                }
            },
        },
        mounted(){
            if (this.element.type === 'phone') {
                setTimeout(() => {
                    const input = document.querySelector(`#${this.element.id}`);
                    intlTelInput(input, {
                        preferredCountries: this.element?.field_options?.priority_country_code || [],
                    });
                }, 1000)
            }
        }
    }
</script>

<style scoped lang="scss">
    .donation-button {
        background-color: #f1f1f1;
        border: 1px solid #e4e7ea;
        padding: 8px;
        min-width: 50px;
        text-align: center;
        font-size: 16px;
        border-radius: 8px 0 0 8px;
    }

    // .input-component {
    //     display: block;
    //     width: 100% !important;
    //     max-width: 100% !important;
    //     padding: 8px;
    //     min-height: 45px;
    //     border: 1px solid #e4e7ea;
    // }
    .terms_description_box {
        background-color: white;
        padding: 5px;
    }
    input[type=checkbox]:focus,
    input[type=date]:focus,
    input[type=datetime]:focus,
    input[type=email]:focus,
    input[type=number]:focus,
    input[type=password]:focus,
    input[type=radio]:focus,
    input[type=tel]:focus,
    input[type=text]:focus,
    input[type=time]:focus,
    input[type=url]:focus,
    select:focus,
    textarea:focus {
        border-color: #0850ae !important;
        border-bottom: 1px solid #0850ae !important;
        box-shadow: 0 0 0 1px #084eab !important;
    }
    .wpf-radio-label {
        .el-button--text  {
        //    display: none;
            padding: 0;
            width: 0;
            transition: .3s;
            overflow: hidden;
            border: none;
        }
        &:hover {
            .el-button--text  {
                width: 16px;
                margin-right: -16px;
                &:last-child {
                    margin-left: 14px;
                }
            }
        }
        input {
            border: none;
            background-color: white;
            &:focus {
                border: none;
                outline: none;
                box-shadow: none;
            }
        }
    }

    .wpf_numeric_calculation {
        &.input-component {
            background-color: #F5F7FA !important;
            &::placeholder {
                color: #93979e !important;
            }
        }
    }

</style>
