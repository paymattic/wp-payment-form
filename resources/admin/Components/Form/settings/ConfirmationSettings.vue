Confirmation.vue
<template>
    <div class="no_shadow payform_section">
        <app-card>
            <div slot="header">
                <h3 class="payform_section_title">
                    {{ $t('Confirmation Settings') }}
                </h3>
            </div>

            <template slot="body">
                <el-tabs v-model="current_tab" type="card" class="wpf_confirmations_tab">
                    <el-tab-pane name="confirmation" :label="$t('Form Confirmation Settings')">
                        <div v-if="current_tab == 'confirmation'">
                            <div class="all_payforms_wrapper payform_section">
                                <div v-loading="fetching" class="payform_section_body">
                                    <el-form ref="payment_settings" :label-position="labelPosition"
                                                :model="payment_settings" label-width="220px">
                                        <confirmation-settings
                                            :pages="pages"
                                            :posts="posts"
                                            :editorShortcodes="editorShortcodes"
                                            :confirmation="confirmation_settings">
                                        </confirmation-settings>
                                    </el-form>
                                    <div class="wpf_form_setting_btn customize_btn">
                                        <el-button @click="saveSettings()" class="payform_action" type="primary">
                                            {{ $t( 'Save Confirmation Settings' ) }}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="receipt_customization" :label="$t('Receipt Customization')">
                        <receipt-settings
                            v-if="current_tab == 'receipt_customization'"
                            :receipt="receipt_settings"
                            :form_id="form_id"
                            :editorShortcodes="editorShortcodes">
                        </receipt-settings>
                    </el-tab-pane>
                    <el-tab-pane name="recaptcha" :label="$t('reCaptcha Settings')">
                        <div class="recaptcha_settings">
                            <div style="padding: 20px 0 0 20px;">
                                <p style="padding: 0px;" v-if="recaptcha_settings.all_forms == 'yes'">
                                    reCAPTCHA is enabled globally. This form will have reCAPTCHA
                                </p>
                                <p style="padding: 0px;" v-else-if="recaptcha_settings.recaptcha_version == 'none'">
                                    {{ $t('reCAPTCHA has not been configured yet! Please configure reCAPTCHA from Settings -> reCaptcha Settings')}}
                                </p>
                                <div v-else>
                                    <el-checkbox true-label="yes" false-label="no" v-model="form_recaptcha_status">Enable
                                        reCAPTCHA for this form
                                    </el-checkbox>
                                </div>
                            </div>

                            <div class="wpf_form_setting_btn customize_btn">
                                <el-button @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium" type="primary">
                                    {{ $t( 'Save reCAPTCHA Settings' ) }}
                                </el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="turnstile" :label="$t('Turnstile Settings')">
                        <div class="turnstile_settings">
                            <div>
                                <p v-if="turnstile_settings.siteKey === ''">
                                    {{ $t('Turnstile has not been configured yet! Please configure turnstile from Settings -> turnstile Settings')}}
                                </p>
                                <p v-else-if="turnstile_settings.all_forms == 'yes'">
                                    Turnstile is enabled globally. This form will have Turnstile.
                                </p>
                                <div v-else>
                                    <el-checkbox style="padding: 20px;" true-label="yes" false-label="no" v-model="form_turnstile_status">
                                        Enable turnstile for this form
                                    </el-checkbox>
                                </div>
                            </div>
                            <div class="wpf_form_setting_btn customize_btn">
                                <el-button @click="saveSettings()" class="payform_action" size="medium" type="primary">
                                    {{ $t( 'Save turnstile Settings' ) }}
                                </el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </app-card>
    </div>
</template>

<script type="text/babel">
    import ConfirmationSettings from './_AddConfirmation';
    import ReceiptSettings from './_ReceiptCustomization';
    import AppCard from '../../Common/AppCard.vue';

    export default {
        name: 'confirmation_settings',
        props: ['form_id'],
        components: {
            ConfirmationSettings,
            ReceiptSettings,
            AppCard
        },
        data() {
            return {
                payment_settings: {},
                receipt_settings: {},
                fetching: false,
                pages: [],
                posts: [],
                editorShortcodes: [],
                confirmation_settings: {},
                app_ready: false,
                labelPosition: 'top',
                recaptcha_settings: {},
                form_recaptcha_status: 'yes',
                turnstile_settings: {},
                form_turnstile_status: 'no',
                current_tab: 'confirmation'
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;
                // FormController@settings
                this.$get(`form/${this.form_id}/settings`,{})
                    .then(response => {
                        this.confirmation_settings = response.confirmation_settings;
                        this.editorShortcodes = Object.values(response.editor_shortcodes);
                        this.pages = response.pages;
                        this.posts = response.posts;
                        this.recaptcha_settings = response.recaptcha_settings;
                        this.form_turnstile_status = response.form_turnstile_status;
                        this.turnstile_settings = response.turnstile_settings;
                        this.form_recaptcha_status = response.form_recaptcha_status;
                        this.receipt_settings = response.receipt_settings;
                    })
                    .fail(error => {
                        console.log(error)
                    })
                    .always(() => {
                        this.fetching = false;
                        this.app_ready = true;
                    })
            },
            saveSettings() {
                this.saving = true;
                // FormController@saveSettings
                this.$post(`form/${this.form_id}/settings`, {
                    confirmation_settings: this.confirmation_settings,
                    form_recaptcha_status: this.form_recaptcha_status,
                    form_turnstile_status: this.form_turnstile_status
                })
                    .then(response => {
                         this.$notify.success({
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                    })
                    .fail((error) => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.saving = false;
                    })
            }
        },
        mounted() {
            this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Form Confirmation Settings');
            if (window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>
