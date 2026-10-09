<template>
  <div>
    <div class="all_payforms_wrapper payform_section wpf_min_width">
      <!-- <div class="payform_section_header">
        <h3 class="payform_section_title">
          {{ $t("General Settings") }}
        </h3>
        <div class="payform_section_actions">
          <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
            type="primary">
            {{ $t("Save Settings") }}
          </el-button>
        </div>
      </div> -->
      <div v-loading="fetching" class="payform_section_body">
        <el-form rel="currency_settings" :label-position="labelPosition" :model="settings" label-width="220px">
          <div class="wpf_settings_section wpf_general_settings">
            <div class="sub_section_header">
              <p class="wpf_settings_section_inner_label">
                {{ $t("Currency Settings") }}
                <el-tooltip placement="top-start" effect="light">
                  <div slot="content">
                    <p>
                      {{ $t('This is the global currency setting, which can be overridden by individual form currencies.')}}
                    </p>
                  </div>
                  <i class="el-icon-info" type="primary"></i>
                </el-tooltip>
              </p>
            </div>
            <div class="sub_section_body">
              <el-row :gutter="10">
                <!-- <el-col :md="24" :lg="12">
                  <el-form-item label="Stripe Checkout Locale">
                    <el-select size="medium" filterable v-model="settings.locale"
                      placeholder="Select Stripe Checkout Language">
                      <el-option v-for="(locale_name, locale_key) in locales" :key="locale_key" :label="locale_name"
                        :value="locale_key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :md="24" :lg="12">
                  <el-form-item>
                    <p class="wpf_settings_section_inner_label">
                    {{ $t('Currency')}}
                      <el-tooltip placement="top-start" effect="light">
                        <div slot="content">
                          <p>
                            {{ $t('These currency settings apply exclusively to forms.')}}
                          </p>
                        </div>
                        <i class="el-icon-info" type="primary"></i>
                      </el-tooltip>
                    </p>
                    <el-select size="medium" filterable v-model="settings.currency" :placeholder="$t('Select Currency')">
                      <el-option v-for="(currencyName, currenyKey) in currencies" :key="currenyKey" :label="currencyName"
                        :value="currenyKey">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-form-item :label="$t('Currency Sign Position')">
                  <el-radio-group v-model="settings.currency_sign_position">
                    <el-radio class="el_radio_dashed_button" v-for="(sign, sign_key) in currency_sign_positions" :key="sign_key" :label="sign_key">{{ sign
                    }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('Currency Separators')">
                  <el-col :lg="12" :md="24">
                    <el-select class="item_full_width" size="medium" v-model="settings.currency_separator">
                      <el-option value="dot_comma" label="Comma as Thousand and Dot as Decimal (EG: 12,000.00)" />
                      <el-option value="comma_dot" label="Dot as Thousand and Comma as Decimal ( EG: 12.000,00 )" />
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="">
                  <el-checkbox :true-label="0" :false-label="2" v-model="settings.decimal_points">
                    {{ $t('Hide decimal points for rounded numbers')}}
                  </el-checkbox>
                </el-form-item>
              </el-row>
              <!-- <el-row :gutter="10" v-if="has_pro">
                <el-col :lg="12" :md="24">
                  <p class="wpf_settings_section_inner_label">
                    Currency Conversion Api Key
                    <el-tooltip placement="top-start" effect="light">
                      <div slot="content">
                        <p>
                          Get api key from
                          <a href="https://app.currencyapi.com/" target="_blank">
                            Currencyapi
                          </a>
                          in case you want to use currency switcher in your
                          form.
                        </p>
                      </div>
                      <i class="el-icon-info" type="primary"></i>
                    </el-tooltip>
                  </p>
                  <el-input type="text" size="medium" v-model="settings.currency_conversion_api_key"
                    placeholder="Api key..." />
                  <p>
                    See our
                    <a href="https://paymattic.com/docs/add-currency-switcher-in-wordpress-form/" target="_blank">
                      documentation
                    </a>
                    on how to get Api Key from
                    <a href="https://app.currencyapi.com/" target="_blank">
                      currencyapi.com</a>
                  </p>
                </el-col>
                <el-col :lg="6" :md="12">
                  <p class="wpf_settings_section_inner_label">
                    Caching Interval
                    <el-tooltip placement="top-start" effect="light">
                      <div slot="content">
                        <p>
                          Set an Caching Interval for updating the currency
                          rates. <br />
                          Higher Caching interval will reduces the amount API
                          request. <br />
                          300 Request is free per month.
                        </p>
                      </div>
                      <i class="el-icon-info" type="primary"></i>
                    </el-tooltip>
                  </p>
                  <el-select class="item_full_width" size="medium" v-model="settings.currency_rate_caching_interval">
                    <el-option value="0" label="No caching" />
                    <el-option value="2" label="2 Hours" />
                    <el-option value="4" label="4 Hours" />
                    <el-option value="6" label="6 Hours" />
                    <el-option value="12" label="12 Hours" />
                    <el-option value="24" label="24 Hours(Recommended)" />
                  </el-select>
                </el-col>
              </el-row> -->
              <!-- <el-form-item label="Currency Sign Position">
                <el-radio-group v-model="settings.currency_sign_position">
                  <el-radio v-for="(sign, sign_key) in currency_sign_positions" :key="sign_key" :label="sign_key">{{ sign
                  }}
                  </el-radio>
                </el-radio-group>
              </el-form-item> -->
              <!-- <el-form-item label="Currency Separators">
                <el-col :lg="12" :md="24">
                  <el-select class="item_full_width" size="medium" v-model="settings.currency_separator">
                    <el-option value="dot_comma" label="Comma as Thousand and Dot as Decimal (EG: 12,000.00)" />
                    <el-option value="comma_dot" label="Dot as Thousand and Comma as Decimal ( EG: 12.000,00 )" />
                  </el-select>
                </el-col>
              </el-form-item> -->
              <!-- <el-form-item label="">
                <el-checkbox :true-label="0" :false-label="2" v-model="settings.decimal_points">Hide decimal points for
                  rounded numbers</el-checkbox>
              </el-form-item> -->
              <!-- <el-form-item label="Submission Abandoned After ">
                <el-col :lg="12" :md="24">
                  <el-input type="number" size="medium" v-model="abandoned_time">
                    <template slot="append"> Hours </template>
                  </el-input>
                </el-col>
              </el-form-item> -->
            </div>
          </div>

          <div class="wpf_currency_switcher_settings">
            <div class="wpf_currency_switcher_heading">
              <span>{{ $t('Currency Switcher Settings') }}</span>
              <Icon icon="wpf-upgrade" />
            </div>
            <div class="wpf_currency_switcher_body">
              <div v-if="!has_pro" style="padding-top: 15px; margin-bottom: 5px;">
                <UpgradeNotice :title="$t('Currency Switcher is a pro feature.')" />
              </div>
              <el-row :gutter="10" :class="{ 'disabled_content': !has_pro }">
                  <el-col :lg="12" :md="24">
                    <p class="wpf_settings_section_inner_label">
                      {{ $t('Currency Conversion Api Key')}}
                      <el-tooltip placement="top-start" effect="light">
                        <div slot="content">
                          <p>
                            {{ $t('Get api key from')}}
                            <a href="https://app.currencyapi.com/" target="_blank">
                              Currencyapi
                            </a>
                            {{ $t('in case you want to use currency switcher in your form.')}}
                          </p>
                        </div>
                        <i class="el-icon-info" type="primary"></i>
                      </el-tooltip>
                    </p>
                    <el-input type="text" size="medium" v-model="settings.currency_conversion_api_key"
                      placeholder="Api key..." />
                    <p>
                      {{ $t('See our')}}
                      <a href="https://paymattic.com/docs/add-currency-switcher-in-wordpress-form/" target="_blank">
                        {{ $t('documentation')}}
                      </a>
                      {{ $t('on how to get Api Key from')}}
                      <a href="https://app.currencyapi.com/" target="_blank">
                        currencyapi.com</a>
                    </p>
                  </el-col>
                  <el-col :lg="12" :md="12">
                    <p class="wpf_settings_section_inner_label">
                      Caching Interval
                      <el-tooltip placement="top-start" effect="light">
                        <div slot="content">
                          <p>
                            {{ $t('Set an Caching Interval for updating the currency rates.')}} <br />
                            {{ $t('Higher Caching interval will reduces the amount API request.')}} <br />
                            {{ $t('300 Request is free per month.')}}
                          </p>
                        </div>
                        <i class="el-icon-info" type="primary"></i>
                      </el-tooltip>
                    </p>
                    <el-select class="item_full_width" size="medium" v-model="settings.currency_rate_caching_interval">
                      <el-option value="0" label="No caching" />
                      <el-option value="2" label="2 Hours" />
                      <el-option value="4" label="4 Hours" />
                      <el-option value="6" label="6 Hours" />
                      <el-option value="12" label="12 Hours" />
                      <el-option value="24" label="24 Hours(Recommended)" />
                    </el-select>
                  </el-col>
              </el-row>
            </div>
          </div>

          <div class="wpf_settings_section wpf_expiration_time">
            <div class="wpf_expiration_time_header">
              <div class="wpf_expiration_time_label">{{ $t("Payment Expiration Time (In Minutes or Days)") }}
                <el-tooltip placement="top-start" effect="light">
                  <div slot="content">
                    <p>
                      {{ $t('Set a time limit for pending payments. If not completed, the payment fails. (3 to 40 minutes or 1 to 30 days)') }}
                    </p>
                  </div>
                  <i class="el-icon-info" type="primary"></i>
                </el-tooltip>
              </div>
              <div class="wpf_expiration_time_switch">
                <el-switch 
                  v-model="settings.expiration_time_enabled" 
                  active-color="#ff9000" 
                  inactive-color="#dcdcdc"
                  >
                </el-switch>
              </div>
            </div>
            
            <!-- Conditional rendering: Only show input when expiration_time_enabled is true -->
            <div class="sub_section_body">
              <!-- // radio option for day or time  -->
              <el-form-item label="Expiration Time Type" style="padding-bottom: 15px;">
                <el-radio-group v-model="settings.expiration_time_type" @change="handleExpirationTimeTypeChange" :disabled="!settings.expiration_time_enabled">
                  <el-radio class="el_radio_dashed_button" label="minutes">{{ $t('Minutes') }}</el-radio>
                  <el-radio class="el_radio_dashed_button" label="days">{{ $t('Days') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="settings.expiration_time_type === 'minutes'">
                <el-input-number 
                  :disabled="!settings.expiration_time_enabled"
                  v-model="settings.expiration_time"  
                  @input="onNumberInput"
                  :min="3"
                  :max="40"
                  placeholder="Minutes"
                  style="width: 200px;">
                </el-input-number>
                <span style="margin-left: 10px; color: #666; font-size: 12px;">
                  {{ $t('minutes') }}
                </span>
              </el-form-item>
              <el-form-item v-if="settings.expiration_time_type === 'days'">
                <el-input-number 
                  :disabled="!settings.expiration_time_enabled"
                  v-model="settings.expiration_time"  
                  :min="1"
                  :max="30"
                  placeholder="Days"
                  style="width: 200px;">
                </el-input-number>
                <span style="margin-left: 10px; color: #666; font-size: 12px;">
                  {{ $t('days') }}
                </span>
              </el-form-item>
            </div>
          </div>

          <div class="wpf_settings_section wpf_general_settings">
            <div class="sub_section_header">
              <span>{{ $t("Honeypot Security") }}</span>
            </div>
            <div class="sub_section_body">
              <el-form-item>
                <el-switch active-color="#ff9000" active-value="yes" inactive-value="no"
                  v-model="honeypot_status"></el-switch>
                  <span class="wpf_honeypot_security_label">{{ $t('Enable Honeypot Security')}}</span>
                  <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                      <h3>{{ $t('Honeypot Security')}}</h3>
                      <p>
                        {{ $t('If you enable this then Paymattic will verify honeypot security. Most of the time, bots will fail this test.') }}
                      </p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                  </el-tooltip>
              </el-form-item>
            </div>
          </div>
          <div class="wpf_settings_section wpf_general_settings">
            <div class="sub_section_header">
              <span>{{ $t("Other Settings") }}</span>
            </div>
            <div class="sub_section_body">
              <el-row :gutter="10">
                <el-col :md="24" :lg="12">
                  <el-form-item :label="$t('Stripe Checkout Locale')">
                    <el-select size="medium" filterable v-model="settings.locale"
                      :placeholder="$t('Select Stripe Checkout Language')">
                      <el-option v-for="(locale_name, locale_key) in locales" :key="locale_key" :label="locale_name"
                        :value="locale_key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :md="24" :lg="12">
                  <el-form-item :label="$t('Submission Abandoned After')">
                    <el-input class="wpf_settings_submission_abandoned" type="number" size="medium" v-model="abandoned_time">
                      <template slot="append"> Hours </template>
                    </el-input> 
                  </el-form-item>
              </el-col>
              <el-col :md="24">
                <el-form-item>
                  <el-checkbox true-label="no" false-label="yes" v-model="ip_logging_status">
                    {{ $t('Disable IP Address Logging (If you check this then advanced analytics can not be performed)') }}
                  </el-checkbox>
                </el-form-item>
              </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
        <div class="action_right">
          <el-button @click="saveSettings()" type="primary" size="medium" class="wpf_new_ui_button">{{ $t("Save Settings")
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import ImageRadioBtn from "../Common/ImageRadioBtn.vue";
import Icon from '../Icons/Index.vue';
import UpgradeNotice from "../Common/UpgradeNotice.vue";
export default {
  name: "global_currency_settings",
  components: {
    ImageRadioBtn,
    UpgradeNotice,
    Icon
  },
  data() {
    return {
      settings: {
        expiration_time_enabled: false,
        expiration_time: null,
        expiration_time_type: 'minutes',
      },
      fetching: false,
      saving: false,
      currencies: {},
      locales: {},
      labelPosition: "top",
      paymentForms: [],
      hasForms: false,
      templateData: [
        {
          image: 'http://loremflickr.com/620/440/london',
          value: 1,
        },
        {
          image: 'http://loremflickr.com/620/440/london',
          value: 2,
        },
        {
          image: 'http://loremflickr.com/620/440/london',
          value: 3,
        }
      ],
      donation_leaderboard_settings: {
        enable_donation_for: "disable",
        enable_donation_for_specific: [],
        per_page: 20,
        template_id: 3,
        show_name: true,
        show_total: true,
        show_avatar: true,
        orderBy: '',
      },
      currency_sign_positions: {
        left: "Left ($100)",
        right: "Right (100$)",
        left_space: "Left Space ($ 100)",
        right_space: "Right Space 100 $",
      },
      currency_conversion_api_key: "",
      currency_rate_caching_interval: "",
      ip_logging_status: "yes",
      honeypot_status: "no",
      abandoned_time: null,
      has_pro: window.wpPayFormsAdmin.has_pro,
    };
  },
  methods: {
    getSettings() {
      this.fetching = true;
      // GlobalSettingsController@currencies'
      this.$get(`forms/settings/currencies`, {})
        .then((response) => {
          this.settings = response.currency_settings;
          this.currencies = response.currencies;
          this.locales = response.locales;
          this.ip_logging_status = response.ip_logging_status;
          this.honeypot_status = response.honeypot_status;
          this.abandoned_time = response.abandoned_time;
          this.donation_leaderboard_settings =
            response.wppayform_donation_leaderboard_settings;
        })
        .fail((error) => {
          this.$notify.error({
            title: "Oops!",
            message: error.responseJSON.message,
            position: "bottom-right",
          });
        })
        .always(() => {
          this.fetching = false;
        });
    },
    saveSettings() {
      if (!this.has_pro){
        this.settings.currency_conversion_api_key = '';
        this.settings.currency_rate_caching_interval = '';
      }
      this.saving = true;
      // GlobalSettingsController@saveCurrencies
      this.$post(`forms/settings/currencies`, {
        settings: this.settings,
        ip_logging_status: this.ip_logging_status,
        honeypot_status: this.honeypot_status,
        abandoned_time: this.abandoned_time,
        currency_conversion_api_key: this.currency_conversion_api_key,
        currency_rate_caching_interval: this.currency_rate_caching_interval,
        donation_leaderboard_settings: this.donation_leaderboard_settings,
      })
        .then((response) => {
          this.$notify.success({
            title: "Success!",
            message: response.message,
            position: "bottom-right",
          });
        })
        .fail((error) => {
          this.$notify.error({
            title: "Oops!",
            message: error.responseJSON.message,
            position: "bottom-right",
          });
        })
        .always(() => {
          this.saving = false;
        });
    },
    updateModal(val) {
      this.donation_leaderboard_settings.template_id = val;
    },
    fetchForms() {
      // FormsController@index
      this.$get("forms", { per_page: 10000 })
        .then((response) => {
          this.paymentForms = response.forms;
          this.hasForms = !!response.total;
        })
        .fail((error) => {
          this.$showAjaxError(error);
        })
        .always(() => {
          this.loading = false;
        });
    },
    onNumberInput(value) {
      if (isNaN(value) || value < 3) {
        this.settings.expiration_time = 3;
      }
    },
    handleExpirationTimeTypeChange(val) {
      if (val === 'minutes') {
        this.settings.expiration_time = 3;
      } else {
        this.settings.expiration_time = 1;
      }
    }
  },
  mounted() {
    this.getSettings();
    this.fetchForms();
    window.WPPayFormsBus.$emit("site_title", "General Settings");
    if (window.outerWidth < 500) {
      this.labelPosition = "top";
    }
  },
};
</script>

<style lang="scss" scoped>
// .wpf_content_wrapper_v2 .active {
//   color: #525050 !important;
// }

.wpf_content_wrapper_v2 .wppayform_sidebar_list_v2 .active img {
  filter: hue-rotate(152deg) saturate(120%);
}

.el-switch {
  width: 38px !important;
}

.select_donation_form {
  min-width: 538px;

  .el-select__tags {
    input {
      border: none !important;
      background: transparent !important;
    }
  }
}

.wpf_leaderboard_options {

  // display: flex;
  .el-form-item__label {
    font-weight: 600;
  }
}

.sub_section_header {
  h3 {
    margin: 0px;
  }
}
</style>