<!-- <template>
    <GlobalPaymentComponents />
    <div v-loading="fetching">
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Offline Settings') }}
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
                    title="Offline payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="offline_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                Offline Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import GlobalPaymentComponents from './GlobalPaymentComponents.vue';
import UpgradeNotice from '../../Common/UpgradeNotice.vue'
    export default {
        name: 'offline_settings',
        components: { UpgradeNotice, GlobalPaymentComponents },
        data() {
            return {
                settings: {},
                saving: false,
                fetching: false,
                labelPosition: 'top',
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;
                this.$get('settings/payments/offline', {
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
                // GlobalSettingsController@saveOffline
                this.$post('settings/payments/offline', {
                    settings: this.settings
                })
                    .then(response => {
                        this.saving = false;
                        this.$notify.success({
                            title: 'Success',
                            message: response.message,
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {
                        // this.$message.error(error.responseJSON.data.message);
                        console.log(error)
                    })
                    .always(() => {
                        this.saving = false;
                    });
            }
        },
        mounted() {
            this.has_pro && this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Offline Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>

<style lang="scss">
</style> -->