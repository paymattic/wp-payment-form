<template>
  <div class="element_editor">
    <div class="wpf_editor_tabs">
      <div class="wpf_tabs_header">
        <div
          @click="showing_tab = 'general'"
          :class="showing_tab == 'general' ? 'wpf_tab_active' : ''"
          class="wpf_tab general_tab"
        >
          General
        </div>
        <div
          @click="showing_tab = 'advanced'"
          :class="showing_tab == 'advanced' ? 'wpf_tab_active' : ''"
          class="wpf_tab"
        >
          Advanced
        </div>
        <div
          style="
            float: right;
            margin-top: 15px;
            margin-right: 20px;
            display: flex;
          "
        >
          <div v-if="element.postion_group !== 'payment_method'" style="font-size: 14px; align-items: center;">
            <span style="margin-right: 10px; white-space: nowrap;">Disable Field</span>
            <el-switch
              v-model="element.field_options.disable"
              :active-value="true"
              :inactive-value="false"
            >
            </el-switch>
          </div>
        </div>
      </div>
      <div class="wpf_tab_body">
        <el-form
          :disabled="element.field_options.disable"
          ref="element_form"
          :class="'wpf_element_editor_form wpf_showing_' + showing_tab"
          :model="element"
        >
          <div
            v-for="(item, itemName) in element.editor_elements"
            :class="[item.wrapper_class, 'wpf_item_group_' + item.group]"
            class="editor_form_item" :key="itemName"
          >
          <div v-if="isValidComponent(itemName, element.type)">
            <template v-if="checkValidTextItem(item, element)">
              <el-form-item :label="item.label">
                <template v-if="itemName == 'default_value'">
                  <default-value-component
                    @showProMessage="
                      () => {
                        showDevaultValuePro = true;
                      }
                    "
                    :item="item"
                    :element="element"
                    :itemName="itemName"
                  />
                </template>
                
                <template v-else-if="itemName == 'default_payment_method'">
                </template>
                <template v-else>
                  <el-input
                    class="input_customize"
                    :placeholder="item.label"
                    size="mini"
                    v-model="element.field_options[itemName]"
                  ></el-input>
                </template>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'number'">
              <el-form-item :label="item.label">
                <el-input-number
                  :placeholder="item.label"
                  size="mini"
                  v-model="element.field_options[itemName]"
                  :min="item.min"
                  :max="item.max"
                ></el-input-number>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'numeric_calculation'">
              <NumericCalculation   
                  :element="element"  
                  :item="{ label: 'Enable Calculation' }" 
                  :all_elements="all_elements"
              />
            </template>
            <template v-else-if="item.type == 'numeric_serverside_validation' && element.field_options.numeric_calculation === 'yes'">
              <el-form-item :label="item.label">
                <el-switch
                  v-model="element.field_options[itemName]"
                  active-value="yes"
                  inactive-value="no"
                >
                </el-switch>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'choice_limit'">
              <el-form-item :label="item.label">
                <el-input-number
                  :placeholder="item.label"
                  size="mini"
                  v-model="element.field_options[itemName]"
                  :min="0"
                  :max="element.field_options.options.length"
                ></el-input-number>
                <el-tooltip
                  v-if="item.info"
                  :content="item.info"
                  placement="top"
                  effect="dark"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'textarea'">
              <el-form-item :label="item.label">
                <el-input
                  class="input_customize"
                  type="textarea"
                  :placeholder="item.label"
                  size="mini"
                  v-model="element.field_options[itemName]"
                  :blur="$emit('log_history', all_elements)"
                ></el-input>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'checkbox'">
              <el-form-item :label="item.label">
                <el-checkbox-group v-model="element.field_options[itemName]">
                  <el-checkbox class="el-checkbox"
                    v-for="(option, optionName) in item.options"
                    :label="optionName"
                    :key="optionName"
                    >{{ option }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'switch'">
              <el-form-item :label="item.label">
                <el-switch
                  v-model="element.field_options[itemName]"
                  active-value="yes"
                  inactive-value="no"
                >
                </el-switch>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type === 'switch'">
              <el-form-item :label="item.label">
                <el-switch
                  v-model="element.field_options[itemName]"
                  active-value="yes"
                  inactive-value="no"
                >
                </el-switch>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'key_pair'">
              <el-form-item class="key_pair_field_customize" :label="item.label">
                <key-pair-options
                  :value.sync="element.field_options[itemName]"
                />
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'currency_pair'">
                <currency-pair-options
                  :element="element"
                  :item="item"
                  :value.sync="element.field_options[itemName]"
                  :currency_list="item.currency_list"
                />
      
            </template>
            <template v-else-if="item.type == 'html'">
              <el-form-item :label="item.label">
                <wp-editor v-model="element.field_options[itemName]" />
                <div
                  v-if="item.info"
                  class="html_placeholder_instruction"
                  v-html="item.info"
                  style="word-break: break-word !important;"
                ></div>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'payment_options'">
              <payment-options-settings
                :item="item"
                :pricing_details="element.field_options.pricing_details"
                :enableImage="element.field_options.enable_image"
              />
            </template>
            <template v-else-if="item.type == 'conditional_render'">
              <conditional-render-settings
                :item="item"
                :condition_options="getConditionalDefaultValue(element)"
                :all_elements="all_elements"
                :current_item="element.id"
              />
            </template>
            <template v-else-if="item.type == 'donation_options'">
              <donation-options-settings
                :item="item"
                :pricing_details="element.field_options.pricing_details"
                :enableImage="element.field_options.enable_image"
                :element="element"
              />
            </template>
            <template v-else-if="item.type == 'fee_recovery_settings'">
              <fee-recovery-component
                :element="element"
                :item="item"
              />
            </template>
            <template v-else-if="item.type == 'product_selector'">
              <el-form-item :label="item.label">
                <item-selector
                  :all_elements="all_elements"
                  :item_name="itemName"
                  :field_options="element.field_options"
                />
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'onetime_products_selector'">
              <el-form-item :label="item.label">
                <one-time-products-selector
                  :all_elements="all_elements"
                  :item_name="itemName"
                  :field_options="element.field_options"
                />
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'all_product_selector'">
              <el-form-item :label="item.label">
                <all-item-selector
                  :all_elements="all_elements"
                  :item_name="itemName"
                  :field_options="element.field_options"
                />
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'select_option'">
              <el-form-item :label="item.label">
                <el-select
                  :allow-create="item.creatable == 'yes'"
                  filterable
                  default-first-option
                  class="item_full_width input_customize"
                  size="small"
                  v-model="element.field_options[itemName]"
                >
                  <el-option
                    v-for="(option_name, option_key) in item.options"
                    :key="option_key"
                    :label="option_name"
                    :value="option_key"
                  ></el-option>
                </el-select>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'column_select_option' && element.field_options.horizontal === 'yes'">
              <el-form-item :label="item.label">
                <el-select
                  :allow-create="item.creatable == 'yes'"
                  filterable
                  default-first-option
                  class="item_full_width input_customize"
                  size="small"
                  v-model="element.field_options[itemName]"
                >
                  <el-option
                    v-for="(option_name, option_key) in item.options"
                    :key="option_key"
                    :label="option_name"
                    :value="option_key"
                  ></el-option>
                </el-select>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'custom_date_config'">
               <el-form-item :label="item.label" class="wpf_code_editor">
                <el-input
                  type="textarea"
                  class="input_customize"
                  :rows="8"
                  :placeholder="item.label"
                  size="mini"
                  v-model="element.field_options[itemName]"
                  :blur="$emit('log_history', all_elements)"
                  style="backgorund-color: #5c5c5c"
                ></el-input>
                <el-tooltip class="item" placement="top-start" effect="light">
                        <div slot="content">
                           <p>
                            {{ item.tips }}
                           </p>
                        </div>
                        <i class="el-icon-info" />
                    </el-tooltip>
                <p class="custom_param" v-if="item.info" v-html="item.info"></p>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'radio_button'">
              <el-form-item :label="item.label">
                <el-radio-group
                  size="small"
                  v-model="element.field_options[itemName]"
                >
                  <el-radio-button
                    v-for="(option_name, option_key) in item.options"
                    :label="option_key"
                    :key="option_key"
                  >
                    {{ option_name }}
                  </el-radio-button>

                </el-radio-group>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'payment_item_radio' && element.field_options.pricing_details.one_time_type != 'single'">
              <el-form-item :label="item.label">
                <el-radio-group
                  size="small"
                  v-model="element.field_options[itemName]"
                >
                  <el-radio
                    v-for="(option_name, option_key) in item.options"
                    :label="option_key"
                    :key="option_key"
                  >
                    {{ option_name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'select_multi_tags'">
              <el-form-item
                v-if="element.field_options.active_list != 'all'"
                :label="item.label"
              >
                <el-select
                  filterable
                  :allow-create="item.creatable == 'yes'"
                  v-model="element.field_options[itemName]"
                  clearable
                  multiple
                  class="item_full_width input_customize el-fluid"
                >
                  <el-option
                    v-for="(option_name, option_key) in item.options"
                    :key="option_key"
                    :label="option_name"
                    :value="option_key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'checkout_display_options'">
              <checkout-display-option
                :item="item"
                :item_name="itemName"
                :checkout_settings="element.field_options[itemName]"
              ></checkout-display-option>
            </template>
            <template v-else-if="item.type == 'choose_payment_method'">
              <payment-method-choice
                :field_options="element.field_options"
                :item="item"
                :method_settings="element.field_options[itemName]"
              />
            </template>
            <template v-else-if="item.type == 'info_html'">
              <div v-html="item.info"></div>
            </template>
            <template v-else-if="item.type == 'tabular_products'">
              <tabular-products
                :item="item"
                :field_options="element.field_options"
                :product_settings="element.field_options[itemName]"
              >
              </tabular-products>
            </template>
            <template v-else-if="item.type == 'recurring_payment_options'">
              <recurring-item
                :item="item"
                :product_settings="element.field_options[itemName]"
              />
            </template>
            <template v-else-if="item.type == 'unique_email_switch'">
              <el-form-item :label="item.label">
                <el-switch
                  v-model="element.field_options[itemName]"
                  active-value="yes"
                  inactive-value="no"
                >
                </el-switch>
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <p v-if="item.info" v-html="item.info"></p>
                  </div>
                  <i class="el-icon-info" type="primary"></i>
                </el-tooltip>
                <!-- <p v-if="item.info" v-html="item.info"></p> -->
              </el-form-item>
              <el-form-item
                v-if="element.field_options[itemName] == 'yes'"
                label="Validation message"
              >
              <el-input
                  placeholder="Confirm Email Label"
                  size="mini"
                  v-model="element.field_options.unique_email_validation_message"
                  style="width: 76%;"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'confirm_email_switch'">
              <el-form-item :label="item.label">
                <el-switch
                  v-model="element.field_options[itemName]"
                  active-value="yes"
                  inactive-value="no"
                >
                </el-switch>
                <p v-if="item.info" v-html="item.info"></p>
              </el-form-item>
              <el-form-item
                v-if="element.field_options[itemName] == 'yes'"
                label="Confirm Email Label"
              >
                <el-input
                  placeholder="Confirm Email Label"
                  size="mini"
                  v-model="element.field_options.confirm_email_label"
                  style="width: 76%;"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="element.field_options[itemName] == 'yes'"
                label="Confirm Email Placeholder"
              >
                <el-input
                  placeholder="Confirm Email Placeholder"
                  size="mini"
                  v-model="element.field_options.confirm_email_placeholder"
                  style="width: 76%;"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'unique_email_validation_switch'">
              <el-form-item :label="item.label">
                <el-switch
                    v-model="element.field_options[itemName]"
                    :active-value="true"
                    :inactive-value="false"
                >
                </el-switch>
              </el-form-item>
              <el-form-item v-if="element.field_options[itemName]" label="Unique Validation message">
                 <el-input
                     placeholder="Unique Validation Message"
                     size="mini"
                     v-model="element.field_options.unique_validation_message"
                 >
                 </el-input>
              </el-form-item>
            </template>
            <template v-else-if="item.type == 'address_subfields'">
              <Address
                :fields="item.fields"
                :field_options="element.field_options[itemName]"
                @update:field_options="updateAddressFieldOptions"
                @field-deleted="handleAddressFieldDelete"
                @field-added="handleAddressFieldAdd"
              />
            </template>
            <template v-else-if="item.type == 'mask_input'">
              <MaskInput :item="item" :field_options="element.field_options" />
            </template>
          </div>
          </div>
          <el-form-item class="wpf_item_group_advanced" label="Field ID">
            {{ element.id }}
          </el-form-item>
        </el-form>
        <!-- <div class="action_left">
          <el-button @click="updateItem()"  type="primary" size="mini" class="wpf_new_ui_button"
            >Update</el-button
          >
        </div> -->
      </div>
    </div>

    <el-dialog
      title="Default Value is a Pro Feature"
      :visible.sync="showDevaultValuePro"
      :append-to-body="true"
      width="60%"
    >
      <div
        v-if="showDevaultValuePro"
        class="modal_body wpf_default_value_modal"
      >
        <img :src="assets_url + 'images/default_value_screen.png'" alt="" />
        <h3>
          Add Default Value from dynamic variables from WordPress / URL
          Parameter
        </h3>
        <a
          class="el-button el-button--success"
          target="_blank"
          rel="noopener"
          :href="pro_purchase_url"
          >Upgrade To Pro</a
        >
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import KeyPairOptions from "./Widget/KeyPairOption/_key_pair_options";
import CurrencyPairOptions from "./Donation/_currency_pair_options";
import PaymentOptionsSettings from "./PaymentItem/_PaymentOptions.vue";
import ConditionalRenderSettings from "./ConditionalComponent/_Conditional_render.vue";
import DonationOptionsSettings from "./Donation/_DonationOptions.vue";
import ItemSelector from "./_ProductSelector";
import OneTimeProductsSelector from "./_OnetimeProductsSelector";
import AllItemSelector from "./_AllProductSelector";
import CheckoutDisplayOption from "./ChoosePaymentMethod/_StripeCheckoutSettings.vue";
import PaymentMethodChoice from "./ChoosePaymentMethod/_payment_method_settings";
import TabularProducts from "./TabularProduct/_tabular_products";
import popover from "../../Common/input-popover-dropdown.vue";
import RecurringItem from "./PaymentItem/_RecurringItem";
import Address from "../../Common/Address";
import MaskInput from "../../Common/MaskInput";
import DefaultValueComponent from "./_DefaultValueComponent";
import WpEditor from "../../Common/_wp_editor";
import NumericCalculation from "./_numeric_calculation.vue";
import FeeRecoveryComponent from "./FeeRecovery/FeeRecoveryComponent.vue";

export default {
  name: "elementEditor",
  components: {
    KeyPairOptions,
    CurrencyPairOptions,
    PaymentOptionsSettings,
    DonationOptionsSettings,
    ItemSelector,
    CheckoutDisplayOption,
    PaymentMethodChoice,
    TabularProducts,
    popover,
    RecurringItem,
    AllItemSelector,
    OneTimeProductsSelector,
    Address,
    MaskInput,
    DefaultValueComponent,
    WpEditor,
    ConditionalRenderSettings,
    NumericCalculation,
    FeeRecoveryComponent
  },
  props: ["element", "all_elements"],
  comments: {
    KeyPairOptions,
  },
  data() {
    return {
      merge_tags: Object.values(window.wpPayFormsAdmin.value_placeholders),
      showDevaultValuePro: false,
      assets_url: window.wpPayFormsAdmin.assets_url,
      showing_tab: "general",
    };
  },

  methods: {
    deleteItem() {
      this.$emit("deleteItem", this.element);
    },
    checkValidTextItem(item, element) {
      if (item.type != "text") return false;
      if (element.type == 'tabular_products') {
        return this.showing_tab == 'advanced';
      }
      return true;
    },
    isValidComponent (itemName, elementType) {
      if(itemName === 'label' || itemName === 'placeholder' && elementType !== 'customer_name') {
        return false;
      }
      return true;
    },
    updateItem() {
      this.$emit("updateItem", this.element);
    },
    getConditionalDefaultValue (element) {
      if(element.field_options.conditional_logic_option) {
        return element.field_options.conditional_logic_option;
      } else {
        return element.field_options.conditional_logic_option = 
          {
            conditional_logic : 'no',
            conditional_type  : 'any',
            options : [{
              target_field : '',
              condition : '',
              value : '' 
            }],
          }
      }
    },
    initializeCheckboxValues() {
      // only work when type is customer_full_name and name_layout is checkbox
      if (this.element.type !== 'customer_full_name' || !this.element.field_options.name_layout.includes('checkbox')) {
        return;
      }
      for (const itemName in this.element.editor_elements[this.showing_tab]) {
        const item = this.element.editor_elements[this.showing_tab][itemName];
        if (item.type === 'checkbox') {
          // Check if the value is in object format
          const value = this.element.field_options[itemName];
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            // Convert from object format to array format
            const selectedValues = [];
            for (const key in value) {
              if (value[key] === true) {
                selectedValues.push(key);
              }
            }
            this.$set(this.element.field_options, itemName, selectedValues);
          } else if (!value) {
            // Initialize with empty array if not set
            this.$set(this.element.field_options, itemName, []);
          }
        }
      }
    },
    updateAddressFieldOptions(updatedOptions) {
      this.$set(this.element.field_options, 'subfields', updatedOptions);
      // this.$emit('updateItem', this.element);
      // this.$emit('log_history', this.all_elements);
    },

    handleAddressFieldDelete(deleteData) {
      const { deletedField, remainingFields } = deleteData

        // Update subfields with remaining fields
        const updatedSubfields = {}
        remainingFields.map(field => {
          updatedSubfields[field.id] = field
        })
        this.$set(this.element.field_options, 'subfields', updatedSubfields);
        // this.$emit('updateItem', this.element);
        // this.$emit('log_history', this.all_elements);
    },
    handleAddressFieldAdd(addData) {
      // Update element with new field
      this.$set(this.element.field_options.subfields, addData.fieldId, addData.field);
    }
  },

  mounted() {
    if (!this.element.field_options) {
      this.$set(this.element, "field_options", {});
    }
    
    // Initialize checkbox values if they're in object format, keep into method
    this.initializeCheckboxValues();


  },
};
</script>

<style scoped>
/* .wpf_content_wrapper_v2 .active{
  color: #525050 !important;
} */
.wpf_content_wrapper_v2 .wppayform_sidebar_list_v2 .active img {
  filter: hue-rotate(152deg) saturate(120%);
}
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;

  .el-checkbox {
	  padding: 3px 0px;

    .el-checkbox__label {
	    padding: 3px 0px 3px 8px;
    }
  }
}
.el-dialog__wrapper .el-dialog__footer  {
  padding: 12px 10px 10px 20px !important;
}

.wpf_code_editor textarea {
    background: #353535 !important;
    color: white !important;
}
</style>