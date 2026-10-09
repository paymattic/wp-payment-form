<template>
    <div v-loading="loading">
        <el-alert
            v-if="fluent_pdf_below_min_supported"
            class="wpf_pdf_outdated_alert"
            type="warning"
            :closable="false"
            show-icon
        >
            <template slot="title">
                {{ $t('Fluent PDF update available') }}
            </template>
            <div>
                {{ $t('You are running Fluent PDF') }} <strong>{{ fluent_pdf_version || $t('(unknown)') }}</strong>.
                {{ $t('A newer version (2.0.0+) is available—please update. ') }}
                <a :href="fluent_pdf_plugins_url" class="wpf_pdf_outdated_alert__link">
                    {{ $t('Go to Plugins → Updates') }}
                </a>
            </div>
        </el-alert>

        <div v-if="'no' === fluent_pdf_active" class="payform_addon_insatll_section">
            <app-card>
                <div slot="header">
                    <h4 class="wpf_pdf_settings_title">{{ $t('Fluent Pdf') }}</h4>
                </div>
                <div slot="body" style="width: 100%;">
                    <div class="wpf_pdf_settings_body">
                        <div class="wpf_pdf_download_icon">
                            <Icon icon="wpf-download" />
                        </div>
                        <p>{{ $t('This is an Addon for Paymattic') }}</p>

                        <el-button
                            type="primary"
                            v-loading="installing"
                            :disabled="installing"
                            @click="installFluentPdf"
                        >
                            {{ $t('Install & Activate') }}
                        </el-button>

                        <p>
                            <a target="_blank" href="https://paymattic.com/docs/how-to-create-pdf-feed-for-form-submissions/">
                                {{ $t("See our documentation") }}
                            </a>
                        </p>
                    </div>
                </div>
            </app-card>
        </div>
        <div v-else-if="'no' === fluent_pdf_fonts_ready" class="payform_addon_insatll_section">
            <app-card>
                <div slot="header" class="wpf_pdf_header">
                    <h4>{{ $t('Fluent PDF Settings') }}</h4>
                </div>
                <div slot="body">
                    <h3>{{ $t('Fonts installation incomplete - Go to') }} <span><a :href="fluent_pdf_dashboard_url">
                        {{ $t('Fluent PDF/Dashboard') }}</a></span> {{ $t('to finish the setup') }}</h3>
                </div>
            </app-card>

        </div>
        <div v-else class="all_payforms_wrapper payform_section">
            <app-card>
                <div slot="header">
                    <h3 class="payform_section_title">
                        {{ $t('PDF Settings') }}
                    </h3>
                    <div style="display: flex; align-items: center;gap: 10px;">
                        <p style="margin-bottom: 0;">{{ $t('This global settings will be set as default for your new PDF feed for any form.Then you can customize for a specific PDF generator feed') }},
                            <a style="padding-left: 4px;"
                            target="_blank"
                            href="https://paymattic.com/docs/how-to-create-pdf-feed-for-form-submissions/">{{ $t("See our documentation") }}</a>
                        </p>
                    </div>
                </div>

                <template slot="body">
                    <div class="payform_section_body pdf_global_settings_body">
                        <!-- <el-form label-position="left" label-width="220px" aria-autocomplete="off">
                            <el-form-item class="wpf_settings_section" v-for="(field, index) of globalFields" :key="index">
                                <template slot="label">
                                    {{ field.label }}
                                    <el-tooltip v-if="field.tips" class="item" effect="light" placement="bottom-start">
                                        <div slot="content">
                                            <p v-html="field.tips"></p>
                                        </div>
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </template>
                                <template v-if="field.type == 'radio_choice'">
                                    <el-radio-group v-model="globalSettings[field.key]">
                                        <el-radio v-for="(fieldLabel, fieldValue) in field.options" :key="fieldValue"
                                            :label="fieldValue">{{ fieldLabel }}</el-radio>
                                    </el-radio-group>
                                </template>

                                <template v-else-if="field.type == 'dropdown'">
                                    <el-select v-model="globalSettings[field.key]" :placeholder="field.label">
                                        <el-option v-for="(item, itemValue) in field.options" :key="itemValue" :label="item"
                                            :value="itemValue">
                                        </el-option>
                                    </el-select>
                                </template>

                                <template v-else-if="field.type == 'dropdown-group'">
                                    <el-select v-model="globalSettings[field.key]" :placeholder="field.label">
                                        <el-option-group v-for="(group, groupLabel) in field.options" :key="groupLabel"
                                            :label="groupLabel">
                                            <el-option v-for="(item, itemValue) in group" :key="itemValue" :label="item"
                                                :value="itemValue">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </template>
                                <template v-else-if="field.type == 'number'">
                                    <el-input-number v-model="globalSettings[field.key]" size="medium"></el-input-number>
                                </template>
                                <template v-else-if="field.type == 'color_picker'">
                                    <el-color-picker v-model="globalSettings[field.key]" />
                                </template>
                            </el-form-item>
                        </el-form> -->
                        <!-- <el-row> 
                            <el-col :span="12">
                                <template slot="label">
                                    {{ $t('Paper Size') }}
                                    <el-tooltip v-if="globalFields[0]?.tips" class="item" effect="light" placement="bottom-start">
                                        <div slot="content">
                                            <p v-html="globalFields[0]?.tips"></p>
                                        </div>
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </template>
                                <template>
                                    <p></p>
                                    <el-select v-model="globalSettings['paper_size']" :placeholder=" globalFields[0]?.label">
                                        <el-option v-for="(item, itemValue) in globalFields[0].options" :key="itemValue" :label="item"
                                            :value="itemValue">
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-col>
                        </el-row> -->

                        <div v-for="(field, key) in globalFields" :key="key" class="wpf_pdf_components">
                            
                            <el-row v-if="key == 'row_1'" class="pdf-row"> 
                                <el-col :md="7" class="pdf-column" style="margin-right: 20px;"> 
                                    <div class="pdf-label">
                                        <p>{{ field[0].label }}</p>
                                        <el-tooltip class="item" effect="light" placement="top-start">
                                            <div slot="content">
                                                <p v-html="field[0].tips"></p>
                                            </div>
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </div>
                                    <template>
                                        <el-select v-model="globalSettings[field[0].key]" :placeholder="field[0].label">
                                            <el-option v-for="(item, itemValue) in field[0].options" :key="itemValue" :label="item"
                                                :value="itemValue">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                                <el-col :md="7" class="pdf-column">
                                    <div class="pdf-label">
                                        <p>{{ field[1].label }}</p>
                                    </div>
                                    <template>
                                        <el-select v-model="globalSettings[field[1].key]" :placeholder="field[1].label">
                                            <el-option v-for="(item, itemValue) in field[1].options" :key="itemValue" :label="item"
                                                :value="itemValue">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row v-if="key == 'row_2'" class="pdf-row"> 
                                <el-col :md="7" class="pdf-column" style="margin-right: 20px;"> 
                                    <div class="pdf-label">
                                        <p>{{ field[0].label }}</p>
                                    </div>
                                    <template>
                                        <el-select v-model="globalSettings[field[0].key]" :placeholder="field[0].label">
                                            <el-option-group v-for="(group, groupLabel) in field[0].options" :key="groupLabel"
                                                :label="groupLabel">
                                                <el-option v-for="(item, itemValue) in group" :key="itemValue" :label="item"
                                                    :value="itemValue">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </template>
                                </el-col>
                                <el-col :md="7" class="pdf-column"> 
                                    <div class="pdf-label">
                                        <p>{{ field[1].label }}</p>
                                    </div>
                                    <template>
                                        <template>
                                            <el-input-number v-model="globalSettings[field[1].key]" size="medium"></el-input-number>
                                        </template>
                                    </template>
                                </el-col>
                            </el-row>
                            <el-row v-if="key == 'row_3'" class="pdf-row"> 
                                <el-col :md="7" class="pdf-column" style="margin-right: 20px;"> 
                                    <div class="pdf-label">
                                        <p>{{ field[0].label }}</p>
                                    </div>
                                    <div class="wpf_pdf_input"> 
                                        <el-color-picker v-model="globalSettings[field[0].key]" show-alpha></el-color-picker>
                                        <el-input v-model="globalSettings[field[0].key]" placeholder="Select Color">
                                        </el-input>
                                    </div>
                                </el-col>
                                <el-col :md="7" class="pdf-column" style="margin-right: 20px;"> 
                                    <div class="pdf-label">
                                        <p>{{ field[1].label }}</p>
                                        <el-tooltip class="item" effect="light" placement="top-start">
                                            <div slot="content">
                                                <p v-html="field[1].tips"></p>
                                            </div>
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </div>
                                    <div class="wpf_pdf_input"> 
                                        <el-color-picker v-model="globalSettings[field[1].key]" show-alpha></el-color-picker>
                                        <el-input v-model="globalSettings[field[1].key]" placeholder="Select Color">
                                        </el-input>
                                    </div>
                                </el-col>
                                <el-col :md="7" class="pdf-column"> 
                                    <div class="pdf-label">
                                        <p>{{ field[2].label }}</p>
                                        <el-tooltip class="item" effect="light" placement="top">
                                            <div slot="content">
                                                <p v-html="field[2].tips"></p>
                                            </div>
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </div>
                                    <div class="wpf_pdf_input"> 
                                        <el-color-picker v-model="globalSettings[field[2].key]" show-alpha></el-color-picker>
                                        <el-input v-model="globalSettings[field[2].key]" placeholder="Select Color">
                                        </el-input>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row v-if="key == 'row_4'" class="pdf-row"> 
                                <el-col :md="12" class="pdf-column"> 
                                    <div class="pdf-label">
                                        <p>{{ field[0].label }}</p>
                                        <el-tooltip class="item" effect="light" placement="top-start">
                                            <div slot="content">
                                                <p v-html="field[0].tips"></p>
                                            </div>
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </div>
                                    <template>
                                        <el-radio-group v-model="globalSettings[field[0].key]" class="wpf_pdf_radio-group">
                                            <el-radio v-for="(fieldLabel, fieldValue) in field[0].options" :key="fieldValue"
                                                :label="fieldValue" class="radio-group-item">{{ fieldLabel }}</el-radio>
                                        </el-radio-group>
                                    </template>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="wpf_form_setting_btn" style="width: 100%;">
                        <el-button v-loading="saving" :disabled="disabled" @click="saveSettings()"
                            class="payform_action  wpf_button_submit_" size="medium" type="primary">
                            {{ $t('Save Settings') }}
                        </el-button>
                    </div>
                </template>
            </app-card>
        </div>
    </div>
</template>

<script>
import AppCard from '../Common/AppCard.vue';
import Icon from '../Icons/Index.vue';
export default ({
    name: "PdfSettings",
    components: {
        AppCard,
        Icon
    },
    data() {
        return {
            globalSettings: null,
            globalFields: [],
            licenseData: null,
            disabled: false,
            saving: false,
            clearing: false,
            fetching: false,
            fluent_pdf_active: 'no',
            downloadable_fonts: [],
            fluent_pdf_fonts_ready: 'no',
            fluent_pdf_dashboard_url: '',
            fluent_pdf_version: '',
            fluent_pdf_min_supported: '2.0.0',
            fluent_pdf_below_min_supported: false,
            fluent_pdf_plugins_url: '',
            loading: false,
            installing: false
        }
    },
    methods: {
        checkAddon() {
            if (undefined !== this.$route.meta.addon_slug) {
                this.addonSlug = this.$route.meta.addon_slug;
                this.addonTitle = this.$route.meta.title
            }
            return this.has_pro && undefined !== this.$route.meta.Addon && this.$route.meta.Addon === 'yes' && undefined !== this.$route.meta.addon_slug;
        },
        installFluentPdf() {
            this.installing = true;
            this.$post('wppayform-pdf/install_fluent_pdf', {})
                .then(response => {
                    this.$notify.success({
                        title:    'Success!',
                        message:  response.data.message,
                        position: 'bottom-right',
                    });
                    window.location.href = response.data.redirect_url;
                })
                .fail(error => {
                    this.$notify.error({
                        title:    'Oops!',
                        message:  error.responseJSON?.data?.message || 'Installation failed. Please try again.',
                        position: 'bottom-right',
                    });
                })
                .always(() => {
                    this.installing = false;
                });
        },
        getGlobalSettings() {
            this.$get("wppayform-pdf/get_global_settings", { verify: true })
                .then((response) => {
                    this.globalSettings = response.data.settings,
                        this.globalFields = response.data.fields
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
                    this.loading = false;
                });
        },
        saveSettings() {
            this.saving = true;
            this.$post("wppayform-pdf/save_global_settings", { settings: this.globalSettings })
                .then((response) => {
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
                });
        },

        getFluentPdfInfo() {
            console.log('getFluentPdfInfo');
            this.loading = true;
            // add end endpoint to check if the fluent pdf is installed and activated, and updatble info
            this.$get("wppayform-pdf/check_fluent_pdf_info", { verify: true })
                .then((response) => {
                    this.fluent_pdf_active = response.data.fluent_pdf_active;
                    this.downloadable_fonts = response.data.downloadable_font_files;
                    this.fluent_pdf_fonts_ready = response.data.fluent_pdf_fonts_ready || 'no';
                    this.fluent_pdf_dashboard_url = response.data.fluent_pdf_dashboard_url;
                    this.fluent_pdf_version = response.data.fluent_pdf_version || '';
                    this.fluent_pdf_min_supported = response.data.fluent_pdf_min_supported || this.fluent_pdf_min_supported;
                    this.fluent_pdf_below_min_supported = !!response.data.fluent_pdf_below_min_supported;
                    this.fluent_pdf_plugins_url = response.data.fluent_pdf_plugins_url || '';
                    if ('yes' === this.fluent_pdf_active && 'yes' === this.fluent_pdf_fonts_ready) {
                        this.getGlobalSettings();
                    } else {
                        this.loading = false;
                    }
                })
                .fail((error) => {
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {

                });
        }

    },
    mounted() {
        this.getFluentPdfInfo();
    }
})
</script>
<style lang="scss" scoped>
.app-card {
    width: 100%;
}
.wpf_pdf_outdated_alert {
    margin-bottom: 16px;

    &__link {
        margin-left: 6px;
        font-weight: 600;
        text-decoration: underline;
    }
}
</style>