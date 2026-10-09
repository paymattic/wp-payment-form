<template>
    <div v-loading="fetching">
        <div class="all_payforms_wrapper payform_section">
                <div class="payform_section_body">
                    <el-form :label-position="labelPosition" :model="settings" label-width="220px" aria-autocomplete="off">
                        <app-card> 
                            <div slot="header"> 
                                <h3 class="payform_section_title">
                                    {{ $t('Cloudflare Turnstile Settings') }}
                                </h3>
                                <div>
                                    <p>
                                        {{
                                            $t('Paymattic integrates with Cloudflare Turnstile, a free service that protects your website from spam and abuse.Please note, these settings are required only if you decide to use the Turnstile field.')
                                        }}

                                        <a href="https://www.cloudflare.com/en-gb/products/turnstile/" target="_blank">
                                            {{ $t('Read more about Cloudflare Turnstile.') }}
                                        </a>
                                    </p>
                                    <p><b>{{ $t('Please generate API key and API secret using Cloudflare Turnstile') }}</b></p>
                                </div>
                            </div>
                            <div slot="body" style="width: 100%;"> 
                                <div class="wpf_turnstile_section_body">
                                    <el-form-item>
                                        <template slot="label">
                                            {{ $t('Site Key') }}
                                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                                <div slot="content">
                                                    <h3>{{ $t('Turnstile Site Key') }}</h3>
                                                    <p>
                                                        {{ $t('Enter your Turnstile Site Key, if you do not have') }}<br />
                                                        {{ $t('a key you can register for one at the provided link.') }}<br />
                                                        {{ $t('Turnstile is a free service.') }}
                                                    </p>
                                                </div>

                                                <i class="el-icon-info el-text-info"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-input type="text" :value="settings.siteKey" v-model="settings.siteKey"
                                            @change="load" placeholder="Client Id"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <template slot="label">
                                            {{ $t('Secret Key') }}
                                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                                <div slot="content">
                                                    <h3>{{ $t('Turnstile Secret Key') }}</h3>

                                                    <p>
                                                        {{ $t('Enter your Turnstile Secret Key, if you do not have') }}<br>
                                                        {{ $t('a key you can register for one at the provided link.') }} <br>
                                                        {{ $t('Turnstile is a free service.') }}
                                                    </p>
                                                </div>

                                                <i class="el-icon-info el-text-info"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-input type="password" :value="settings.secretKey" v-model="settings.secretKey"
                                            @change="load" :placeholder="$t('Client Secret')"></el-input>
                                    </el-form-item>
                                </div>
                                <el-form-item :label="$t('Validate Keys')" v-if="siteKeyChanged" style="padding-top: 15px;">
                                    <div class="cf-turnstile" id="turnstile" :data-sitekey="settings.siteKey"
                                        data-callback="turnstileCallback"></div>
                                </el-form-item>
                                <div v-if="turnstile_status && !disabled">
                                    <p>{{ $t('Your Cloudflare Turnstile is valid') }}</p>
                                </div>
                                <div class="payform_section_actions">
                                    <el-button v-loading="saving" :disabled="disabled" @click="saveSettings()"
                                        class="payform_action wpf_new_ui_button" size="medium" type="primary">
                                        {{ $t('Save Settings') }}
                                    </el-button>
                                    <el-button v-if="settings.siteKey || settings.secretKey" type="danger" icon="el-icon-delete" size="medium" @click="clearSettings"
                                        :loading="clearing">{{ $t('Clear Settings') }}
                                    </el-button>
                                </div>
                            </div>
                        </app-card>
                    </el-form>
                </div>
        </div>
    </div>
</template>

<script>
import AppCard from '../Common/AppCard.vue';
export default {
    name: "turnstile",
    props: ["app"],
    components: {
        AppCard
    },
    data() {
        return {
            settings: {
                siteKey: "",
                secretKey: "",
            },
            turnstile_status: false,
            siteKeyChanged: false,
            labelPosition: 'top',
            disabled: false,
            saving: false,
            clearing: false,
            fetching: false
        };
    },
    methods: {
        load() {
            if (!this.validate()) {
                this.disabled = false;
                this.siteKeyChanged = false;
                return;
            } else {
                this.siteKeyChanged = true;
                this.turnstile_status = false;
            }

            this.$nextTick(() => {
                let id = '#turnstile';
                let $turnstile = jQuery(id);
                let siteKey = this.settings.siteKey;
                $turnstile.html('');

                let widgetID = turnstile.render(id, {
                    sitekey: siteKey,
                    callback: (token) => {
                        this.settings.token = token;
                    }
                });
            })
        },
        saveSettings() {
            if (!this.validate()) {
                return this.$notify.error({
                    title: 'Error!',
                    message: 'Missing required fields.',
                    offset: 30,
                    position: 'bottom-right'
                });
            }
            this.saving = true;

            this.$post('forms/settings/turnstile', {
                settings: this.settings
            })
                .then(response => {
                    console.log("save response: ", response)
                    this.turnstile_status = response.data.status;
                    this.$notify.success({
                        title: 'Success!',
                        message: response.data.message,
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
            return !!(this.settings.siteKey && this.settings.secretKey);
        },
        clearSettings() {
            this.clearing = true;
            this.$post('forms/settings/turnstile', {
                settings: "clear-settings"
            }).then(response => {
                this.turnstile_status = response.data.status;
                this.settings = { siteKey: '', secretKey: '' };
                this.$notify.success({
                    title: 'Success!',
                    message: response.data.message,
                    offset: 30
                });
            })
                .fail(error => {
                    this.turnstile_status = error.responseJSON.data.status;
                    this.$notify.error({
                        title: 'Oops!',
                        message: 'Something went wrong.',
                        offset: 30
                    });
                }).always(r => {
                    this.clearing = false;
                });
        },
        getTurnstileSettings() {
            this.$get('forms/settings/turnstile', {})
                .then(response => {
                    if (response.settings != false) {
                        this.settings = response.settings;
                        this.turnstile_status = response.status;
                    }
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
        }
    },
    mounted() {
        this.getTurnstileSettings();
        if (window.outerWidth < 500) {
            this.labelPosition = "top";
        }
    },
    created() {
        let turnstileScript = document.createElement('script');

        turnstileScript.setAttribute('src', 'https://challenges.cloudflare.com/turnstile/v0/api.js');

        document.body.appendChild(turnstileScript);
    },
};
</script>

<style lang='scss' scoped>
.payform_section_actions {
    display: flex;
    justify-content: right;
    margin-top: 20px;
}

.payform_section_title {
	color: #2F3448;
	font-family: Inter, sans-serif;
	font-size: 16px;
	font-style: normal;
	font-weight: 600;
	line-height: 22px;
    margin: 0;
}
p {
	color: #565865;
	font-family: Inter, sans-serif;
	font-size: 13px;
	font-style: normal;
	font-weight: 400;
	line-height: 20px;
    margin: 0;
    padding-top: 10px;
}

.el-form-item {
	margin: 0;
	padding: 0;
}
.wpf_turnstile_section_body {
    display: flex;
    gap: 20px;

    .el-form-item {
        width: 50%;
            .el-input {
            width: 100%;
        }
    }
    p {
        margin: 0;
        padding: 8px 0 0 0;
    }
}
</style>