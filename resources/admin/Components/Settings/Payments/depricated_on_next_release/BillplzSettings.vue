<!-- <template>
    <div>
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Billplz Settings') }}
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
                    title="Billplz payment is a pro version feature."
                />
                <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" label-width="220px">
                    <div class="wpf_settings_section">
                        <el-form-item required>
                            <p class="wpf_settings_section_inner_label">
                                Billplz Payment Mode
                            </p>
                            <el-radio-group v-model="settings.payment_mode">
                                <el-radio label="test">Test Mode</el-radio>
                                <el-radio label="live">Live Mode</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section" v-if="settings.payment_mode === 'test'">
                        <p class="wpf_settings_section_inner_label">
                            Billplz Test Credentials
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the Billplz test credentials<br/> from your vendor dashboards.<br/>
                                        <a target="_blank" href="https://dashboard.billplz-sandbox.com/enterprise/setting">
                                            https://dashboard.billplz-sandbox.com/enterprise/setting
                                        </a>
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item required label="Test secret key">
                            <el-input type="password" size="medium" v-model="settings.secret_key"
                                      placeholder="Test Secret Password/secret"/>
                        </el-form-item>
                        <el-form-item required label="Test Collection Id">
                            <el-input size="medium" v-model="settings.collection_id" placeholder="Test Collection Id" v-on:blur="getCollectionId"/>
                        </el-form-item>
                    </div>

                    <div v-else class="wpf_settings_section">
                        <p class="wpf_settings_section_inner_label">
                            Billplz Live Credentials
                            <el-tooltip placement="top-start" effect="light">
                                <div slot="content">
                                    <p>
                                        Collect the Billplz live credentials<br/> from your vendor dashboards.<br/>
                                        <a target="_blank" href="https://dashboard.billplz.com/enterprise/setting">
                                            https://dashboard.billplz.com/enterprise/setting
                                        </a>
                                    </p>
                                </div>
                                <i class="el-icon-info" type="primary"></i>
                            </el-tooltip>
                        </p>
                        <el-form-item required label="Live Secret key">
                            <el-input type="password" size="medium" v-model="settings.live_secret_key"
                                      placeholder="Live Secret Key"/>
                        </el-form-item>
                        <el-form-item required label="Live Collection Id">
                            <el-input size="medium" v-model="settings.live_collection_id" placeholder="Live Collection Id" v-on:blur="getCollectionId"/>
                        </el-form-item>
                    </div>
                    <div class="wpf_settings_section" v-loading="verify_collection_id" element-loading-text="getting collection info... ">
                        <span>{{collection_name}}</span>
                        <span v-if="collection_status === 'active'" style="margin-left: 12px; color: green;">{{collection_status}}</span>
                        <span v-if="collection_status === 'inactive'" style="margin-left: 12px; color: red;">{{collection_status}} Please Activate collection from Billplz to get paid!</span>
                    </div>
                    <div class="wpf_settings_section">
                        <div>
                            <p style="color: #d48916;">NB: Please add Email, Name and mobile field on your form to get payment data correctly.</p>
                            <p>See our <a href="https://paymattic.com/docs/how-to-configure-billplz-in-wordpress-with-paymattic/" target="_blank" rel="noopener">documentation</a> to get more information about Billplz setup.</p>
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
        name: 'billplz_settings',
        components: { UpgradeNotice, GlobalPaymentComponents },
        data() {
            return {
                settings: {
                },
                saving: false,
                fetching: false,
                is_key_defined: false,
                labelPosition: 'top',
                collection_name: '',
                collection_status: '',
                verify_collection_id: false,
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;
                this.$get('settings/payments/billplz', {
                })
                    .then((response) => {
                        this.settings = response.settings;
                        this.is_key_defined = response.is_key_defined;
                    })
                    .fail(error => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.fetching = false;
                    });
            },
            saveSettings() {
                this.saving = true;
                this.$post('settings/payments/billplz', {
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
            },
            getCollectionId() {
                this.verify_collection_id = true;
                this.$get('settings/payments/billplz/collections', {
                    settings: this.settings
                })
                    .then(response => {
                        this.collection_name = response.title;
                        this.collection_status = response.status;
                    })
                    .fail(error => {
                        this.collection_name = error.responseJSON.data.message;
                        this.collection_status = '';
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.verify_collection_id = false;
                    });
            }
        },
        mounted() {
            this.has_pro && this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Billplz Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script> -->
