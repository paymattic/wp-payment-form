<template>
  <div class="all_payforms_wrapper payform_section wpf_min_width">
    <app-card>
      <div slot="header">
        <h3 class="payform_section_title" style="">
          {{ $t("Dashboard Settings") }} <Icon icon="wpf-upgrade" />
        </h3>
      </div>

      <div slot="body" style="width: 100%">
        <UpgradeNotice v-if="!checkHasPro()" style="margin-bottom: 20px;"
          title="Paymattic User dashboard module is not enabled. Upgrade to Pro version to enable this feature." />
        <div :class="{ 'disabled_content': !checkHasPro() }">
          <div class="wpf_pre_settings_wrapper" v-if="!paymatticUserDashboardStatus">
            <h2>{{ $t('Paymattic User dashboard module') }}</h2>
            <p>
              {{ $t("Paymattic User dashboard module is not enabled. You can enable it from here.") }}
            </p>
            <el-button v-loading="loading" @click="enablePaymatticUserDashboard()" type="primary" size="large">
              {{ $t("Enable User dashboard module") }}
            </el-button>
          </div>
          <el-row v-else>
            <div v-loading="loading" class="wpf_ninja_content">
            <app-card class="sub-header">
              <div slot="header">
                <h2 class="header-title">{{ $t("Paymattic User Permission") }}</h2>
                <p class="header-sub-title">
                  {{ $t("Paymattic user dashboard is only accessible for Paymattic User roles. You can manage user capabilities also.") }}
                </p>
              </div>

              <div slot="body">
                <div v-for="(customUser, userIndex) in paymatticCustomUser " style="display: flex" :key="userIndex">
                  <CheckboxGroup class="user-roles" :paymatticCustomUser="paymatticCustomUser" :property="customUser"
                    :userIndex="userIndex" />
                </div>
              </div>
            </app-card>

            <app-card class="sub-header">
              <div slot="header">
                <h2 class="header-title">{{ $t("Submissions to Show") }}</h2>
                <p class="header-sub-title">
                  {{ $t("Choose which payment statuses to display in the user dashboard. Only submissions with selected statuses will be listed.") }}
                </p>
              </div>

              <div slot="body">
                <div class="submission-status-filter">
                  <el-radio-group v-model="submissionFilterMode">
                    <el-radio label="all">{{ $t("All statuses") }}</el-radio>
                    <el-radio label="selected">{{ $t("Selected statuses only") }}</el-radio>
                  </el-radio-group>
                  <div v-if="submissionFilterMode === 'selected'" class="status-checkboxes" style="margin-top: 20px;">
                    <el-checkbox-group v-model="submissionStatusFilter" style="display: flex; flex-wrap: wrap; gap: 10px;">
                      <el-checkbox
                        v-for="opt in submissionStatusOptions"
                        :key="opt.value"
                        :label="opt.value"
                        style="display: block; margin-bottom: 6px;">
                        {{ opt.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </app-card>

            <app-card class="sub-header">
              <div slot="header">
                <h2 class="header-title"> {{ $t("User Dashboard Page") }}</h2>
                <p class="header-sub-title">
                  {{ $t("The Paymattic Dashboard Page is the default, however you may change it by using [wppayform_dashboard] this Shortcode") }}
                </p>
              </div>

              <div slot="body">
                <div class="choose-page">
                  <el-select v-model="activePage" filterable placeholder="Select">
                    <el-option v-for="page in pages" :key="page.ID" :label="page.post_title" :value="page.ID" />
                  </el-select>
                </div>
                <br/>
                <div style="display: flex; align-items: center; gap: 8px"> 
                  <el-checkbox v-model="forceRedirect">
                    {{ $t("Force User Redirect") }}
                  </el-checkbox>
                  <el-tooltip content="Force Paymattic user to the selected dashboard page upon login." placement="right" effect="light"> 
                      <i class="el-icon-info" style="color: #aaa"></i>
                  </el-tooltip>
                </div>
               <br/>
                <a href="https://paymattic.com/docs/how-to-add-user-dashboard-module-in-paymattic/" target="_blank">
                  {{ $t("See our documentation") }}
                </a>
              </div>
            </app-card>

            <app-card class="sub-header">
              <div slot="header">
                <h2 class="header-title">
                  {{ $t("Email Notification Settings") }}
                </h2>
                <p class="header-sub-title">
                  {{ $t("Enable and Configure global subscription cancellation email notifications.") }} <a
                    href="https://paymattic.com/docs/how-to-enable-email-notification-for-subscription-cancel/"
                    target="_blank">See Documentation</a>
                </p>
              </div>

              <div slot="body" style="width: 100%;">
                <div class="settings-notification">
                  <div v-for="(notification, index) in notifications" :key="index">
                    <div style="padding: 10px 0px;" v-if="index == 'enable_cancel_subscription_email'">
                      <el-checkbox false-label="no" true-label="yes" v-model="notifications[index]">
                        {{ $t("Enable Email Notification") }}
                      </el-checkbox>
                    </div>
                    <EmailSettings @update-email-settings="permissionUpdate" disabled v-else
                      :notification="notification" :index="index" />
                  </div>
                </div>
              </div>
            </app-card>
              <!-- Subscription cancel Email Notification Settings -->
      
              <!-- End Email Notification Settings -->

              <div>
                <div class="action_right" style="float: right;">
                  <el-button @click="permissionUpdate" type="primary" size="medium" class="wpf_new_ui_button">
                    {{ $t("Save Settings") }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-row>
        </div>
      </div>
    </app-card>
  </div>
</template>

<script>

import CheckboxGroup from '../CheckboxGroup.vue';
import UpgradeNotice from '../../Common/UpgradeNotice.vue';
import EmailSettings from './EmailSettings.vue';
import AppCard from '../../Common/AppCard.vue';
import Icon from '../../Icons/Index.vue';

export default {
  name: "Privacy",
  components: {
    CheckboxGroup,
    UpgradeNotice,
    EmailSettings,
    AppCard,
    Icon
  },
  data() {
    return {
      notifications: {},
      loading: false,
      roles: [],
      checkAll: false,
      capability: ["administrator"],
      isIndeterminate: false,
      paymatticUserDashboardStatus: true,
      paymatticCustomUser: [],
      checkboxGroup: null,
      pages: [],
      activePage: "Paymattic Dashboard",
      forceRedirect: true,
      submissionFilterMode: 'all',
      submissionStatusFilter: [],
      submissionStatusOptions: [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'authorized', label: 'Authorized' },
        { value: 'processing', label: 'Processing' },
      ],
    };
  },
  methods: {
    paymatticUserRolesUpdate() {
      this.$post("forms/settings/update-paymattic-user-permission", {
        paymatticUserPermissions: this.paymatticCustomUser
      })
    },

    checkHasPro() {
      return window.wpPayFormsAdmin.has_pro;
    },

    permissionUpdate() {
      if(!this.checkHasPro()){
        return;
      }
      this.loading = true;
      let forceRedirect = this.forceRedirect ? 'yes' : 'no';
      const submissionStatusFilter = this.submissionFilterMode === 'all'
        ? 'all'
        : (Array.isArray(this.submissionStatusFilter) ? this.submissionStatusFilter : []);
      this.$post("forms/settings/update-paymattic-user-permission", {
        paymatticUserPermissions: this.paymatticCustomUser,
        activePage: this.activePage,
        force_user_redirect: forceRedirect,
        notifications: this.notifications,
        submission_status_filter: submissionStatusFilter,
      })
        .then((res) => {
          this.loading = false;
          this.$notify.success({
            title: 'Success!',
            message: res.message,
            offset: 30,
            position: 'bottom-right'
          });
        })
        .fail((e) => {
          this.loading = false;
          this.$notify.error({
            title: 'Error!',
            message: e.responseJSON.message,
            offset: 30,
            position: 'bottom-right'
          });
        })
        .always(() => {
          this.loading = false;
        });
    },

    getPaymatticUserDashboardData() {
      this.loading = true;
      // GlobalSettingsController@roles
      this.$get(`forms/settings/get-paymattic-user-dashboard-data`, {})
        .then((response) => {
          this.paymatticUserDashboardStatus = response.status;
          this.paymatticCustomUser = response.data?.paymatticUserPermissions
          this.pages = response?.pages
          this.activePage = response.activePage
          if (response.forceUserRedirect === 'yes') {
            this.forceRedirect = true;
          } else {
            this.forceRedirect = false;
          }
          this.notifications = response?.emailSettings;
          const filter = response.submissionStatusFilter;
          if (filter === 'all' || !filter) {
            this.submissionFilterMode = 'all';
            this.submissionStatusFilter = [];
          } else {
            this.submissionFilterMode = 'selected';
            this.submissionStatusFilter = Array.isArray(filter) ? filter : [filter];
          }
        })
        .fail((e) => { })
        .always(() => {
          this.loading = false;
        });
    },
    enablePaymatticUserDashboard() {
      if(!this.checkHasPro()){
        return;
      }
      this.loading = true;
      // GlobalSettingsController@roles
      this.$post(`forms/settings/enable-paymattic-user-dashboard`, {})
        .then((response) => {
          this.getPaymatticUserDashboardData();
        })
        .fail((e) => { })
        .always(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getPaymatticUserDashboardData();
  },
};
</script>

<style lang="scss" scoped>
  .payform_section_title {
    display: flex;
    gap: 10px;
    color: #2F3448;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }
  .header-title {
    color:  #2F3448;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  }
  .header-sub-title {
    color: var(--System-Dark-Light, #696778);
    /* Body/Regular/B5-Regular */
    font-family: Inter;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 0px;
  }
</style>