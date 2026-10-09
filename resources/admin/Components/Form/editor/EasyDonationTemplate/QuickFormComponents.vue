<template>
    <div style="position:relative;">
        <div v-for="(element, elmIndex) in all_elements" :key="elmIndex">
            <app-card v-if="element.type === 'donation_item'" class="form-element-container">

                <div class="header" slot="header">
                    <LabelEditor
                        style="margin-right: 4px; border: none; font-size: 14px;"
                        v-model="element.field_options.label"
                        :nullable="true"
                        :placeholder="element.editor_title"
                    />
                </div>

                <div style="width: 100%;" class="body" slot="body">
                    <div class="donation-settings">
                        <div class="setting-item">
                            <el-checkbox
                                style=" font-weight: 600; padding: 5px;"
                                v-if="element.editor_elements.enable_image"
                                v-model="element.field_options.enable_image"
                                true-label="yes"
                                false-label="no"
                            >{{ $t('Enable image') }}</el-checkbox>
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>

                        <div class="setting-item">
                            <el-checkbox
                                style=" font-weight: 600; padding: 5px"
                                v-model="element.field_options.pricing_details.show_statistic"
                                true-label="yes"
                                false-label="no"
                            >{{ $t('Show statistics') }}</el-checkbox>
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>

                        <div class="setting-item">
                            <el-checkbox
                                style=" font-weight: 600; padding: 5px"
                                v-model="element.field_options.pricing_details.progress_bar"
                                true-label="yes"
                                false-label="no"
                            >{{ $t('Show progress bar') }}</el-checkbox>
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>
                    </div>

                    <div class="image-upload gap-2">
                        <h6>{{ $t('File upload') }}
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </h6>
                        <div class="image-preview">
                            <div v-for="(item,index) in getImageUrl(element.field_options.pricing_details.image_url)" :key="index">
                                <photo-widget :product="item" />
                            </div>
                        </div>
                    </div>

                    <div class="gap-2">
                        <h6>{{ $t('Donation goal amount') }}
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </h6>
                        <el-input
                            style="width: 320px;"
                            placeholder="Type something"
                            v-model="element.field_options.pricing_details.donation_goals"
                            prefix-icon="el-icon-coin"
                            type="number"
                            size="small"
                            >
                        </el-input>
                    </div>

                    <div class="gap-2 predefined-amounts">
                        <h6>{{ $t('Predefined amounts') }}
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </h6>
                        <div class="pricing_key_pair_options">
                            <key-pair-pricing :value.sync="element.field_options.pricing_details.multiple_pricing" enableImage='no'></key-pair-pricing>
                        </div>

                        <div>
                            <el-checkbox
                                v-model="element.field_options.pricing_details.allow_custom_amount"
                                true-label="yes"
                                false-label="no"
                                class="gap-2"
                            >
                                {{ $t('Allow custom amount') }} <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                            </el-checkbox>

                            <div class="select_default_amount custom-select" v-if="element.field_options.pricing_details.multiple_pricing.length">
                                <h6>{{ $t('Default donation amount') }}
                                    <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                        <i class="el-icon-info"></i>
                                    </el-tooltip>
                                </h6>
                                <el-select  prefix-icon="el-icon-search" size="mini" v-model="element.field_options.default_value" placeholder="">
                                    <el-option v-for="(multiple_pricing, index) in element.field_options.pricing_details.multiple_pricing" :value="index" :label="multiple_pricing.label || multiple_pricing.value" :key="index">
                                        {{multiple_pricing.label || multiple_pricing.value}}
                                    </el-option>
                                </el-select>
                                <Icon class="prefix-icon" icon="wpf-money" />
                            </div>
                        </div>

                    </div>

                    <div class="gap-2" v-if="has_pro">
                        <h6>{{ $t('Enable Gift Aid') }}
                            <el-tooltip class="item" effect="dark" :content="$t('Allow UK taxpayers to boost their donation by 25% at no extra cost via Gift Aid.')" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </h6>
                        <el-checkbox
                            v-model="element.field_options.enable_gift_aid"
                            true-label="yes"
                            false-label="no"
                        >{{ $t('Enable Gift Aid') }}</el-checkbox>
                        <div v-show="element.field_options.enable_gift_aid === 'yes'" class="gap-2" style="margin-top: 8px;">
                            <h6>{{ $t('Gift Aid Title') }}</h6>
                            <el-input
                                v-model="element.field_options.gift_aid_title"
                                :placeholder="$t('Boost your donation with Gift Aid')"
                                maxlength="255"
                            />
                        </div>
                        <div v-show="element.field_options.enable_gift_aid === 'yes'" class="gap-2" style="margin-top: 8px;">
                            <h6>{{ $t('Gift Aid Declaration Text') }}</h6>
                            <el-input
                                type="textarea"
                                :rows="3"
                                v-model="element.field_options.gift_aid_declaration"
                                :placeholder="$t('Enter the Gift Aid declaration text shown to donors')"
                                maxlength="2000"
                            />
                        </div>
                    </div>

                    <div class="gap-2">
                        <div class="gap-2">
                            <h6>{{ $t('Collect recurring donation') }}
                                <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </h6>
                            <el-checkbox
                                v-model="element.field_options.pricing_details.allow_recurring"
                                true-label="yes"
                                false-label="no"
                            >{{ $t('Allow recurring amount') }}
                            <el-tooltip class="item" effect="dark" content="Right Top prompts info" placement="top-start">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                            </el-checkbox>
                        </div>
                        <el-container class="recurring-donation" v-if="element.field_options.pricing_details.allow_recurring === 'yes'">
                            <el-main style="padding: 0px;">
                                <el-aside class="bold-p" style="padding-bottom: 10px;">Max bill time
                                    <el-tooltip class="item" placement="top-start" effect="light">
                                        <div slot="content">
                                            <p>
                                                Keep 0 for unlimited recurring donations.
                                            </p>
                                        </div>
                                        <i class="el-icon-info" />
                                    </el-tooltip>
                                </el-aside>
                                    <el-input-number
                                        :default="element.field_options.pricing_details.bill_time_max"
                                        size="mini"
                                        v-model="element.field_options.pricing_details.bill_time_max"
                                        :min="0">
                                    </el-input-number>
                                    <div class="" style="padding: 20px 0 3px 0;">
                                        <h6>{{ $t('Show Interval as') }} </h6>
                                        <el-radio-group
                                            size="small"
                                            v-model="element.field_options.pricing_details.interval_display_type">
                                            <el-radio label="dropdown" key="dropdown">
                                                {{ $t('Dropdown') }}
                                            </el-radio>

                                            <el-radio label="button" key="button">
                                                {{ $t('Button') }}
                                            </el-radio>
                                        </el-radio-group>
                                    </div>                                           
                                    <div v-if="element.field_options.pricing_details.allow_recurring === 'yes'" style="display: flex; margin-top: 10px; gap: 8px;">
                                        <input style="margin-top: 2px;" type="checkbox" />
                                        <LabelEditor
                                            style="margin-right: 4px; border: none; line-height: 20px; box-sizing: border-box; color: #2F3448; font-size: 14px; font-style: normal; font-weight: 500;"
                                            v-model="element.field_options.pricing_details.interval_label"
                                            :nullable="true"
                                            :placeholder="element.field_options.pricing_details.interval_label"
                                        />
                                    </div>
                                    <div v-if="element.field_options.pricing_details.allow_recurring === 'yes'" style="padding-left: 29px;">
                                    <div v-if="element.field_options.pricing_details.interval_display_type === 'dropdown'" style="display: flex; margin-top: 10px">  
                                        <LabelEditor
                                                class="wpf_interval_text_dropdown"
                                                v-model="element.field_options.pricing_details.interval_text"
                                                :nullable="true"
                                                :placeholder="element.field_options.pricing_details.interval_text"
                                            />
                                        <select class="donation-select">
                                            <option v-for="interval in element.field_options.pricing_details.intervals" :key="interval">
                                                {{ interval }}
                                            </option>
                                        </select>
                                    </div>
                                    <div v-if="element.field_options.pricing_details.interval_display_type === 'button'" style="margin-top: 10px">
                                        <LabelEditor
                                                style="margin-right: 4px; border: none; line-height: 20px; box-sizing: border-box; color: #2F3448; font-size: 14px; font-style: normal; font-weight: 500;"
                                                v-model="element.field_options.pricing_details.interval_text"
                                                :nullable="true"
                                                :placeholder="element.field_options.pricing_details.interval_text"
                                            />
                                        <el-row style="display: flex; flex-wrap: wrap; padding-top: 7px;">
                                            <el-button size="mini" v-for="interval in element.field_options.pricing_details.intervals" :key="interval">
                                                {{ interval }}
                                            </el-button>
                                        </el-row>
                                    </div>

                                </div>
                                <div>
                                    <p class="bold-p" style="margin: 0; padding-top: 15px;">
                                        Dropdown order: {{element.field_options.pricing_details.intervals}}
                                        <el-tooltip class="item" placement="top-start" effect="light">
                                            <div slot="content">
                                                <p>
                                                    You can check by order which will <br/>follow that order on frontend
                                                </p>
                                            </div>
                                            <i class="el-icon-info" />
                                        </el-tooltip>
                                    </p>
                                    <el-checkbox-group v-model="element.field_options.pricing_details.intervals" style="padding-top: 15px; display: flex">
                                        <el-checkbox v-for="interval in element.field_options.pricing_details.interval_options" :label="interval" :key="interval">{{interval}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </el-main>
                        </el-container>
                    </div>
                </div>

            </app-card>
            <app-card v-else style="border: 2px solid #E9EEF3" class="form-element-container">
                <div class="header" slot="header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="header" slot="header">
                        <LabelEditor
                            style="margin-right: 4px; border: none; font-size: 14px;"
                            v-model="element.field_options.label"
                            :nullable="true"
                            :placeholder="element.editor_title"
                        />
                    </div>
                    <div v-if="'payment_method_element' != element.group" class="settings" style="display: flex; align-items: center; gap: 10px;">
                        <el-checkbox
                            style=" font-weight: 600;"
                            v-model="element.field_options.disable"
                        >Disable</el-checkbox>
                        <el-checkbox
                            style=" font-weight: 600;"
                            v-model="element.field_options.required"
                            true-label="yes"
                            false-label="no"
                            :disabled="element.field_options.disable ? true : false"
                        >Required</el-checkbox>
                        <span style="color: #EAECF0; padding: 0 10px;">|</span>
                        <span :disabled="element.field_options.disable ? true : false" style="text-decoration: underline; cursor: pointer;" class="icon" @click="deleteComponent(element)">
                            <Icon icon="wpf-delete" style="margin-right: 4px;" />
                            {{ $t('Delete') }}
                        </span>

                    </div>
                </div>

                <div v-if="element.group === 'input' && (element.type === 'checkbox' || element.type === 'select' || element.type === 'radio' )" class="body" slot="body" style="width: 100%;">
                    <div>
                        <key-pair-options :value.sync="element.field_options.options" :hide_bulk_action="true" :key="elmIndex + 'value'" />
                    </div>
                </div>
                
                <div v-else-if="element.group === 'input' && (element.type !== 'checkbox' && element.type !== 'select' &&  element.type !== 'radio' ) " class="body" slot="body" style="width: 100%;">
                    <p style="font-weight: 500; margin:0; margin-bottom: 10px;">{{ $t('Placeholder') }}</p>
                    <el-input
                        placeholder="Enter your placeholder"
                        v-model="element.field_options.placeholder"
                        size="small"
                        width="100%"
                        :disabled="element.field_options.disable ? true : false"
                    ></el-input>
                </div>

                <div v-else-if="element.type === 'currency_switcher'" class="body" slot="body" style="width: 100%;">
                    <div v-for="(item, itemName) in element.editor_elements"
                        :class="[item.wrapper_class, 'wpf_item_group_' + item.group]"
                        class="editor_form_item" :key="itemName"
                    >
                       <currency-pair-options
                            v-if="item.type == 'currency_pair'"
                            :element="element"
                            :item="item"
                            :value.sync="element.field_options[itemName]"
                            :currency_list="item.currency_list"
                        /> 
                    </div>
                </div>

                <div v-else-if="'payment_method_element' == element.group" class="body" slot="body" style="width: 100%;">
                    <payment-method-choice
                        :field_options="element.field_options"
                        :item="element.editor_elements.method_settings"
                        :method_settings="element.field_options.method_settings"
                    />
                </div>

                <div v-else-if="element.type === 'fee_recovery_item'" class="body" slot="body" style="width: 100%;">
                    <div class="wpf-fee-recovery-quick-form">
                        <fee-recovery-component
                            :element="element"
                            :item="element.editor_elements.fee_recovery_settings || {}"
                        />
                    </div>
                </div>

            </app-card>
        </div>
        
        <el-dropdown @command="handleCommand">
            <el-button type="" size="medium">
                Add more field<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu  slot="dropdown">
                <el-dropdown-item v-for="component in allQuickCheckoutComponent" :command="component" :key="component.id">{{component.editor_title}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import KeyPairPricing from '../Widget/KeyPairOption/_key_pair_pricing_options';
import keyPairOptions from '../Widget/KeyPairOption/_key_pair_options';
import findIndex from 'lodash/findIndex'
import PhotoWidget from '../Widget/PhotoWidget/_photo_widget';
import PaymentMethodChoice from "./simple_payment_choose.vue";
import LabelEditor from '../Widget/LabelEditor.vue';
import CurrencyPairOptions from "./_currency_pair_options_for_quick_form.vue";
import FeeRecoveryComponent from "../FeeRecovery/FeeRecoveryComponent.vue";
import forEach from 'lodash/forEach';
import AppCard from '../../../Common/AppCard.vue';
import Icon from '../../../Icons/Index.vue';
export default {
    name: 'quick_form_components',
    components: {
        KeyPairPricing,
        PhotoWidget,
        PaymentMethodChoice,
        LabelEditor,
        keyPairOptions,
        CurrencyPairOptions,
        FeeRecoveryComponent,
        AppCard,
        Icon
    },
    props: ["all_elements", "allComponents"],
    data() {
        return {
            disableStyle: "color:#c0c4cc;",
            activeStyle:"none",
            checkAll: false,
            checkedCities: [],
            cities: [],
            isIndeterminate: true,
            allQuickCheckoutComponent: [],
            modifiedElements: [],
            has_pro: window.wpPayFormsAdmin.has_pro || false
        }
    },
    created() {  
        this.setModifiedElements(); 
    },
    watch: {
    // Watch for changes to all_elements and apply defaults when it becomes available
    all_elements: {
      handler: 'setModifiedElements',
      immediate: true
    }
  },
    computed: {
        elementIds() {
            let ids = [];
            forEach(this.all_elements, (element) => {
                ids.push(element.id);
            });
            return ids;
        }
    },
    methods: {
        deleteComponent(element) {
            this.all_elements.splice(findIndex(this.all_elements, element), 1);
            this.getAddMoreComponent();
        },
        getImageUrl(image) {
            const file_name = image[0].photo.alt_text === 'donation-thumbnail-horizontal' ? 'horizantal.jpeg' : 'vertical.jpeg';
            if (image[0]?.photo?.image_thumb) {
                return image;
            } else {
                image[0].photo.image_full = window.wpPayFormsAdmin.asset_url + 'images/form/' + file_name;
                image[0].photo.image_thumb = window.wpPayFormsAdmin.asset_url + 'images/form/' + file_name;
                return image;
            }
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        handleCommand(command) {
            let component = JSON.parse(JSON.stringify(command));
            component.id = this.getComponentUID(component.id);
            this.all_elements.splice(this.all_elements.length -1 , 0, component);
            this.getAddMoreComponent();
        },
        getComponentUID(componentName) {
            let counter = 1;
            let originalName = JSON.parse(JSON.stringify(componentName));
            while (this.elementIds.indexOf(componentName) != -1) {
                componentName = originalName + '_' + counter;
                counter = counter + 1;
            }
            return componentName;
        },
        getAddMoreComponent () {
            let componentType = ['choose_payment_method', 'donation_item'];
            let newComponent = []
            Object.keys(this.allComponents).map((item) => {
                let isComponentAllowedToAdd = componentType.indexOf(this.allComponents[item].type) > -1 === false &&
                    this.allComponents[item]?.quick_checkout_form;
                if (this.allComponents[item].type == 'currency_switcher') {
                    this.all_elements.forEach(element => {
                        if ('currency_switcher' === element.type) {
                            isComponentAllowedToAdd = false;
                        }
                    })
                }
                if(isComponentAllowedToAdd) {
                    this.allComponents[item].id = this.allComponents[item].type
                    newComponent.push(this.allComponents[item])
                }
            });
            this.allQuickCheckoutComponent = newComponent;
        },
        setModifiedElements() {
            this.modifiedElements = this.all_elements.map((item) => {
                const elementCopy = { ...item };
                const pricingDetails = elementCopy.field_options?.pricing_details || {};

                // Set default values if not present
                if (!pricingDetails.interval_label) {
                    this.$set(pricingDetails, 'interval_label', 'I would like to make a recurring donation');
                }
                if (!pricingDetails.interval_text) {
                    this.$set(pricingDetails, 'interval_text', 'Bill my every');
                }
                if (!pricingDetails.interval_display_type) {
                    this.$set(pricingDetails, 'interval_display_type', 'button');
                }
                if (elementCopy.type === 'donation_item') {
                    if (!elementCopy.field_options.enable_gift_aid) {
                        this.$set(elementCopy.field_options, 'enable_gift_aid', 'no');
                    }
                    if (!elementCopy.field_options.gift_aid_declaration) {
                        this.$set(elementCopy.field_options, 'gift_aid_declaration',
                            'I am a UK taxpayer and want this donation to qualify for Gift Aid. I understand that the charity will reclaim 25p for every £1 I donate and that I must have paid at least that amount in UK Income Tax and/or Capital Gains Tax during the tax year.');
                    }
                    if (elementCopy.field_options.gift_aid_title === undefined || elementCopy.field_options.gift_aid_title === null) {
                        this.$set(elementCopy.field_options, 'gift_aid_title', 'Boost your donation with Gift Aid');
                    }
                }
                return elementCopy;
            });
        },
    },
    mounted() {
        setTimeout(()=> {
            this.getAddMoreComponent();
        }, 2000)
    },
}
</script>

<style lang="scss" scoped>
.wpf-admin-header,
.wpf-admin-footer {
   height: 0px;
}
.wpf_interval_text_dropdown {
    width: fit-content !important; 
    margin-right: 4px; 
    border: none; 
    line-height: 20px; 
    box-sizing: border-box; 
    color: #2F3448; 
    font-size: 14px; 
    font-style: normal; 
    font-weight: 500;
}
.wpf-admin-aside {
    background-color: #eef1f5;
    color: #333;
    line-height: auto;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 14px;
    font-weight: 600;
    padding: 2%;
}

.wpf-admin-main {
    background-color: #f4f6f8;
    color: #333;
    text-align: left;
    padding: 2%;
    line-height: auto;
}
.settings {
    label {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 15px;
        margin-right: 0;

        span {
            display: flex;
            align-items: center;
        }
    }

    .icon {
        display: flex;
        align-items: center;
        gap: 4px;
    }
}

// Override el-form horizontal layout → vertical stacked to match design system
// ::v-deep required because FeeRecoveryComponent is a child component (scoped boundary)
.wpf-fee-recovery-quick-form {
    ::v-deep .wpf_inputs_new_ui {
        .el-form {
            .el-form-item {
                display: flex;
                flex-direction: column;
                margin-bottom: 16px;

                .el-form-item__label {
                    width: auto !important;
                    float: none;
                    text-align: left;
                    padding-bottom: 8px;
                    line-height: 1.4;
                    color: #2F3448;
                    font-size: 14px;
                    font-weight: 500;
                }

                .el-form-item__content {
                    margin-left: 0 !important;
                    line-height: 1.6;
                }
            }
        }

        // Gateway table — keep compact
        .wpf-fee-gateway-table {
            border: 1px solid #E4E7EC;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 10px;

            .wpf-fee-gateway-header {
                background: #F9FAFB;
                border-bottom: 1px solid #E4E7EC;
                padding: 10px 12px;
                font-size: 12px;
                font-weight: 600;
                color: #565865;
            }

            .wpf-fee-gateway-row {
                padding: 10px 12px;
                border-bottom: 1px solid #F2F4F7;

                &:last-child {
                    border-bottom: none;
                }
            }
        }

        // "Add More" link → match orange primary
        .wpf_add_item a {
            color: #F98435;
            font-size: 13px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            text-decoration: none;
            cursor: pointer;

            &.wpf-disabled {
                opacity: 0.4;
                pointer-events: none;
            }
        }

        // Help text
        .wpf-fee-help-text {
            font-size: 12px;
            color: #98A2B3;
            margin: 6px 0 0;
        }
    }
}
</style>