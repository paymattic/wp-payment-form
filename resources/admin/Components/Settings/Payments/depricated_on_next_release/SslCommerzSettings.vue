<!-- <template>
     <div>
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('SSLCommerz Settings') }}
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
                    title="SSLCOMMERZ payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                SSLCOMMERZ Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section" v-if="settings.payment_mode === 'test'">
                        <p class="wpf_settings_section_inner_label">
                            SSLCOMMERZ Test Credentials
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the SSLCommerz test credentials<br/> from your vendor dashboards.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Test Store Key">
                            <el-input type="text" size="medium" v-model="settings.test_store_id"
                                      placeholder="Test Store Key"/>
                        </el-form-item>
                        <el-form-item label="Test Store Password/secret">
                            <el-input type="password" size="medium" v-model="settings.test_store_pass"
                                      placeholder="Test Store Password/secret"/>
                        </el-form-item>
                    </div>

                    <div v-else class="wpf_settings_section">
                        <p class="wpf_settings_section_inner_label">
                            SSLCOMMERZ Live Credentials
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the SSLCommerz live credentials<br/> from your vendor dashboards.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Live Store Key">
                            <el-input type="text" size="medium" v-model="settings.live_store_id"
                                      placeholder="Live Store Key"/>
                        </el-form-item>
                        <el-form-item label="Live Store Password/Secret">
                            <el-input type="password" size="medium" v-model="settings.live_store_pass"
                                      placeholder="Live Store Password/Secret"/>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section">
                        <div>
                            <p style="color: #d48916;">NB: Please add Email, Name and Address field on your form to get payment data correctly.</p>
                            <p>See our <a href="https://paymattic.com/docs/how-to-integrate-sslcommerz-with-paymattic-in-wordpress/" target="_blank" rel="noopener">documentation</a> to get more information about SSLCOMMERZ setup.</p>
                        </div>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
<GlobalPaymentComponents />
</template>
<script type="text/babel">
import GlobalPaymentComponents from './GlobalPaymentComponents.vue';
import UpgradeNotice from '../../Common/UpgradeNotice.vue';
    export default {
        name: 'sslcommerz_settings',
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
                this.$get('settings/payments/sslcommerz', {
                })
                    .then((response) => {
                        console.log({response});
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
                this.$post('settings/payments/sslcommerz', {
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
            window.WPPayFormsBus.$emit('site_title', 'SSLCOMMERZ Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script> -->
