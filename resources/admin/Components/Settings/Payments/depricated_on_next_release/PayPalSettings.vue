<!-- <template>
    <!-- <div v-loading="fetching">
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('PayPal Settings') }}
                </h3>
                <div v-if="has_pro" class="payform_section_actions">
                    <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                               type="primary">
                        {{ $t( 'Save PayPal Settings' ) }}
                    </el-button>
                </div>
            </div>
            <div class="payform_section_body">
                <UpgradeNotice
                    v-if="!has_pro"
                    title="Paypal payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="paypal_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                PayPal Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Sandbox Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="Paypal Email">
                            <el-input type="text" size="medium" v-model="settings.paypal_email"
                                    placeholder="Paypal Email Address"/>
                        </el-form-item>
                        <el-row :gutter="20">
                            <el-col :lg="12" :md="24">
                                <el-form-item label="Disable PayPal IPN Verification">
                                    <el-switch active-value="yes" inactive-value="no" v-model="settings.disable_ipn_verification"/>
                                    <p>If you are unable to use Payment Data Transfer and payments are not getting marked as
                                        complete, then check this box. This forces the site to use a slightly less secure method of
                                        verifying purchases.</p>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12" :md="24">
                                <el-form-item label="Paypal Checkout Logo" class="checkout-logo-wrapper">
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
                    </div>
                    <div class="wpf_settings_section">
                        <h3>
                            Confirmation Page Settings
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        You can choose what will show after a successful payment<br/> or if there is any fails.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </h3>

                        <el-row :gutter="20">
                            <el-col :lg="12" :md="24">
                                <el-form-item label="Payment Success Page">
                                    <el-select v-model="confirmation_pages.confirmation" filterable placeholder="Select Payment Success Redirect Page">
                                        <el-option
                                            v-for="page in pages"
                                            :key="page.ID"
                                            :label="page.post_title"
                                            :value="parseInt(page.ID)">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="12" :md="24">
                                <el-form-item label="Payment Failed Page">
                                    <el-select v-model="confirmation_pages.failed" filterable placeholder="Select Payment Failed Redirect Page">
                                        <el-option
                                            v-for="page in pages"
                                            :key="page.ID"
                                            :label="page.post_title"
                                            :value="parseInt(page.ID)">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
                <div class="wpf_settings_section">
                    <div style="margin-top: 20px">
                        If you use PayPal for recurring payments please set the notification URL in PayPal as bellow:
                        <pre>{{ipn_url}}</pre>
                        <p>Check the <a target="_blank" href="https://paymattic.com/docs/how-to-set-paypal-ipn-in-wordpress-with-paymattic/">documentation</a> </p>
                        <p>If you don't setup the IPN notification then it will still work for single payments but recurring payments will not be marked as paid for paypal subscription payments.</p>
                    </div>
                    <div v-if="has_pro" class="action_right">
                        <el-button @click="saveSettings()" type="primary" size="medium" class="wpf_new_ui_button">Save PayPal Settings</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import UpgradeNotice from '../../Common/UpgradeNotice.vue';
    import GlobalPaymentComponents from './GlobalPaymentComponents.vue';
    export default {
        components: {
            UpgradeNotice,
            GlobalPaymentComponents
        },
        data() {
            return {
                settings: {},
                uploadUrl: window.wpPayFormsAdmin.rest.url + '/file/upload?&_wpnonce=' + window.wpPayFormsAdmin.rest.nonce,
                saving: false,
                fetching: false,
                is_key_defined: false,
                pages: [],
                ipn_url: window.wpPayFormsAdmin.ipn_url,
                confirmation_pages: {},
                labelPosition: 'top'
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;
                this.$get('settings/paypal', {})
                    .then((response) => {
                        this.settings = response.settings;
                        this.pages = response.pages;
                        this.confirmation_pages = response.confirmation_pages
                    })
                    .fail(error => {
                        this.$notify.error({
                            title: 'Oops',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right',
                        });
                    })
                    .always(() => {
                        this.fetching = false;
                    });
            },
            saveSettings() {
                this.saving = true;
                this.$post('settings/paypal', {
                    settings: this.settings,
                    confirmation_pages: this.confirmation_pages
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
            },
            handleUploadSuccess(response) {
                this.settings.checkout_logo = response.data.file.url;
            },
            handleUploadError(error) {
                this.$message.error(error.toString());
            }
        },
        mounted() {
            if(this.has_pro) {
                this.getSettings();
            }
            window.WPPayFormsBus.$emit('site_title', 'Paypal Settings');
            if(window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script> -->