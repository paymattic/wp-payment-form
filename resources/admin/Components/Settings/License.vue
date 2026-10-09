<template>
  <div class="license">
    <div class="all_payforms_wrapper payform_section wpf_min_width" element-loading-background="#fff"
      v-loading="checkingLicense">
      <app-card>

        <div slot="header">
          <div v-if="licenseData.status == 'valid'">
            <h2>
              <i style="color: green" class="el-icon-success"></i>
              {{ $t("Your License is Active") }}
            </h2>
          </div>
          <div v-loading="checkingLicense" v-else-if="licenseData.status == 'expired'">
            <h2 class="payform_section_title">
              {{ $t("Licensing has been expired") }}
            </h2>
          </div>
          <div v-else>
            <h2 class="payform_section_title">
              {{ $t("Licensing") }}
            </h2>
            <p style="margin-bottom: 0px;">
              {{ $t("You have to activate your Paymattic Pro by providing the license key bellow. If you don't have a license key please")}}
              <a href="https://wpmanageninja.com/checkout/purchase-history/" target="_blank">{{ $t('Click Here') }}</a>
              {{ $t('to get a license key from your purchase') }}. <br />{{ $t('Any questions or problems with your license')}}?
              <a href="https://wpmanageninja.com/contact/" target="_blank">{{ $t('Contact us') }}!</a>
            </p>
          </div>
        </div>
        <div style="width: 100%;" slot="body">
          <div class="payform_section_body">
            <div class="ninja_content">
              <div v-if="licenseData.status == 'valid'" class="license_success">
                <h3>
                  {{ $t("Your license is active! Enjoy Paymattic Pro") }}
                </h3>
                <el-button v-loading="doing_ajax" @click="deactivateLicense()" class="license_submit" type="warning"
                  plain size="medium">{{ $t("Deactivate License") }}
                </el-button>
                <p v-if="renewHtml" v-html="renewHtml"></p>
              </div>
              <div v-loading="checkingLicense" v-else-if="licenseData.status == 'expired'" class="license_form">
                <div style="text-align: center" class="checking_license" v-html="renewLicenseHtml"></div>
                <p>
                  {{ $t('If you already renewed your license then please') }}
                  <a @click.prevent="get_license_info()" href="#">{{ $t('click here to check again') }}</a>
                </p>
                <p>
                  {{ $t('Have a new license key? Please') }}
                  <a href="#" @click.prevent="enter_new_license = true">{{ $t('click here') }}</a>
                </p>

                <div v-if="enter_new_license" class="license_form">
                  <label for="license_form_input">
                    {{ $t("Enter your license key") }}
                  </label>
                  <div class="form_input">
                    <input v-model="licenseKey" placeholder="License Key" id="license_form_input" />
                  </div>
                  <el-button v-loading="doing_ajax" @click="verifyLicense()" class="license_submit" type="primary"
                    size="medium">{{ $t("Activate WPPay Form Pro") }}
                  </el-button>
                  <div class="nt_messages" style="padding: 10px 0px;">
                    <p class="error_message" v-html="error_message" v-if="error_message"></p>
                  </div>
                </div>
              </div>
              <div v-else class="license_form">
                <label for="license_form_input">
                  {{ $t("Enter your license key") }}
                </label>
                <div class="form_input">
                  <input v-model="licenseKey" :placeholder="$t('License Key')" id="license_form_input" />
                </div>
                <el-button  v-loading="doing_ajax" @click="verifyLicense()" class="license_submit wpf_new_ui_button"
                  type="primary">{{ $t("Activate Paymattic Pro") }}
                </el-button>

                <div class="nt_messages" style="padding: 10px 0px;">
                  <p class="error_message" v-html="error_message" v-if="error_message"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  </div>
</template>

<script type="text/babel">
import AppCard from "../Common/AppCard.vue";
export default {
  name: "license",
  components: {
    AppCard,
  },
  data() {
    return {
      licenseKey: "",
      error_message: "",
      enter_new_license: false,
      checkingLicense: false,
      doing_ajax: false,
      renewLicenseHtml: "",
      renewHtml: "",
      is_valid: window.wpPayFormsAdmin.hasValidLicense,

      licenseData: {},
    };
  },
  methods: {
    get_license_info() {
      this.checkingLicense = true;
      this.error_message = "";
      jQuery
        .get(ajaxurl, {
          action: "_wppayform_pro_license_get_license_info",
        })
        .then((response) => {
          this.renewLicenseHtml = response.data.renewHtml;
          this.is_valid = response.data.status;
          this.renewHtml = response.data.renewHtml;
        })
        .fail((error) => {
          this.error_message = error.responseJSON.data.message;
        })
        .always(() => {
          this.checkingLicense = false;
        });
    },

    getSettings() {
      this.error_message = "";
      this.checkingLicense = true;
      this.$get("license", { verify: true })
        .then((response) => {
          this.licenseData = response;
        })
        .fail((errors) => {
          this.$showAjaxError(errors);
        })
        .always(() => {
          this.checkingLicense = false;
        });
    },
    verifyLicense() {
      if (!this.licenseKey) {
        this.$message.error("Please provide a license key");
        this.error_message = "Please provide a license key";
        return;
      }

      this.checkingLicense = true;

      this.error_message = "";
      this.$post("license", {
        license_key: this.licenseKey,
      })
        .then((response) => {
          if (response.license_data) {
            this.licenseData = response.license_data;
          }

          this.$notify.success({
            title: "Success!",
            offset: 30,
            message: response.message,
            position: 'bottom-right'
          });
        })
        .fail((errorResponse) => {
          let errorMessage = "";
          if (typeof errorResponse === "string") {
            errorMessage = errorResponse;
          } else if (errorResponse && errorResponse.responseJSON) {
            errorMessage = errorResponse.responseJSON.message;
          }
          //  else {
          //     errorMessage = window.FLUENTCRM.convertToText(errorResponse);
          // }
          if (!errorMessage) {
            errorMessage = "Something is wrong!";
          }

          this.error_message = errorMessage;

          this.$showAjaxError(errorResponse.responseJSON);
        })
        .always(() => {
          this.checkingLicense = false;
        });
    },
    deactivateLicense() {
      this.checkingLicense = true;
      this.$del("license")
        .then((response) => {
          this.licenseData = response.license_data;
          this.$notify.success({
            title: "Success!",
            offset: 30,
            message: response.message,
            position: 'bottom-right'
          });
        })
        .fail((errors) => {
          this.$showAjaxError(errors);
        })
        .always(() => {
          this.checkingLicense = false;
        });
    },
  },
  mounted() {
    // this.get_license_info();
    this.getSettings();
  },
};
</script>

<style lang="scss" scoped>
.license_form {
  .el-button {
    float: right;
  }
  label {
    color: #2F3448;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; 
  }

  .form_input input {
    min-width: 400px;
    height: 40px;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #D6DAE1;
    background: #fbfdff;
    font-size: 20px;
    padding: 0px 10px;
    margin-top: 10px;
  }

  .error_message {
    margin-top: 40px;
    padding: 10px;
    background: #ffe491;
    color: #000000;
    font-weight: bold;
    border-radius: 5px;
  }
}

.license_success {
  text-align: center;
  padding: 40px 0px;

  h3 {
	  padding-bottom: 20px;
  }
}
</style>
