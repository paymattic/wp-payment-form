<!-- <template>
    <div v-loading="fetching">
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Mollie Settings') }}
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
                    title="Mollie payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="mollie_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                Mollie Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div v-if="settings.payment_mode === 'test'">
                            <p class="wpf_settings_section_inner_label">
                                Mollie Test Keys
                                <el-tooltip placement="top-start" effect="light">
                                    <div slot="content">
                                        <p>
                                            Collect the test keys from your Mollie dashboard, <br/> fill the input bellow to collect payments for testing.
                                        </p>
                                    </div>
                                    <i class="el-icon-info" type="primary"></i>
                                </el-tooltip>
                            </p>
                            <el-form-item label="Test Publishable key">
                                <el-input type="password" size="medium" v-model="settings.test_api_key"
                                        placeholder="Test API key"/>
                            </el-form-item>
                        </div>
                        <div v-else>
                            <p class="wpf_settings_section_inner_label">
                                Mollie Live Keys
                                <el-tooltip placement="top-start" effect="light">
                                    <div slot="content">
                                        <p>
                                            Collect the Live keys from your Mollie dashboard, <br/> fill the input bellow to collect realtime payments.
                                        </p>
                                    </div>
                                    <i class="el-icon-info" type="primary"></i>
                                </el-tooltip>
                            </p>
                            <el-form-item label="Live Publishable key">
                                <el-input type="password" size="medium" v-model="settings.live_api_key"
                                        placeholder="Live API key"/>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="wpf_settings_section">
                        <p>See our <a href="https://paymattic.com/docs/how-to-integrate-mollie-in-wordpress-with-paymattic/" target="_blank" rel="noopener">documentation</a> to get more information about mollie setup.</p>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import UpgradeNotice from '../../Common/UpgradeNotice.vue'
    export default {
        name: 'mollie_settings',
        components: { UpgradeNotice },
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
                this.$get('settings/payments/mollie', {
                })
                    .then((response) => {
                        this.settings = response;
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
                this.$post('settings/payments/mollie', {
                    settings: this.settings
                })
                    .then(response => {
                        this.saving = false;
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
            window.WPPayFormsBus.$emit('site_title', 'Mollie Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>

<style lang="scss">
</style> -->