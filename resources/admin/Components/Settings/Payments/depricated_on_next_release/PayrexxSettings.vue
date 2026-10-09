<!-- <template>
    <GlobalPaymentComponents />
    <div>
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Payrexx Settings') }}
                </h3>
                <div v-if="has_pro" class="payform_section_actions">
                    <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                               type="primary">
                        {{ $t( 'Save Settings' ) }}
                    </el-button>
                </div>
            </div>
            <div class="payform_section_body">
                <UpgradeNotice
                    v-if="!has_pro"
                    title="Payrexx payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item style="">
                            <p class="wpf_settings_section_inner_label">
                                Checkout Style Type
                                <el-tooltip placement="top-start" effect="light">
                                    <div slot="content">
                                        <p>
                                            Modal checkout allow you to collects payments on your site,<br/> or you can choose hosted payments to redirect user to the vendor site.
                                        </p>
                                    </div>
                                    <i class="el-icon-info" type="primary"></i>
                                </el-tooltip>
                            </p>
                            <el-radio-group v-model="settings.checkout_type">
                                <el-radio label="modal">Modal Checkout Style</el-radio>
                                <el-radio label="hosted">Hosted to payrexx.com</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section">
                        <p class="wpf_settings_section_inner_label">
                            Payrexx Credentials
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                       Collect the api key from your Payrexx dashboard,
                                       <br/> and the Instance Name will be the subdomain of your Payrexx.
                                       <br/> Example: "john.payrexx.com" (john is the instance name)
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Instance Name">
                            <el-input type="text" size="medium" v-model="settings.instance"
                                      placeholder="Provide Instance Name"/>
                            <p>Provide instance name ex: https://{$instanceName}.payrexx.com</p>

                        </el-form-item>
                        <el-form-item label="API Key">
                            <el-input type="password" size="medium" v-model="settings.api_key"
                                      placeholder="API Key"/>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section">
                        <div>
                            <p>See our <a href="https://paymattic.com/docs/how-to-integrate-payrexx-in-wordpress-with-paymattic/" target="_blank" rel="noopener">documentation</a> to get more information about payrexx setup.</p>
                        </div>
                        <div>
                            <h3>Payrexx IPN Settings
                                <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        To get payments update, you must use<br/>
                                        the IPN setting. Just collect the IPN URL <br/>
                                        bellow and use it on your vendor IPN setting.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                            </h3>
                            <p>In order to function completely to get instant payment notification,<br/> Please use this Webhook URL in your Payrexx account.
                                Use the Webhook Type as 'Normal(PHP-Post)'</p>
                            <code>{{settings.webhook}}</code>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import UpgradeNotice from '../../Common/UpgradeNotice.vue';
import GlobalPaymentComponents from './GlobalPaymentComponents.vue';
    export default {
        name: 'payrexx_settings',
        components: { UpgradeNotice, GlobalPaymentComponents },
        data() {
            return {
                settings: {

                },
                saving: false,
                fetching: false,
                is_key_defined: false,
                labelPosition: 'top',
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;
                this.$get('settings/payments/payrexx', {
                })
                    .then((response) => {
                        this.settings = response.settings;
                        this.is_key_defined = response.is_key_defined
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
                this.$post('settings/payments/payrexx', {
                    settings: this.settings
                })
                    .then(response => {
                       this.$notify.success({
                            title: 'Success!',
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
            }
        },
        mounted() {
            this.has_pro && this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Payrexx Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>

<style lang="scss">
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

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
        width: auto;
    }
</style> -->