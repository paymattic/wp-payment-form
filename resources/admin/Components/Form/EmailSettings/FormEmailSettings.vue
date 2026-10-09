<template>
    <div>
        <div class="edit_form_warpper wpf_bg_white_shadow">
            <div  v-if="editingNotificationIndex === null" class="payform_section_header"> 
                <!-- <h3 class="payform_section_title">
                    {{title}}
                </h3> -->
                <div class="payform_breadcrumb_title" style="padding-top: 0px ;"> 
                    <a :href="formBuilderRoute">{{ form_title }}</a>
                    <Icon icon="wpf-arrow-right"/>
                    <a @click="editingNotificationIndex=null">Email</a>
                </div>

            </div>
            <div class="all_payforms_wrapper payform_section" style="position: relative;">
                <upgrade-notice v-if="!has_pro" :title="$t('Email is a pro version feature..')" :type="('cart')" style="top: 53% !important;"/>
                <div  v-if="editingNotificationIndex == null" class="payform_section_header_2">
                    <h3 class="payform_section_title">
                        {{title}}
                    </h3>
                    <div :class="{'disabled_content': !has_pro}" class="payform_section_actions">
                        <el-button v-if="editingNotificationIndex == null" @click="addNotification()"
                                    class="payform_action wpf_new_ui_button" size="medium" type="primary">
                                    <Icon icon="wpf-add"/>{{ $t( 'Add New Notification' ) }}
                        </el-button>
                        <el-button @click="editingNotificationIndex = null" type="text" size="medium" v-else class="wpf_view_all_btn">
                            View All
                        </el-button>
                    </div>
                </div>
                <div  v-else class="payform_section_header" :class="{'disabled_content': !has_pro}"> 
                    <!-- <h3 class="payform_section_title">
                        {{title}}
                    </h3> -->
                    <div class="payform_breadcrumb_title"> 
                        <a :href="formBuilderRoute">{{ form_title }}</a>
                        <Icon icon="wpf-arrow-right"/>
                        <a @click="editingNotificationIndex=null">Email</a>
                        <Icon icon="wpf-arrow-right"/>
                        <a style="color: #2F3448;">{{ title }}</a>
                    </div>
                    <div >
                        <el-button @click="editingNotificationIndex = null" class="wpf_view_all">
                           Back
                        </el-button>
                    </div>
                </div>
                <template>
                    <div v-loading="loading"
                        id="email_notifications"
                        :class="{'disabled_content': !has_pro}"
                    >
                        <notification-table v-if="editingNotificationIndex === null"
                                            @editNotification="editNotification"
                                            @duplicateNotification="duplicateNotification"
                                            @deleteNotification="deleteNotification"
                                            @saveNotification="saveNotifications"
                                            :notifications="notifications"/>
                        <div class="email_notification_editing wpf_content_wrapper_v2" v-else>
                            <div class="wppayform_sidebar_3">
                                <el-aside style="width: 100%;">
                                    <el-menu
                                            text-color="#ccc"
                                            :default-active="'index_'+editingNotificationIndex"
                                            active-text-color="#5B9BF8"
                                    >
                                        <el-menu-item
                                            v-for="(notification,notificationIndex) in notifications"
                                            :key="notificationIndex"
                                            @click="editNotification(notificationIndex)"
                                            :index="'index_'+notificationIndex">
                                            <span>{{ notification.title }}</span>
                                        </el-menu-item>
                                    </el-menu>
                                </el-aside>
                            </div>
                            <div class="wppayform_main_content_v3" style="width:75%">
                                <edit-notification
                                    :notification_actions="notification_actions"
                                    @saveNotifications="saveNotifications"
                                    :editingNotificationIndex="editingNotificationIndex"
                                    :notification.sync="notifications[editingNotificationIndex]"
                                    :merge_tags="merge_tags"
                                    :editorShortcodes="editorShortcodes"
                                    :inputs="inputs"
                                />
                            </div>
                        </div>
                    </div>
                </template>
                <!-- <template>
                    <div style="padding: 20px; background: #fff; border-radius: 0 0 8px 8px;">
                        <upgrade-notice
                        :title="$t('Send automatic email when your customers submit the form. You can send email to your customers as well as to yourself.')"/>
                    </div>
                </template> -->
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import NotificationTable from './Notifications';
    import EditNotification from './EditNotification.vue'
    import UpgradeNotice from '../../Common/UpgradeNotice.vue';
    import Icon from '../../Icons/Index.vue';
    export default {
        name: 'FormEmailSettings',
        components: {
            NotificationTable,
            EditNotification,
            UpgradeNotice,
            Icon
        },
        data() {
            return {
                form_id: this.$route.params.form_id,
                form_title: '',
                notifications: [],
                editorShortcodes: [],
                conditionals: {},
                inputs: [],
                loading: false,
                merge_tags: [],
                notification_actions: [],
                editingNotificationIndex: null,
                // Get the width of the window
                windowWidth: window.innerWidth
            }
        },
        computed: {
            title() {
                let index = this.editingNotificationIndex;
                if (index != null && this.notifications.length) {
                    let serial = index + 1;
                    return 'Editing: ' + this.notifications[this.editingNotificationIndex].title + ' (#' + serial + ')';
                }
                return this.$t('Email Notifications');
            },
            formBuilderRoute() {
                return `#/edit-form/${this.form_id}/form-builder`;
            },
        },
        methods: {
            getFormTitle() {
                this.$get(`form/${this.form_id}`, {
                })
                    .then(response => {
                        this.form_title = response.post_title;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                    });
            },
            getEmailNotifications() {
                this.loading = true;
                this.$get(`form/${this.form_id}/email`, {
                })
                    .then(response => {
                        this.notifications = response.data.notifications;
                        this.merge_tags = Object.values(response.data.merge_tags);
                        this.notification_actions = response.data.notification_actions;
                        this.editorShortcodes = response.data.shortcodes;
                        this.inputs = response.data.inputs;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            addNotification() {
                if(!this.has_pro){
                    return;
                }
                this.notifications.push({
                    title: 'Email Notification',
                    email_to: '',
                    reply_to: '',
                    email_subject: 'PayForm Submission',
                    email_body: '',
                    from_name: '',
                    from_email: '',
                    format: 'html',
                    email_template: 'default',
                    cc_to: '',
                    bcc_to: '',
                    conditions: '',
                    conditionals: {
                      'conditions': [],
                      'status': false,
                      'type': 'All'
                    },
                    sending_action: '',
                    status: 'active',
                    pdf_attachments: [],
                });
                this.editingNotificationIndex = this.notifications.length - 1;
            },
            editNotification(notificationIndex) {
                this.editingNotificationIndex = null;
                this.$nextTick(() => {
                    this.editingNotificationIndex = notificationIndex;
                });
            },
            deleteNotification(notificationIndex) {
                this.notifications.splice(notificationIndex, 1);
                this.saveNotifications();
            },
            saveNotifications(origin) {
                this.saving = true;
                // save_email_notifications
                //FormController@saveEmails
                this.$post(`form/${this.form_id}/email`, {
                    notifications: this.notifications
                })
                    .then(response => {
                         let message =  response.message
                         if (origin?.from == 'child') {
                            message = origin.title + ' is ' + origin.status 
                         }
                         this.$notify({
                            title: 'Success',
                            message: message,
                            type: 'success',
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            updateWindowWidth() {
                this.windowWidth = window.innerWidth;
            },
            duplicateNotification(notificationIndex) {
                const notification = this.notifications[notificationIndex];
                const newNotification = { ...notification };
                newNotification.title = notification.title + ' (Copy)';
                newNotification.status = 'disabled';
                this.notifications.push(newNotification);
                this.saveNotifications();
            }
        },
        created() {
            window.addEventListener('resize', this.updateWindowWidth);
        },
        destroyed() {
            window.removeEventListener('resize', this.updateWindowWidth);
        },
        mounted() {
            if (this.has_pro) {
                this.getEmailNotifications();
            }
            this.getFormTitle();
        }
    }
</script>

<style lang="scss" scoped>
.wpf_content_wrapper_v2 ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.el-menu-item{
    font-size: 13px;
    align-items: flex-start !important;
}
</style>
