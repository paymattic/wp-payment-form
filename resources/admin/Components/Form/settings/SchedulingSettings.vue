<template>
    <div>
        <div class="no_shadow">
            <div v-loading="fetching" class="edit_form_warpper">
                <div class="all_payforms_wrapper payform_section">
                    <!-- <div class="payform_section_header">
                        <h3 class="payform_section_title">
                            {{ $t('Form Scheduling & Restrictions') }}
                        </h3>
                        <div v-if="has_pro" class="payform_section_actions">
                            <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                                       type="primary">
                                {{ $t('Save Settings') }}
                            </el-button>
                        </div>
                    </div> -->
                    <div class="payform_section_body">
                        <AppCard v-if="!has_pro">
                            <template slot="header">
                                <div class="payform_section_header">
                                    <h3 class="payform_section_title" style="display: flex; gap: 10px;">
                                        {{ $t('Schedule Settings') }} <Icon icon="wpf-upgrade" />
                                    </h3>
                                </div>
                            </template>
                            <template slot="body">
                                <UpgradeNotice v-if="!has_pro"
                                title="Scheduling form will allow you to control form submissions automatically." style="width: 97%;"/>
                            </template>
                        </AppCard>
                        <form-restrictions @updateStatus="updateStatus" :form_status="form_status" :current_date_time="current_date_time" :data="settings" />
                        <div :class="{'disabled_content': !has_pro}" class="payform_section_actions" style="float: right;">
                            <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                                       type="primary">
                                {{ $t('Save Settings') }}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import FormRestrictions from './_Restrictions';
    import UpgradeNotice from '../../Common/UpgradeNotice.vue'
    import AppCard from '../../Common/AppCard.vue';
    import Icon from '../../Icons/Index.vue';
    export default {
        name: 'form_schedule_restriction_settings',
        props: ['form_id'],
        components: { FormRestrictions, UpgradeNotice, AppCard, Icon },
        data() {
            return {
                settings: {
                    limitByPayments: {},
                    limitNumberOfEntries: {},
                    scheduleForm: {},
                    requireLogin: {}
                },
                form_status: 'publish',
                fetching: false,
                saving: false,
                current_date_time: '',
                has_pro: window.wpPayFormsAdmin.has_pro
            }
        },
        methods: {
            saveSettings() {
                if(!this.has_pro){
                    return;
                }
                this.saving = true;
                this.$post(`form/${this.form_id}/schedule`, {
                    settings: this.settings,
                    form_status: this.form_status
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
                    });
            },
            updateStatus(newStatus) {
                this.form_status = newStatus;
            },
            getSettings() {
                this.fetching = true;
                this.$get(`form/${this.form_id}/schedule`, {})
                    .then((response) => {
                        this.settings = response.scheduling_settings;
                        this.form_status = response.form_status;
                        this.current_date_time = response.current_date_time
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
            }
        },
        mounted() {
            if(this.has_pro) {
                this.getSettings();
            }
            window.WPPayFormsBus.$emit('site_title', 'Scheduling Settings');
        }
    }
</script>