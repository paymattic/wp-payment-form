<template>
    <div class="all_payforms_wrapper payform_section wpf_min_width">
        <div class="payform_section_header">
            <div>
                <h3 class="payform_section_title">{{ settings.menu_title }}</h3>
                <p class="integration_description" v-html="settings.menu_description"></p>
            </div>
            <!-- <el-col :md="6">
                <video-doc class="pull-right" :route_id="settings_key" btn_text="Video Tutorial" />
            </el-col> -->
        </div>

        <div v-if="settings.hide_on_valid && integration.status" class="integration_success_state">
            <div v-if="settings.logo" class="integration_logo">
                <img style="max-height:50px;" :src="settings.logo" alt=""/>
                <br/> <br/>
            </div>

            <p v-html="settings.discard_settings.section_description"></p>
            <el-button @click="disconnect(settings.discard_settings.data)" type="danger" plain size="medium">
                {{ settings.discard_settings.button_text }}
            </el-button>
            <el-button v-if="settings.discard_settings.show_verify" v-loading="saving"
                @click="save()"
                type="primary" plain
                size="medium">Verify Connection Again
            </el-button>


        </div>

        <div v-else v-loading="loading" class="payform_section_body" style="padding: 23px">
            <template v-if="settings.config_instruction && !integration.status">
                <div class="integration_instraction" v-html="settings.config_instruction"></div>
            </template>
            <el-form label-width="205px" label-position="left">
                <!--Site key-->
                <el-form-item v-for="(field,fieldKey) in settings.fields" :key="fieldKey">
                    <template slot="label">
                        {{ field.label }}
                        <el-tooltip v-if="field.label_tips" class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <div v-html="field.label_tips">
                                </div>
                            </div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </template>
                    <template v-if="field.type == 'authenticate-button'">
                       <el-button class="wpf_new_ui_button2" @click="authenticate(field.end_point, field.params)">{{field.button_text}}</el-button>
                    </template>
                    <template v-else-if="field.type == 'select'">
                        <el-select size="medium" v-model="integration[fieldKey]">
                            <el-option
                                v-for="(optionName, optionValue) in field.options"
                                :key="optionValue"
                                :label="optionName"
                                :value="optionValue"></el-option>
                        </el-select>
                    </template>
                    <template v-else-if="field.type == 'link'">
                        <a :target="field.target" :class="field.btn_class" :href="field.link">{{ field.link_text }}</a>
                        <p>{{ field.tips }}</p>
                    </template>
                    <template v-else>
                        <el-input size="medium" :placeholder="field.placeholder" :type="field.type"
                                  v-model="integration[fieldKey]"></el-input>
                        <p v-if="field.tips">{{ field.tips }}</p>
                    </template>
                </el-form-item>
                <!--Validate Keys-->

                <el-form-item v-if="!loading">
                    <el-button class="wpf_new_ui_button" size="medium" v-loading="saving" type="primary" plain icon="el-icon-success" @click="save">
                        {{ settings.save_button_text }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div v-if="integration.status">
                <p><i class="el-icon-success"></i> {{ settings.valid_message }}</p>
            </div>
            <div v-else>
                <p v-if="settings.invalid_message"><i class="el-icon-error"></i> {{ settings.invalid_message }}</p>
            </div>
        </div>

        <p v-if="error_message">{{ error_message }}</p>
    </div>
</template>

<script type="text/babel">
// import VideoDoc from '@/common/VideoInstruction.vue';

export default {
    name: "generalIntegration",
    props: ['settings_key'],
    components: {
        // VideoDoc
    },
    data() {
        return {
            integration: {},
            loading: false,
            saving: false,
            settings: {},
            error_message: ''
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
        save() {
            this.saving = true;
            this.$post('forms/settings/integrations',{
                settings_key: this.settings_key,
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
            this.$get('forms/settings/integrations', {
                settings_key: this.settings_key
            })
                .then(response => {
                    this.integration = response.data.integration;
                    this.settings = response.data.settings;
                })
                .fail(error => {
                    this.error_message = error.responseJSON.data.message;
                })
                .always(() => {
                    this.loading = false;
                });
        },
        disconnect(data) {
            this.integration = data;
            this.save();
        },
        authenticate(end_point, params) {
            this.loading = true;
            this.$post('forms/settings/integrations' + end_point,{
                settings_key: this.settings_key,
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
    mounted() {
        this.getIntegrationSettings();
    }
}
</script>
