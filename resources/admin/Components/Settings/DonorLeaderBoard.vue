<template>
  <div>
    <div class="all_payforms_wrapper payform_section wpf_min_width leaderboard_wrapper">
      <AppCard>

        <template slot="header">
          <div class="settings_header">
            <div class="title">
              <h3 class="payform_section_title" style="display: flex;gap: 10px;">
                {{ $t("Donation Leaderboard Settings") }}
                <Icon icon="wpf-upgrade" />
              </h3>
              <p class="payform_section_sub_title">
                  {{ $t('Use this shortcode to configure donation leaderboard') }}
                  <a target="_blank"
                    href="https://paymattic.com/docs/how-to-add-donation-leaderboard-in-wordpress-with-paymattic/">{{
                      $t("See our documentation") }}</a>
                </p>
            </div>
            <code v-if="form_id" :class="{ 'disabled_content': !hasPro }"  class="copy" :data-clipboard-text='`[wppayform_leaderboard form_id="${form_id}"]`'>
              <Icon icon="wpf-copy" /> [wppayform_leaderboard form_id="{{form_id}}"]
            </code>
            <code v-else :class="{ 'disabled_content': !hasPro }"  class="copy" :data-clipboard-text='`[wppayform_leaderboard]`'>
              <Icon icon="wpf-copy" /> [wppayform_leaderboard]
            </code>
          </div>
        </template>

        <template slot="body">
          <div v-loading="fetching" class="payform_section_body">
            <UpgradeNotice v-if="!hasPro" :title="$t('Donor leaderboard is a pro feature.')" style="margin-bottom: 15px;" />
            <el-form :class="{ 'disabled_content': !hasPro }" rel="currency_settings" :label-position="labelPosition" :model="settings" label-width="220px">
              <div class="wpf_settings_section">
                <div class="sub_section_body">
                  <el-form-item class="wpf_leaderboard_options">
                    <el-form-item class="image-template">
                      <div class="sub_section_header">
                        <h3 class="template-header">{{ $t("Choose Template") }}</h3>
                      </div>
                      <div>
                        <ImageRadioBtn v-if="!fetching" :btnData="templateData" @updateModal="updateModal"
                          :value="donation_leaderboard_settings.template_id" />
                      </div>
                    </el-form-item>
                  </el-form-item>

                  <el-form-item class="wpf_leaderboard_options">
                    <template slot="label">
                      <h3 class="template-header">{{ $t("Visibility Of Donation Leaderboard") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                          <div slot="content">
                            <!-- <h3>{{ $t('Donation Leaderboard') }}</h3> -->
                            <p>
                              {{ $t('Paymattic will display the donation leaderboard unless it is disabled.') }}
                            </p>
                          </div>
                          <i class="el-icon-info" type="primary"></i>
                        </el-tooltip>
                      </h3>
                    </template>
                    <!-- Display the radio buttons for enabling the global donation leaderboard -->
                    <div v-if="form_id == 0">
                      <el-radio class="el_radio_dashed_button" v-model="donation_leaderboard_settings.enable_donation_for" label="Disable">
                        {{ $t("Disable") }}</el-radio>
                      <el-radio class="el_radio_dashed_button" v-model="donation_leaderboard_settings.enable_donation_for" label="all">
                        {{ $t("For all form") }}
                      </el-radio>
                      <el-radio class="el_radio_dashed_button" v-model="donation_leaderboard_settings.enable_donation_for" label="specific">
                        {{ $t("For specific form") }}
                      </el-radio>
                    </div>
                    <div v-else>
                      <!-- Enable/disable donation leaderboard mange for specific form -->
                      <el-switch v-model="donation_leaderboard_settings.enable_donation_for"
                        active-value="for_single_form" inactive-value="Disable"></el-switch>
                    </div>
                  </el-form-item>

                  <el-form-item class="wpf_leaderboard_options"
                    v-if="donation_leaderboard_settings.enable_donation_for == 'specific'">
                    <template slot="label">
                      {{ $t('Select Form') }}
                      <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                          <h3>{{ $t('Select Form') }}</h3>
                          <p>
                            {{ $t('Select form for which you want to enable donation leaderboard.') }}
                          </p>
                        </div>
                        <i class="el-icon-info" type="primary"></i>
                      </el-tooltip>
                    </template>
                    <el-select class="select_donation_form"
                      v-model="donation_leaderboard_settings.enable_donation_for_specific" multiple filterable
                      placeholder="Select Form ID">
                      <el-option v-for="item in paymentForms" :key="item.ID" :label="item.post_title" :value="item.ID">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item class="wpf_leaderboard_options">
                    <div class="sub_section_header">
                      <h3>{{ $t("Please select number of donor per page") }}</h3>
                    </div>

                    <el-select style="width: 444px; margin-top: 10px;" v-model="donation_leaderboard_settings.per_page" :placeholder="$t('Please select page')">
                      <el-option label="0" value="0"></el-option>
                      <el-option label="10" value="10"></el-option>
                      <el-option label="20" value="20"></el-option>
                      <el-option label="30" value="30"></el-option>
                      <el-option label="40" value="40"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item class="wpf_leaderboard_options">
                    <div style="margin-bottom: 10px;" class="sub_section_header">
                      <h3>{{ $t("Initial Raised Amount") }}</h3>
                    </div>
                    <el-input style="width: 444px;" :placeholder="$t('Please input the initial raised amount')"
                      v-model="donation_leaderboard_settings.initial_raised_amount" clearable>
                    </el-input>
                  </el-form-item>

                  <el-form-item class="wpf_leaderboard_options">
                    <div class="sub_section_header">
                      <h3>{{ $t("Other Settings") }}</h3>
                    </div>
                    <div class="other_settings">
                      <el-checkbox inactive-value="false" active-value="true"
                        v-model="donation_leaderboard_settings.show_total">
                        {{ $t('Display total collected donation amount') }}
                      </el-checkbox>
                      <el-checkbox inactive-value="false" active-value="true"
                        v-model="donation_leaderboard_settings.show_name">
                        {{ $t('Display donor name') }}
                      </el-checkbox>
                      <el-checkbox inactive-value="false" active-value="true"
                        v-model="donation_leaderboard_settings.show_avatar">
                        {{ $t('Display donor avatar') }}
                      </el-checkbox>
                    </div>
                  </el-form-item>

                  <el-form-item class="wpf_leaderboard_options">
                    <div class="sub_section_header" style="margin-bottom: 10px;">
                      <h3>{{ $t("Donor list display order") }}</h3>
                    </div>
                    <el-radio class="el_radio_dashed_button" v-model="donation_leaderboard_settings.orderBy" label="grand_total">
                      {{ $t('Top Donor first')}}
                    </el-radio>
                    <el-radio class="el_radio_dashed_button" v-model="donation_leaderboard_settings.orderBy" label="created_at">
                      {{ $t('Newest first')}}
                    </el-radio>
                  </el-form-item>

                  <el-form-item v-if="form_id" class="wpf_leaderboard_options">
                    <div class="sub_section_header" style="margin-bottom: 10px;">
                      <h3>{{ $t("Donation Progress Bar Shortcode") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                          <div slot="content">
                            <p>
                              {{ $t('To view detailed fundraising progress:') }}
                              <ol>  
                                  <li>{{ $t('Go to Donation Progress Item settings')}}</li>  
                                  <li>{{ $t('Enable "Statistic"')}}</li>  
                                  <li>{{ $t('Enable "Progress Bar"')}}</li>  
                              </ol>  
                            </p>
                          </div>
                          <i class="el-icon-info" type="primary"></i>
                        </el-tooltip>
                      </h3>
                    </div>
                    <code v-if="form_id" :class="{ 'disabled_content': !hasPro }"  class="copy" :data-clipboard-text='`[wppayform_leaderboard form_id="${form_id}"]`'>
                      <Icon icon="wpf-copy" /> [wppayform_leaderboard form_id="{{form_id}}"]
                    </code>
                    <p>{{ $t('To disable fundraising progress stats, turn off "Statistic and Progress Bar" in the Donation Progress settings.')}}</p>
                  </el-form-item>

                </div>
              </div>
            </el-form>

            <div :class="{ 'disabled_content': !hasPro }" class="payform_section_actions" style="float: right;">
              <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                type="primary">
                {{ $t("Save Settings") }}
              </el-button>
            </div>
          </div>
        </template>
      </AppCard>
    </div>
    <div>
      <!-- <AppCard>
        <template slot="header">
          <h3 class="payform_section_title">{{ $t("Donation Leaderboard Settings") }}</h3>
        </template>
        <template slot="body">
          <UpgradeNotice :title="$t('Donor leaderboard is a pro feature.')" />
        </template>
      </AppCard> -->
    </div>
  </div>
</template>

<script>
import ImageRadioBtn from "../Common/ImageRadioBtn.vue";
import UpgradeNotice from "../Common/UpgradeNotice.vue";
import AppCard from "../Common/AppCard.vue";
import Clipboard from 'clipboard';
import Icon from '../Icons/Index.vue';

export default {
  name: "Donor_leaderboard_settings",
  components: {
    ImageRadioBtn,
    UpgradeNotice,
    AppCard,
    Icon
  },
  props: {
    form_id: {
      type: [Number, String],
      default: 0,
    },
  },

  data() {
    return {
      settings: {},
      fetching: false,
      saving: false,
      currencies: {},
      locales: {},
      labelPosition: "top",
      paymentForms: [],
      hasForms: false,
      hasPro: window.wpPayFormsAdmin.has_pro,
      templateData: [
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
        initial_raised_amount: 0
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
      this.$get(`forms/settings/donor-leaderboard`, {
        form_id: this.form_id,
      })
        .then((response) => {
          console.log('response.settings = ', response.settings);
          this.donation_leaderboard_settings = response.settings;
          this.paymentForms = response.forms;
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
      if(!this.has_pro) {
        return;
      }
      this.saving = true;
      // GlobalSettingsController@saveDonationLeaderboardSettings
      if (this.form_id != 0) {
        this.donation_leaderboard_settings.form_id = this.form_id;
      }
      this.$post(`forms/settings/donor-leaderboard`, {
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
  },
  mounted() {
    this.getSettings();
    window.WPPayFormsBus.$emit("site_title", "General Settings");
    if (window.outerWidth < 500) {
      this.labelPosition = "top";
    }
    if (!window.wpf_clip_inited) {
      var clipboard = new Clipboard('.copy');
      clipboard.on('success', (e) => {
        this.$message({
          offset: 39,
          message: 'Copied to Clipboard!',
          type: 'success'
        });
      });
      window.wpf_clip_inited = true;
    }
  },
};
</script>

<style lang="scss" scoped>
// .wpf_content_wrapper_v2 .active {
//   color: #525050 !important;
// }

// .wpf_content_wrapper_v2 .wppayform_sidebar_list_v2 .active img {
//   filter: hue-rotate(152deg) saturate(120%);
// }

// .el-switch {
//   width: 38px !important;
// }

// .select_donation_form {
//   min-width: 538px;

//   .el-select__tags {
//     input {
//       border: none !important;
//       background: transparent !important;
//     }
//   }
// }

// .wpf_leaderboard_options {

//   border-bottom: 1px solid #80808021;
//   padding-bottom: 19px;

//   // display: flex;
//   .el-form-item__label {
//     font-weight: 600;
//   }

//   .wpf-leaderboard-form-header {
//     margin: 0;
//   }
// }

// .wpf_leaderboard_options:last-child {
//   border: none;
// }

// .sub_section_header {
//   h3 {
//     margin: 0px;
//   }

//   .template-header {
//     padding-top: 19px;
//   }
// }
</style>