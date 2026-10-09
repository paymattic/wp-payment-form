<!-- <template>
    <GlobalPaymentComponents />
     <div v-loading="fetching">
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Stripe Settings') }}
                </h3>
                <div class="payform_section_actions">
                    <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                               type="primary">
                        {{ $t( 'Save Settings' ) }}
                    </el-button>
                </div>
            </div>
            <div class="payform_section_body">
                <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item label="">
                            <p class="wpf_settings_section_inner_label">
                                Stripe Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div v-if="settings.payment_mode === 'test'">
                            <p class="wpf_settings_section_inner_label">
                                Stripe Test Keys
                                <el-tooltip placement="top-start" effect="light">
                                    <div slot="content">
                                        <p>
                                            Collect the test keys from your stripe dashboard, <br/> fill the input bellow to collect payments for testing.
                                        </p>
                                    </div>
                                    <i class="el-icon-info" type="primary"></i>
                                </el-tooltip>
                            </p>
                            <el-form-item label="Test Publishable key">
                                <el-input type="text" size="medium" v-model="settings.test_pub_key"
                                        placeholder="Test Publishable key"/>
                            </el-form-item>
                            <el-form-item label="Test Secret key">
                                <el-input type="password" size="medium" v-model="settings.test_secret_key"
                                        placeholder="Test Secret key"/>
                            </el-form-item>
                        </div>

                        <div v-if="!is_key_defined">
                            <div v-if="settings.payment_mode === 'live'">
                                <p class="wpf_settings_section_inner_label">
                                    Stripe Live Keys
                                    <el-tooltip placement="top-start" effect="light">
                                        <div slot="content">
                                            <p>
                                                Collect the test keys from your stripe dashboard, <br/> fill the input bellow to collect payments for testing.
                                            </p>
                                        </div>
                                        <i class="el-icon-info" type="primary"></i>
                                    </el-tooltip>
                                </p>
                                <el-form-item label="Live Publishable key">
                                    <el-input type="text" size="medium" v-model="settings.live_pub_key"
                                            placeholder="Live Publishable key"/>
                                </el-form-item>
                                <el-form-item label="Live Secret key">
                                    <el-input type="password" size="medium" v-model="settings.live_secret_key"
                                            placeholder="Live Secret key"/>
                                </el-form-item>
                            </div>
                        </div>
                        <div v-else class="wpf_settings_section">
                            <p>Live Publishable key and Live Secret key is defined in wp-config.php. This is good! (y)</p>
                        </div>
                    </div>

                    <div class="wpf_settings_section">
                        <p class="wpf_settings_section_inner_label">
                            Company Info (Will be used on checkout)
                        </p>

                        <el-row :gutter="20">
                            <el-col :lg="12" :md="24">
                                <el-form-item label="Company/Business Name">
                                    <el-input type="text" size="medium" v-model="settings.company_name"
                                            placeholder="Company/Business Name"/>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12" :md="24">
                                <el-form-item label="Checkout Logo" class="checkout-logo-wrapper">
                                    <el-upload
                                        class="avatar-uploader"
                                        :action="uploadUrl"
                                        :show-file-list="false"
                                        accept_x="image/png, image/jpeg"
                                        :on-error="handleUploadError"
                                        :on-success="handleUploadSuccess">
                                        <img v-if="settings.checkout_logo" :src="settings.checkout_logo" class="avatar"/>
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                  <i v-if="settings.checkout_logo" class="el-icon-close avatar-close-icon" @click="() => this.settings.checkout_logo = ''"></i>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                Stripe Meta Data
                                <el-tooltip placement="top-start" effect="light">
                                    <div slot="content">
                                        <p>
                                            Enable this option to collect the <br/>
                                            form meta on your stripe user profile.
                                        </p>
                                    </div>
                                    <i class="el-icon-info" type="primary"></i>
                                </el-tooltip>
                            </p>
                            <el-checkbox :disabled="!has_pro" true-label="yes" false-label="no" v-model="settings.send_meta_data">Send Form input data to stripe metadata</el-checkbox>
                            <p>If you enable this then, Your form input data will be send to stripe as meta data</p>
                            <p v-if="!has_pro">This is a pro feature. Please upgrade to pro to enable this feature</p>
                        </el-form-item>

                        <div v-if="has_pro">
                            <h3>Stripe Webhook (For Subscription Payments)
                                <el-tooltip placement="top-start" effect="light">
                                    <div slot="content">
                                        <p>
                                            To get payment status instantly, please<br/>
                                            setup your webhook, Follow the docs bellow.
                                        </p>
                                    </div>
                                    <i class="el-icon-info" type="primary"></i>
                                </el-tooltip>
                            </h3>
                            <p>In order for Stripe to function completely for subscription/recurring payments, you must configure your Stripe webhooks. Visit
                                your <a href="https://dashboard.stripe.com/account/webhooks" target="_blank" rel="noopener">account
                                    dashboard</a> to configure them. Please add a webhook endpoint for the URL below.</p>
                            <p><b>Webhook URL: </b><code>{{webhook_url}}</code></p>
                            <p>See <a href="https://paymattic.com/docs/how-to-configure-stripe-payment-gateway-in-wordpress-with-paymattic/" target="_blank" rel="noopener">our documentation</a> for more information.</p>

                            <div>
                                <p><b>Please enable the following Webhook events for this URL:</b></p>
                                <ul>
                                    <li><code>charge.succeeded</code></li>
                                    <li><code>invoice.payment_succeeded</code></li>
                                    <li><code>charge.refunded</code></li>
                                    <li><code>customer.subscription.deleted</code></li>
                                    <li><code>checkout.session.completed</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="action_right wpf_settings_section">
                        <el-button @click="saveSettings()" type="primary" size="medium" class="wpf_new_ui_button">Save Settings</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import GlobalPaymentComponents from './GlobalPaymentComponents.vue';
    export default {
        name: 'stripe_settings',
        components: {
            GlobalPaymentComponents
        },
        data() {
            return {
                settings: {},
                uploadUrl: window.wpPayFormsAdmin.rest.url + '/file/upload?&_wpnonce=' + window.wpPayFormsAdmin.rest.nonce,
                saving: false,
                fetching: false,
                is_key_defined: false,
                labelPosition: 'top',
                webhook_url: ''
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;
                // GlobalSettingsController@getStripe
                this.$get('forms/settings/stripe', {
                })
                    .then((response) => {
                        this.settings = response.settings;
                        this.is_key_defined = response.is_key_defined
                        this.webhook_url = response.webhook_url
                    })
                    .fail(error => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.fetching = false;
                    });
            },
            saveSettings() {
                this.saving = true;
                // GlobalSettingsController@saveStripe
                this.$post('forms/settings/stripe', {
                    settings: this.settings
                })
                    .then(response => {
                        this.$notify.success({
                            title: 'Success',
                            message: response.message,
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            handleUploadSuccess(response) {
                this.settings.checkout_logo = response.data.file.url;
            },
            handleUploadError(error) {
                this.$message.error(error.toString());
            }
        },
        mounted() {
            // this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Stripe Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>

<style lang="scss">
    .checkout-logo-wrapper{
      position: relative;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px !important;
        text-align: center;
    }
    .avatar-close-icon{
      position: absolute;
      top: 4px;
      left: 4px;
      font-size: 20px;
      padding: 2px;
      color: #FF7518;
      cursor: pointer;
      &:hover{
        color: #FFB380;
        //font-size: 25px;
      }
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
        width: auto;
    }
</style> -->