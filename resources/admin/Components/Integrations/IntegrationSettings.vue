<template>
    <div class="wpf-integration-settings_wrapper" v-loading="loading"> 
        <div class="wpf-integration-settings_main" v-if="!isSettingsEmpty"> 
            <div class="wpf-integration-settings_main-header"> 
                <div class="wpf-integration-settings_main-header_title"> 
                    <img v-if="settings.logo" :src="settings.logo" class="" style="width: 80px; height: auto; padding: 2px;" />
                    <span>{{ settings.menu_title ? settings.menu_title : settings.title }}</span>
                </div>
                <div class="wpf-integration-settings_main-description"> 
                    <p v-if="settings.menu_description" v-html="settings.menu_description"></p>
                    <p v-else>{{ settings.description }}</p>
                </div>
            </div>
            <div class="wpf-integration-settings_main-content"> 
                <div v-if="integration?.status" class="settings_up_running"> 
                        <Icon icon="wpf-tick" class="tick-icon"/>
                        <p> Your {{ settings.menu_title }} is Up and Running</p>
                </div>
                <div v-if="!integration?.status" class="wpf-integration-settings_main-content_enable"> 
                    <el-switch
                        v-model="addOn.enabled"
                        @change="saveStatus"
                        active-value="yes"
                        inactive-value="no"
                    >
                    </el-switch>
                    <p v-if="addOn.enabled == 'yes'">Enabled</p>
                    <p v-else>Disabled</p>
                </div>
                <div v-if="settings.fields && !integration?.status" class="wpf-integration-settings_setup-wrapper"> 
                    <div v-for="(field, key) of settings.fields" :key="key"> 
                        <div class="wpf-integration-settings_field" v-if="field.type == 'text'"> 
                            <div class="field-label">
                                 {{ field.label }}
                                <el-tooltip v-if="field.label_tips" class="item" effect="dark" :content="field.label_tips" placement="right">
                                    <i class="el-icon-info" style="color: #aaa"></i>
                                </el-tooltip>                 
                            </div>
                            <input class="field-input" type="text" v-model="integration[key]" />
                        </div>
                        <div class="wpf-integration-settings_field" v-if="field.type == 'password'"> 
                            <div class="field-label">
                                 {{ field.label }} 
                                 <el-tooltip v-if="field.label_tips" class="item" effect="dark" :content="field.label_tips" placement="right">
                                    <i class="el-icon-info" style="color: #aaa"></i>
                                </el-tooltip>
                             </div>
                            <input class="field-input" type="password" v-model="integration[key]" />
                        </div>
                        <div class="wpf-integration-settings_field" v-if="field.type == 'textarea'"> 
                            <div class="field-label">
                                 {{ field.label }} 
                                 <el-tooltip v-if="field.label_tips" class="item" effect="dark" :content="field.label_tips" placement="right">
                                    <i class="el-icon-info" style="color: #aaa"></i>
                                </el-tooltip>
                             </div>
                            <textarea class="field-input" v-model="integration[key]"></textarea>
                            <p v-if="field.tips" style="margin: 0px">{{ field.tips }}</p>
                        </div>
                        <div class="wpf-integration-settings_field" v-if="field.type == 'link'">
                            <p>{{ field.tips }}</p> 
                            <a :href="field.link" target="_blank"><span>{{ field.link_text }}</span></a>
                        </div>
                        <template v-if="field.type == 'authenticate-button'">
                            <el-button class="wpf_new_ui_button2" @click="authenticate(field.end_point, field.params)">{{field.button_text}}</el-button>
                        </template>
                    </div>
                </div>
                <el-button v-if="settings.fields && !integration?.status" class="save_button" @click="save" :loading="saving"> {{ settings.save_button_text }}</el-button>
                <div v-if="settings.fields && integration?.status" class="settings_discard"> 
                    <el-button type="text" @click="discard" class="discard_button">{{ settings?.discard_settings?.button_text }}</el-button>
                    <!-- remove google sheet verification option to prevent new code generate --> 
                    <el-button type="text" @click="save" v-if="settings['menu_title'] !== 'Google Sheets'" class="save_button">{{$t('Verify Connection again')}}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script> 
import ArrowRight from '../Icons/ArrowRight.vue';
import Icon from '../Icons/Index.vue';
export default {
    name: "integrationSettings",
    components: {
        Icon
        // VideoDoc
    },
    data() {
        return {
            integration: {},
            loading: true,
            saving: false,
            settings: {},
            error_message: '',
            addOns: window.wpPayFormsAdmin.wppayform_addon_modules.addOns,
            integrationName: this.$route.params.integrationName,
            addOn: {}
        }
    },
    computed: {
        isSettingsEmpty() {
        // This will return true if settings is empty
        return Object.keys(this.settings).length === 0;
        }
    },
    watch: {
        settings_key() {
            this.integration = {};
            this.settings = {};
            this.getIntegrationSettings();
        }
    },
    methods: {
        saveStatus(addonKey) {
			let addonModules = {};
			jQuery.each(this.addOns, (key, addon) => {
				addonModules[key] = addon.enabled;
			});

			this.$post('forms/integration/change-status', {
				addons: addonModules
			})
				.then((response) => {
					this.$message({
						message: response.message,
						type: 'success',
						offset: 32
					});
				})
				.fail((error) => { })
				.always(() => {
                    this.getIntegrationSettings();
                 });
		},
        discard() {
            this.integration = {};
            this.save();
        },
        save() {
            this.saving = true;
            this.$post('forms/settings/integrations',{
                settings_key: this.integrationName,
                integration: this.integration
            })
                .then(response => {
                    this.$notify.success({
                        title: 'Success!',
                        message: response.data.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
                    if (response.data.redirect_url) {
                        window.location.href = response.data.redirect_url;
                        return;
                    }

                    this.integration.status = response.data.status;
                })
                .fail(error => {
                    this.integration.status = false;
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.saving = false;
                });
        },
        getIntegrationSettings() {
            this.loading = true;
            this.$get('forms/settings/integrations',{
                settings_key: this.integrationName
            })
                .then(response => {
                    this.integration = response.data.integration;
                    this.settings = response.data.settings;
                    console.log('response', response.data);
                })
                .fail(error => {
                    this.settings = {};
                    this.error_message = error.responseJSON.data.message;
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.loading = false;
                });
        },
        authenticate(end_point, params) {
            this.loading = true;
            this.$post('forms/settings/integrations' + end_point,{
                settings_key: this.integrationName,
                integration: this.integration,
            })
            .then(response => {
                if (response.data.url) {
                    window.open(response.data.url, '_blank')
                } else {
                    this.$notify.success({
                        message: response.data.message,
                        offset: 30
                    });
                }
            })
            .fail(error => {
                this.$notify.error({
                    message: error.responseJSON.data.message,
                    offset: 30
                });
            })
            .always(() => {
                this.loading = false;
            });
        },
    },
    created() {
        this.getIntegrationSettings();
        this.addOn = this.addOns[this.integrationName];
    }
}
</script>