<template>
    <div class="custom_css_js">
        <div v-loading="fetching" class="edit_form_warpper">
            <div class="all_payforms_wrapper payform_section">
                <AppCard>
                    <template slot="header">
                        <div class="payform_section_header">
                            <h3 class="payform_section_title" style="display: flex; gap: 10px;">
                                {{ $t('Custom CSS and JS') }} <Icon icon="wpf-upgrade" />
                            </h3>
                        </div>
                    </template>
                    <template slot="body">
                        <UpgradeNotice
                                v-if="!has_pro"
                                title="Custom CSS and JS require pro version of Paymattic." style="width: 97%;"
                            />
                        <div :class="{ 'disabled_content' : !has_pro }" class="payform_section_body wpf_form_custom_css_js">
                            <div class="wpf_settings_section wpf_custom_css">
                                <div class="sub_section_header">
                                    <h3>{{ $t('Custom CSS')}}</h3>
                                    <p>{{ $t('You can write your custom CSS here for this form. This css will be applied in this current form only.')}}</p>
                                </div>
                                <hr/>
                                <div v-if="app_ready" class="sub_section_body">
                                    <p>{{ $t('You may add')}} <code>.wpf_form_wrapper_{{form_id}} </code> {{ $t('as your css selector prefix to target this specific form')}}</p>
                                    <ace-editor-css editor_id="wpf_custom_css" mode="css" v-model="custom_css"/>
                                    <br/>
                                    <span>{{ ("Please don't include")}} <code>&lt;style&gt;&lt;/style&gt;</code> tag</span>
                                </div>
                            </div>

                            <div class="wpf_settings_section wpf_custom_js">
                                <div class="sub_section_header">
                                    <h3>{{ $t('Custom Javascript')}}</h3>
                                    <p>{{ $t('Your additional JS code will run after this form initialized. Please provide valid javascript code. Invalid JS code may break the Form.')}}</p>
                                </div>
                                <hr/>
                                <div v-if="app_ready" class="sub_section_body">
                                    <div class="js_instruction">
                                        {{ $t('The Following JavaScrip variables are available that you can use')}}: <br/>
                                        <b>$form</b> : {{ $t('The Javascript DOM object of the Form')}}
                                    </div>
                                    <br/>
                                    <ace-editor-js editor_id="wpf_custom_js" mode="javascript" v-model="custom_js"/>
                                    <br/>
                                    <span>{{ $t("Please don't include")}} <code>&lt;script>&lt;/script&gt;</code> tag</span>
                                </div>
                            </div>
                        </div>
                        <div class="wpf_form_setting_btn" :class="{'disabled_content': !has_pro}" style="width: 100%;">
                            <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                                        type="primary">
                                {{ $t( 'Save CSS and JS' ) }}
                            </el-button>
                        </div>
                    </template>
                </AppCard>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import AceEditorCss from '../../Common/_ace_editor_css';
    import AceEditorJs from '../../Common/_ace_editor_js';
    import UpgradeNotice from '../../Common/UpgradeNotice.vue'
    import AppCard from '../../Common/AppCard.vue';
    import Icon from '../../Icons/Index.vue';

    export default {
        name: 'custom_css_js',
        components: {
            AceEditorCss,
            AceEditorJs,
            UpgradeNotice,
            AppCard,
            Icon
        },
        props: ['form_id'],
        data() {
            return {
                fetching: false,
                saving: false,
                custom_css: '',
                custom_js: '',
                app_ready: false,
                has_pro: window.wpPayFormsAdmin.has_pro,
            }
        },
        methods: {
            fetchSettings() {
                this.fetching = true;

                this.$get(`form/${this.form_id}/scripts`, {})
                    .then(response => {
                        this.custom_css = response.custom_css;
                        this.custom_js = response.custom_js;
                    })
                    .fail(error => {
                        this.$showAjaxError(error);
                    })
                    .always(() => {
                        this.fetching = false;
                        this.app_ready = true;
                    });
            },
            saveSettings() {
                if(!this.has_pro){
                    return;
                }
                this.saving = true;
                this.$post(`form/${this.form_id}/scripts`, {
                    custom_css: this.custom_css,
                    custom_js: this.custom_js
                })
                    .then(response => {
                        this.$notify({
                            title: 'Success',
                            message: response.message,
                            type: 'success',
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {
                        this.$showAjaxError(error);
                    })
                    .always(() => {
                        this.saving = false;
                    });
            }
        },
        mounted() {
            if(this.has_pro) {
                this.fetchSettings();
            } else {
                this.app_ready = true;
            }
        },
        beforeMount() {
            window.WPPayFormsBus.$emit('site_title', 'Custom CSS & JS Settings');
        }
    }
</script>
