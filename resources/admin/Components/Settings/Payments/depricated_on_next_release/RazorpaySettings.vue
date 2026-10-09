<!-- <template>
     <div>
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Razorpay Settings') }}
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
                    title="Razorpay payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                Razorpay Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item style="margin: 42px 0px">
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
                                <el-radio label="hosted">Hosted to razorpay.com</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section" v-if="settings.payment_mode === 'test'">
                        <p class="wpf_settings_section_inner_label">
                            Razorpay Test Keys
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the Razorpay test api keys<br/> from your Razorpay vendor dashboards.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Test API key">
                            <el-input type="text" size="medium" v-model="settings.test_api_key"
                                      placeholder="Test API key"/>
                        </el-form-item>
                        <el-form-item label="Test API Secret">
                            <el-input type="password" size="medium" v-model="settings.test_secret_key"
                                      placeholder="Test API Secret"/>
                        </el-form-item>
                    </div>

                    <div class="wpf_settings_section" v-else>
                        <p class="wpf_settings_section_inner_label">
                            Razorpay Live Keys
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the Razorpay api keys<br/> from your razorpay vendor dashboards.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Live API key">
                            <el-input type="text" size="medium" v-model="settings.live_api_key"
                                      placeholder="Live API key"/>
                        </el-form-item>
                        <el-form-item label="Live API Secret">
                            <el-input type="password" size="medium" v-model="settings.live_secret_key"
                                      placeholder="Live API secret"/>
                        </el-form-item>
                    </div>

                    <div class="wpf_settings_section">
                        <p class="wpf_settings_section_inner_label">
                            Razorpay notifications
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        After successful payments user will<br/> notify by the methods bellow.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item>
                            <p>Select if you want to enable SMS and Email Notification from razorpay</p>
                            <el-checkbox-group v-model="settings.notification">
                                <el-checkbox label="sms">SMS</el-checkbox>
                                <el-checkbox label="email">Email</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section">
                        <div>
                            <p>See our <a href="https://paymattic.com/docs/how-to-integrate-razorpay-with-paymattic-in-wordpress/" target="_blank" rel="noopener">documentation</a> to get more information about razorpay setup.</p>
                        </div>
                        <div v-if="has_pro" class="action_right">
                            <el-button @click="saveSettings()" type="primary" size="medium" class="wpf_new_ui_button">Save Settings</el-button>
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
        name: 'razorpay_settings',
        components: { UpgradeNotice, GlobalPaymentComponents },
        data() {
            return {
                settings: {
                    notification: []
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
                this.$get('settings/payments/razorpay', {
                })
                    .then((response) => {
                        this.settings = response.settings;
                        this.is_key_defined = response.is_key_defined
                    })
                    .fail(error => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.message,
                            position: 'bottom-right',
                        });
                    })
                    .always(() => {
                        this.fetching = false;
                    });
            },
            saveSettings() {
                this.saving = true;
                this.$post('settings/payments/razorpay', {
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
            window.WPPayFormsBus.$emit('site_title', 'Razorpay Settings');
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