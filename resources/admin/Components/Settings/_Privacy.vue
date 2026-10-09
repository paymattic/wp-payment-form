<template>
  <div class="all_payforms_wrapper payform_section wpf_min_width">
    <app-card class="wpf_permission_settings">
      <div slot="header">
        <h3 class="payform_section_title">
          {{ $t("Permission Settings") }}
        </h3>
      </div>

      <div slot="body">
        <el-row v-loading="loading">
          <div class="wpf_ninja_header" v-if="roles.length">
            <h2>{{ $t("Paymattic Admin Permissions") }}</h2>
            <div class="wpf_ninja_block">
              <p>
                {{ $t("By default, only Administrator have access to manage the paymattic. By selecting additional roles bellow, you can give access to manage your paymattic to other user roles.") }}
              </p>
            </div>
          </div>
          <!-- <hr /> -->
          <div v-if="roles.length" class="wpf_ninja_content">
            <template>
              <div class="wpf-form-group">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange('admin', $event)">
                  {{ $t("Check All") }}
                </el-checkbox>
              </div>

              <div class="wpf-form-group">
                <el-checkbox-group class="wpf_role_group" v-model="capability"
                  @change="handleCheckedCapabilitiesChange('admin', $event)">
                  <el-checkbox v-for="role in roles" :label="role.key" :key="role.key">
                    {{ role.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </div>

          <div class="wpf_ninja_header" v-if="dashboardRoles.length" style="margin-top: 30px;">
            <h2>{{ $t("Paymattic User Dashboard Permissions") }}</h2>
            <div class="wpf_ninja_block">
              <p>
                {{ $t("By default, Administrators and Paymattic Users can access the Paymattic dashboard. Select roles below to grant access to others.") }}
              </p>
            </div>
          </div>
          <!-- <hr /> -->
          <div v-if="dashboardRoles.length" class="wpf_ninja_content">
            <template>
              <div class="wpf-form-group">
                <el-checkbox :indeterminate="isSelectAllIndeterminate" v-model="isAllRolesSelected" @change="handleCheckAllChange('dashboard', $event)">
                  {{ $t("Check All") }}
                </el-checkbox>
              </div>

              <div class="wpf-form-group">
                <el-checkbox-group class="wpf_role_group" v-model="selectedDashboardRoles"
                  @change="handleCheckedCapabilitiesChange('dashboard', $event)">
                  <el-checkbox v-for="role in dashboardRoles" :label="role.key" :key="role.key">
                    {{ role.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </div>
          <div class="action_right">
            <el-button @click="store()" type="primary" size="medium" class="wpf_new_ui_button">
              {{ $t('Save Settings')}}
            </el-button>
          </div>
        </el-row>
      </div>
    </app-card>
  </div>
</template>

<script>
import AppCard from '../Common/AppCard.vue';
export default {
  name: "Privacy",
  components: {
    AppCard,
  },
  data() {
    return {
      loading: false,
      roles: [],
      checkAll: false,
      capability: ["administrator"],
      isIndeterminate: false,
      checkboxGroup: null,
      isSelectAllIndeterminate: false,
      dashboardRoles: [],
      isAllRolesSelected: false,
      selectedDashboardRoles: []
    };
  },
  methods: {

    get() {
      this.loading = true;
      // GlobalSettingsController@roles
      this.$get(`forms/settings/roles`, {})
        .then((response) => {
          let capability = response.roles.capability;
          if (!capability || typeof capability != "object") {
            capability = ["administrator"];
          }
          this.capability = capability;
          this.roles = response.roles.roles;
          this.dashboardRoles = response.dashboardRoles.roles;
          this.selectedDashboardRoles = response.selectedDashboardRoles;
          this.handleCheckedCapabilitiesChange('admin', this.capability);
          this.handleCheckedCapabilitiesChange('dashboard', this.selectedDashboardRoles);
        })
        .fail((e) => { })
        .always(() => {
          this.loading = false;
        });
    },
    store() {
      if (!this.roles.length) {
        return;
      }
      // GlobalSettingsController@setRoles
      this.loading = true;
      this.$post("forms/settings/roles", {
        capability: this.capability,
        dashboardRoles: this.selectedDashboardRoles,
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
    handleCheckAllChange(type, val) {
      if (type === 'admin') {
        this.capability = val ? this.roles.map((item) => item.key) : [];
        this.isIndeterminate = false;
      }
      else {
        this.selectedDashboardRoles = val ? this.dashboardRoles.map((item) => item.key) : [];
        this.isSelectAllIndeterminate = false;
      }
    },
    handleCheckedCapabilitiesChange(type, value) {
      if (type === 'admin') {
        this.checkAll = value.length === this.roles.length;
        this.isIndeterminate = value.length > 0 && value.length < this.roles.length;
      } else {
        const updatedRoles = Array.from(new Set([...value, "administrator"]))
        this.selectedDashboardRoles = updatedRoles;
        this.isAllRolesSelected = updatedRoles.length === this.dashboardRoles.length + 1;
        this.isSelectAllIndeterminate = updatedRoles.length - 1 > 0 && updatedRoles.length - 1 < this.dashboardRoles.length;
      }
    },
  },
  mounted() {
    this.get();
  },
};
</script>

<style scoped>
.wpf_permission_settings {
	background-color: #fff;
	margin-bottom: 20px;
	border-radius: 8px;
	border: none;
}
.wpf_ninja_header {
	border: 1px solid #8080805c;
	padding: 14px 20px;
	border-radius: 8px 8px 0 0;
}
.wpf_ninja_content {
	padding: 20px;
	border-radius: 0 0 8px 8px;
	border-left: 1px solid #D6DAE1;
  border-right: 1px solid #D6DAE1;
  border-bottom: 1px solid #D6DAE1;
}
.wpf_ninja_block p {
	margin: 0;
	padding-top: 8px;
}

.el-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.wpf_role_group label {
  margin-top: 20px;
  width: calc(22% - 10px);
}
.action_right {
	float: right;
	padding-top: 20px;
}
</style>
