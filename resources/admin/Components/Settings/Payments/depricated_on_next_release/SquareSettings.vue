<!-- <template>
    <GlobalPaymentComponents />
  <div>
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Square Settings') }}
                </h3>
                <div v-if="has_pro" class="payform_section_actions">
                    <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="small"
                               type="primary">
                        {{ $t( 'Save Settings' ) }}
                    </el-button>
                </div>
            </div>
            <div class="payform_section_body">
                <UpgradeNotice
                    v-if="!has_pro"
                    title="Square payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item>
                            <p class="wpf_settings_section_inner_label">
                                Square Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section" v-if="settings.payment_mode === 'test'">
                        <p class="wpf_settings_section_inner_label">
                            Square Test Keys
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the Square test api keys<br/> from your square dashboards.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Test Access key">
                            <el-input type="text" size="small" v-model="settings.test_access_key"
                                      placeholder="Test Access key"/>
                        </el-form-item>
                        <el-form-item label="Test Location Id">
                            <el-input type="password" size="small" v-model="settings.test_location_id"
                                      placeholder="Test Location Id"/>
                        </el-form-item>
                    </div>

                    <div v-else class="wpf_settings_section">
                        <p class="wpf_settings_section_inner_label">
                            Square Live Keys
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the Square live api keys<br/> from your square dashboards.
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item label="Live Access key">
                            <el-input type="text" size="small" v-model="settings.live_access_key"
                                placeholder="Live Access key"/>
                        </el-form-item>
                        <el-form-item label="Live Location Id">
                            <el-input type="password" size="small" v-model="settings.live_location_id"
                                placeholder="Live Location id"/>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section">
                        <div>
                            <p>See our <a href="https://paymattic.com/docs/how-to-integrate-square-with-paymattic-in-wordpress/" target="_blank" rel="noopener">documentation</a> to get more information about square setup.</p>
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
        name: 'square_settings',
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
                this.$get('settings/payments/square', {
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
                this.$post('settings/payments/square', {
                    settings: this.settings
                })
                    .then(response => {
                        this.$notify.success({
                            title: 'Success!',
                            offset: 30,
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
            window.WPPayFormsBus.$emit('site_title', 'Square Settings');
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