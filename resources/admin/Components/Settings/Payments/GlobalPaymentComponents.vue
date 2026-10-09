<template>
    <div v-loading="fetching">
        <div class="all_payforms_wrapper payform_section wpf_global_payment_settings">
            <AppCard>
                <template slot="header">
                    <div class="payform_section_header">
                        <h3 class="payform_section_title">
                            {{ getPageName() }}
                        </h3>
                        <a v-if="'yes' === updateAvailable" v-loading="updating" style="margin: 0;"
                            element-loading-spinner="el-icon-loading" size="medium" @click=" updateToNewVersion($event)"
                            class="wpf_new_ui_button2" href="#">
                            {{ updateButtonText }}
                        </a>
                    </div>
                </template>
                <template slot="body">
                    <div class="payform_section_body" style="width: 100%;">
                        <el-row :gutter="20">
                            <div v-for="(setting, index) in settings" :key="index">
                                <el-col class="col-center" :lg="24" :md="24" v-if="setting.type === 'payment_mode'" style="padding: 0 10px 20px 10px;">
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                    </p>
                                    <el-radio-group v-model="settings[index].value">
                                        <el-radio v-for="(opt, ind) in setting.options" :key="ind" :label="ind" class="el_radio_dashed_button">{{ opt }}
                                        </el-radio>
                                    </el-radio-group>
                                </el-col>
                                <el-col class="col-center" :sm="24" v-if="setting.type === 'radio'">
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content">
                                                <p v-html="setting.tooltip">
                                                </p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <el-radio-group v-model="settings[index].value">
                                        <el-radio v-for="(opt, ind) in setting.options" :label="ind" :key="ind">{{ opt }}
                                        </el-radio>
                                    </el-radio-group>
                                </el-col>
                                <el-col :lg="12" :md="24"
                                    v-if="setting.type === 'test_pub_key' && settings.payment_mode.value === 'test'">
                                    <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                    <el-input type="text" :placeholder="setting.placeholder" v-model="settings[index].value">
                                    </el-input>
                                </el-col>
                                <el-col :lg="12" :md="24" v-if="setting.type === 'gmail'">
                                    <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                    <el-input type="gmail" :placeholder="setting.placeholder" v-model="settings[index].value">
                                    </el-input>
                                </el-col>
                                <div v-if="!is_key_defined">
                                    <el-col :lg="12" :md="24"
                                        v-if="setting.type === 'live_secret_key' && settings.payment_mode.value === 'live'">
                                        <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                        <el-input type="password" :placeholder="setting.placeholder"
                                            v-model="settings[index].value">
                                        </el-input>
                                    </el-col>
                                    <el-col :lg="12" :md="24"
                                        v-if="setting.type === 'live_pub_key' && settings.payment_mode.value === 'live'">
                                        <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                        <el-input type="text" :placeholder="setting.placeholder" v-model="settings[index].value">
                                        </el-input>
                                    </el-col>
                                </div>
                                <div v-else class="wpf_settings_section">
                                    <p>Live Publishable key and Live Secret key is defined in wp-config.php. This is good! (y)
                                    </p>
                                </div>

                                <el-col :lg="12" :md="24"
                                    v-if="setting.type === 'test_secret_key' && settings.payment_mode.value === 'test'">
                                    <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                    <el-input type="password" :placeholder="setting.placeholder" v-model="settings[index].value">
                                    </el-input>
                                </el-col>
                                <el-col :lg="12" :md="24"
                                    v-if="setting.type === 'live_webhook_key' && settings.payment_mode.value === 'live'">
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content" style="max-width: 700px;">
                                                <p v-html="setting.tooltip"></p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <el-input type="password" :placeholder="setting.placeholder" v-model="settings[index].value">
                                    </el-input>
                                </el-col>
                                <el-col :lg="12" :md="24"
                                    v-if="setting.type === 'test_webhook_key' && settings.payment_mode.value === 'test'">
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content" style="max-width: 700px;">
                                                <p v-html="setting.tooltip"></p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <el-input type="password" :placeholder="setting.placeholder" v-model="settings[index].value">
                                    </el-input>
                                </el-col>
                                <el-col :lg="12" :md="24" v-if="setting.type === 'text'">
                                    <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                    <el-input type="text" :placeholder="setting.placeholder" v-model="settings[index].value">
                                    </el-input>
                                </el-col>
                                <el-col :lg="24" :md="24" v-if="setting.type === 'image'">
                                    <p class="wpf_settings_section_inner_label">{{ setting.label }}</p>
                                    <div class="checkout-logo-wrapper">
                                        <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false"
                                            accept_x="image/png, image/jpeg" :on-error="handleUploadError"
                                            :on-success="handleUploadSuccess">
                                            <img v-if="setting.value" :src="setting.value" class="avatar" />
                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <i v-if="setting.value" class="el-icon-close avatar-close-icon"
                                            @click="() => setting.value = ''"></i>
                                    </div>
                                </el-col>
                                <el-col :lg="12" :md="24" v-if="setting.type === 'checkbox_group'">
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.title }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content">
                                                <p>
                                                    {{ setting.tooltip }}
                                                </p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <p>{{ setting.desc }}</p>
                                    <el-checkbox-group v-model="settings[index].value">
                                        <el-checkbox v-for="(opt, ind) in setting.options" :label="ind" :key="ind">{{ opt }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :lg="24" :md="24" v-if="setting.type === 'checkbox'">

                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content">
                                                <p v-html="setting.tooltip"></p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <el-checkbox :disabled="setting.is_pro_required !== false && !has_pro" true-label="yes" false-label="no"
                                        v-model="settings[index].value">{{ setting.desc }}</el-checkbox>
                                </el-col>
                                <el-col :lg="12" :md="24" v-if="setting.type === 'dropdown'" style="min-width: 300px"> 
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content">
                                                <p v-html="setting.tooltip"></p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <el-select v-model="settings[index].value" filterable placeholder="Select">
                                        <el-option v-for="(opt, ind) in setting.options" :key="ind" :label="opt"
                                            :value="ind">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :lg="12" :md="24" v-if="setting.type === 'multiple_checkbox'"> 
                                    <p class="wpf_settings_section_inner_label">
                                        {{ setting.label }}
                                        <el-tooltip v-if="setting.tooltip" placement="top-start" effect="light">
                                            <div slot="content">
                                                <p v-html="setting.tooltip"></p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </p>
                                    <el-checkbox-group v-model="settings[index].value" style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px">
                                        <el-checkbox v-for="(opt, ind) in setting.options" :label="ind" :key="ind" style="padding: 8px 16px; background: #FFF;">{{ opt }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :lg="12" :md="24" v-if="setting.type === 'verify_button'">
                                    <p v-if="verifiedStatus" style="color:green;">Authenticated: {{ verifiedMessage }}</p>
                                    <el-button style="margin: 0;" v-loading="verifying" element-loading-text="verifying..."
                                        element-loading-spinner="el-icon-loading" size="medium"
                                        @click="verifyKeys(setting.req_type, setting.method)" class="wpf_new_ui_button">
                                        {{ setting.label }}
                                    </el-button>
                                </el-col>

                                <el-col :lg="24" :md="24" v-if="setting.type === 'html_attr' && has_pro">
                                    <div v-if="has_pro" v-html="setting.value">
                                    </div>
                                </el-col>
                            </div>
                        </el-row>
                        <div v-if="route_name === 'paypal'">
                            <AppCard>
                                <template slot="header">
                                    <h3>
                                        Confirmation Page Settings
                                        <el-tooltip placement="top-start" effect="light">
                                            <div slot="content">
                                                <p>
                                                    You can choose what will show after a successful payment<br /> or if there is
                                                    any fails.
                                                </p>
                                            </div>
                                            <i class="el-icon-info" type="primary"></i>
                                        </el-tooltip>
                                    </h3>
                                </template>
                                <template slot="body">
                                    <div class="wpf_settings_section">
                                        <el-row :gutter="20">
                                            <el-col :md="24" :lg="12">
                                                <p class="wpf_settings_section_inner_label">Payment success page</p>
                                                <el-select v-if="confirmation_pages" v-model="confirmation_pages.confirmation" filterable
                                                    placeholder="Select Payment Success Redirect Page">
                                                    <el-option v-for="page in pages" :key="page.ID" :label="page.post_title"
                                                        :value="parseInt(page.ID)">
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :md="24" :lg="12">
                                                <p class="wpf_settings_section_inner_label">Payment failed page</p>
                                                <el-select v-if="confirmation_pages" v-model="confirmation_pages.failed" filterable
                                                    placeholder="Select Payment Failed Redirect Page">
                                                    <el-option v-for="page in pages" :key="page.ID" :label="page.post_title"
                                                        :value="parseInt(page.ID)">
                                                    </el-option>
                                                </el-select>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </template>
                            </AppCard>
                            <div class="wpf_settings_section">
                                <div class="recurring_payment_header">
                                    <h3>PayPal for Recurring Payments </h3>
                                </div>
                                <div class="recurring_payment_body">
                                    <span>If you use PayPal for recurring payments please set the notification URL in PayPal as
                                    bellow:</span>
                                    <el-tooltip effect="dark" content="Click to copy shortcode" title="Click to copy shortcode"
                                        placement="top">
                                        <code class="copy"
                                            @click="copyToClipboard(ipn_url)">
                                            <Icon icon="wpf-copy" />
                                            {{ ipn_url }}
                                        </code>
                                    </el-tooltip>

                                    <p>Check the <a target="_blank"
                                            href="https://paymattic.com/docs/how-to-set-paypal-ipn-in-wordpress-with-paymattic/">documentation</a>
                                    </p>

                                    <el-alert
                                        type="primary"
                                        :closable="false"
                                        show-icon>
                                            If you don't setup the IPN notification then it will still work for single payments but
                                            recurring payments will not be marked as paid for paypal subscription payments.
                                    </el-alert>
                                    <!-- <p>If you don't setup the IPN notification then it will still work for single payments but
                                        recurring payments will not be marked as paid for paypal subscription payments.</p> -->
                                </div>
                                <!-- <div v-if="has_pro" class="action_right">
                                    <el-button @click="saveSettings()" type="primary" size="medium" class="wpf_new_ui_button">
                                        Save PayPal Settings</el-button>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="wpf_global_payment_btn">
                        <!-- <a v-if="'yes' === updateAvailable" v-loading="updating" style="margin: 0;"
                            element-loading-spinner="el-icon-loading" size="medium" @click=" updateToNewVersion($event)"
                            class="wpf_new_ui_button2" href="#">
                            {{ updateButtonText }}
                        </a> -->
                        <el-button v-if="checkHasPro" v-loading="saving" @click="saveSettings()"
                            class="payform_action" size="medium" type="primary">
                            {{ $t('Save Settings') }}
                        </el-button>
                    </div>
                </template>
            </AppCard>
        </div>
    </div>
</template>
<script type="text/babel">
import UpgradeNotice from '../../Common/UpgradeNotice.vue';
import AppCard from '../../Common/AppCard.vue';
import Icon from '../../Icons/Index.vue';
export default {
    name: 'stripe_settings',
    components: {
        UpgradeNotice,
        AppCard,
        Icon
    },
    data() {
        return {
            settings: {},
            paymentAddons: window.wpPayFormsAdmin.payment_addons,
            saving: false,
            fetching: false,
            is_key_defined: false,
            labelPosition: 'top',
            webhook_url: '',
            fetchRoute: '',
            pages: [],
            confirmation_pages: {},
            route_name: '',
            ipn_url: window.wpPayFormsAdmin.ipn_url,
            verifiedMessage: false,
            verifiedStatus: false,
            verifying: false,
            isAddon: false,
            updateAvailable: '',
            addonSlug: '',
            addonUrl: '',
            updating: false
        }
    },
    watch: {
        $route(to, from) {
            this.getRoute();
            this.getSettings();
            this.getPageName();
        }
    },
    computed: {
        updateButtonText() {
            return "There is a new version of " + this.$route.name + " Payment Gateway available. Update Now";
        },
        uploadUrl() {
            const baseUrl = window.wpPayFormsAdmin.rest.url +  '/file/upload';
            let url = new URL(baseUrl);
            url.searchParams.append('_wpnonce', window.wpPayFormsAdmin.rest.nonce);
            return url.href;
        }
    },
    methods: {
        checkHasPro() {
            if (settings?.is_pro_item?.value === 'yes') {
                return window.wpPayFormsAdmin.has_pro;
            }
            return true;
        },
        getSettings() {
            this.fetching = true;
            this.isAddon = this.isItAnAddon(this.route_name);
            this.updateAvailable = '';
            // GlobalSettingsController@getStripe
            this.$get(this.fetchRoute, {
            })
                .then((response) => {
                    this.settings = response.settings;
                    this.is_key_defined = response.is_key_defined
                    this.webhook_url = response.webhook_url;
                    this.pages = response.pages;
                    this.confirmation_pages = response.confirmation_pages;
                    // In case of addon check updateavailability
                    if (this.isAddon) {
                        let updateValue = response.settings.update_available.value;
                        this.updateAvailable = updateValue.available;
                        this.addonSlug = updateValue.slug;
                        this.addonUrl = updateValue.url;
                    }
                })
                .fail(error => {
                    this.$message.error(error.responseJSON.message);
                })
                .always(() => {
                    this.fetching = false;
                });
        },
        saveSettings() {
            this.saving = true;
            // GlobalSettingsController@saveStripe
            this.$post(this.fetchRoute, {
                settings: this.settings,
                confirmation_pages: this.confirmation_pages,
            })
                .then(response => {
                    this.$notify.success({
                        title: 'Success!',
                        offset: 30,
                        message: response.message,
                        position: 'bottom-right'
                    })
                })
                .fail(error => {
                    this.$message.error(error.responseJSON.data.message);
                })
                .always(() => {
                    this.saving = false;
                });
        },
        verifyKeys(req, method) {
            this.verifying = true;
            this.$get(`settings/payments/${method}/verify`, {
                settings: this.settings
            })
                .then(response => {
                    this.verifying = false;
                    this.verifiedMessage = response.message;
                    this.verifiedStatus = response.status
                    this.saveSettings();
                })
                .fail(error => {
                    this.verifying = false;
                    this.$notify.error({
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.verifying = false;
                });
        },
        updateToNewVersion($event) {
            $event.preventDefault();
            this.updating = true;
            let data = {
                name: this.$route.name,
                slug: this.addonSlug,
                url: this.addonUrl
            }
            this.$post(`paymattic/addons/update-from-github`, data)
                .then(response => {
                    this.$notify.success({
                        title: "Success!",
                        offset: 30,
                        message: response.data.message,
                        position: 'bottom-right'
                    })
                    location.reload();
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.updating = false;
                });
        },
        handleUploadSuccess(response) {
            this.settings.checkout_logo.value = response.data.file.url;
        },
        handleUploadError(error) {
            this.$message.error(error.toString());
        },
        getRoute() {
            this.route_name = this.$route.name;
            let addon = this.isItAnAddon(this.route_name);

            if (this.$route.name === 'stripe') {
                this.fetchRoute = 'forms/settings/stripe';
            }
            else if (this.$route.name === 'offline') {
                this.fetchRoute = 'forms/settings/offline';
            } else if (this.$route.name === 'paypal') {
                this.fetchRoute = 'settings/paypal';
            } else if (true === addon) {
                this.fetchRoute = `settings/payments/${this.$route.name}`
            } else {
                this.fetchRoute = `settings/payments/${this.$route.name}`;
            }
        },
        isItAnAddon(name) {
            for (const key in this.paymentAddons) {
                if (key === name) {
                    this.addonSlug = this.paymentAddons[key].slug
                    this.addonUrl = this.paymentAddons[key].url
                    return true;
                }
            }
            return false;
        },
        getPageName() {
            let pageName = ''
            if (this.$route.meta.title) {
                pageName = this.$route.meta.title + ' Settings';
            } else {
                pageName = this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1).toLowerCase() + ' Settings';
            }
            return pageName;
        },
        copyToClipboard(text) {
      // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';  // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
            this.$message.success('Copied to clipboard');
            } else {
            this.$message.error('Failed to copy');
            }
        } catch (err) {
            console.error('Failed to copy text:', err);
            this.$message.error('Failed to copy');
        }

        // Remove the temporary textarea element
        document.body.removeChild(textarea);
        }
    },
    mounted() {
        this.getRoute();
        this.getSettings();
        window.WPPayFormsBus.$emit('site_title', this.getPageName());
        if (window.outerWidth < 500) {
            this.labelPosition = "top";
        }
    }
}
</script>

<style lang="scss" scoped>
.checkout-logo-wrapper {
    position: relative;
}

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

.avatar-close-icon {
    position: absolute;
    top: 4px;
    left: 4px;
    font-size: 20px;
    padding: 2px;
    color: #FF7518;
    cursor: pointer;

    &:hover {
        color: #FFB380;
        //font-size: 25px;
    }
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
    width: auto;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}



.el-col {
    padding-bottom: 20px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>