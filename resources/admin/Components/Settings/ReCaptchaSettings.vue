<template>
    <div v-loading="fetching">
        <div class="all_payforms_wrapper wpf-recaptcha-settings payform_section">
            <app-card>
                <template slot="header">
                    <h3 class="payform_section_title">
                        {{ $t('reCAPTCHA Settings') }}
                    </h3>
                </template>

                <template style="width: 100%;" slot="body">
                    <el-form :label-position="labelPosition" rel="stripe_settings" :model="settings" style="width: 100%;">
                        <div class="wpf_recaptcha_settings_section ">
                            <el-form-item>
                                <p class="wpf_settings_section_inner_label">
                                    {{ $t('reCaptcha Mode') }}
                                    <el-tooltip placement="top-start" effect="light">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Please select the appropriate mode')}},<br /> {{ $t('After setting all bellow fields you have to setup individual form settings as well')}}.
                                            </p>
                                        </div>
                                        <i class="el-icon-info" type="primary"></i>
                                    </el-tooltip>
                                </p>
                                <el-radio-group @change="load" v-model="settings.recaptcha_version">
                                    <el-radio class="el_radio_dashed_button" label="none">{{ $t('Disable') }}
                                        reCAPTCHA</el-radio>
                                    <el-radio class="el_radio_dashed_button" label="v2_visible">{{ $t('Visible') }}
                                        reCAPTCHA (V2)</el-radio>
                                    <el-radio class="el_radio_dashed_button" label="v3_invisible">{{
                                        $t('Invisible') }} reCAPTCHA (v3)
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>

                        <div v-show="settings.recaptcha_version != 'none'" class="wpf_recaptcha_settings_section">
                            <app-card>
                                <template slot="header">
                                    <p  class="header-text" >
                                        reCAPTCHA Keys
                                        <el-tooltip placement="top-start" effect="light">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Collect reCAPTCHA keys according to the reCAPTCHA Mode you used on top of this')}}.
                                                </p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <p style="margin: 0">{{ $t('You may find the API keys from here')}}: <a
                                            href="https://www.google.com/recaptcha/admin/" target="_blank"
                                            rel="noopener">Google reCaptcha Site</a>. {{ $t('Please select appropriate reCAPTCHA version when creating the API key')}}</p>
                                </template>

                                <template style="width: 100%;" slot="body">
                                    <div class="wpf_recaptcha_keys">
                                        <el-form-item label="Site Key">
                                            <el-input @change="load" type="text" size="medium" v-model="settings.site_key"
                                                :placeholder="$t('reCAPTCHA Site Key')" />
                                        </el-form-item>
                                        <el-form-item label="Secret key">
                                            <el-input @change="load" type="password" size="medium"
                                                v-model="settings.secret_key" :placeholder="$t('reCAPTCHA Secret Key')" />
                                        </el-form-item>
                                    </div>
                                </template>
                            </app-card>
                        </div>
                        <div  class="">
                            <el-form-item>
                                <div style="border-radius: 8px;" class="g-recaptcha" id="reCaptcha" :data-sitekey="settings.site_key"></div>
                            </el-form-item>
                        </div>
                        <!--validate keys-->
                    </el-form>
                    <div class="wpf_form_setting_btn" style="width: 100%;">
                        <el-button style="float: right;" v-loading="saving" :disabled="disabled" @click="saveSettings()"
                            class="payform_action " size="medium" type="primary">
                            {{ $t('Save Settings') }}
                        </el-button>
                    </div>
                </template>
            </app-card>
            <!-- <div class="payform_section_header">

                <div class="payform_section_actions">
                    <el-button v-loading="saving" :disabled="disabled" @click="saveSettings()"
                        class="payform_action wpf_new_ui_button" size="medium" type="primary">
                        {{ $t( 'Save Settings' ) }}
                    </el-button>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script type="text/babel">
import AppCard from '../Common/AppCard.vue';
export default {
    name: 'stripe_settings',
    components: {
        AppCard
    },
    data() {
        return {
            settings: {},
            uploadUrl: window.wpPayFormsAdmin.image_upload_url,
            saving: false,
            fetching: false,
            is_key_defined: false,
            siteKeyChanged: false,
            labelPosition: 'top',
            webhook_url: '',
            disabled: false
        }
    },
    methods: {
        load() {
            if (!this.validate()) {
                this.disabled = false;
                this.siteKeyChanged = false;
                return;
            } else {
                this.disabled = true;
                this.siteKeyChanged = true;
            }

            this.$nextTick(() => {
                let id = 'reCaptcha';
                let siteKey = this.settings.site_key;
                let $reCaptcha = jQuery('#' + id);
                $reCaptcha.html('');
                if (this.settings.recaptcha_version == 'v2_visible') {
                    window.___grecaptcha_cfg.clients = {};

                    if (jQuery(('#reCaptcha').length)) {
                        grecaptcha.render('reCaptcha', {
                            'sitekey': siteKey,
                            'callback': (token) => {
                                this.settings.token = token;
                                this.disabled = false;
                            }
                        });
                    }
                } else {
                    this.disabled = false;
                }
            })
        },
        getSettings() {
            this.fetching = true;
            // GlobalSettingsController@getRecaptcha
            this.$get('forms/settings/recaptcha', {})
                .then((response) => {
                    this.settings = response.settings;
                })
                .fail(error => {
                    tthis.$notify.error({
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
            if (!this.validate()) {
                return this.$notify.error({
                    title: 'Error!',
                    message: 'Missing required fields.',
                    position: 'bottom-right',
                    offset: 30
                });
            }
            this.saving = true;
            // GlobalSettingsController@saveRecaptcha
            this.$post('forms/settings/recaptcha', {
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
        validate() {
            return !!(this.settings.site_key && this.settings.secret_key);
        },
    },
    created() {
        let recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js');
        document.body.appendChild(recaptchaScript);
    },
    mounted() {
        this.getSettings();
        window.WPPayFormsBus.$emit('site_title', 'reCAPTCHA Settings');
        if (window.outerWidth < 500) {
            this.labelPosition = "top";
        }
    }
}
</script>

<style lang="scss" scoped>
.el-radio {
    margin-bottom: 10px;
}
</style>