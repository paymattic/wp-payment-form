<template>
    <div class="wpf_list_table">
        <el-table :data="notifications">
            <template slot="empty">
                <div class="wpf_empty_table">
                    <img :src="asset_url + 'images/global/empty_table.svg'" alt="empty" />
                    <p>{{ $t('No email notifications configured yet.')}}</p>
                </div>
            </template>
            <!-- <el-table-column  type="index" width="50" /> -->
            <el-table-column
                width="120"
                :label="$t('Status')">
                <template slot-scope="scope">
                    <div style="display: flex; align-items: center; gap: 8px;"> 
                        <el-switch
                            v-model="scope.row.status"
                            @change="emitSaveNotification(scope.row)"
                            active-value="active"
                            inactive-value="disabled"
                        >
                        </el-switch>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                property="title"
                width="220"
                :label="$t('Title')">
            </el-table-column>
            <el-table-column
                property="email_subject"
                :label="$t('Subject')">
            </el-table-column>
            <el-table-column
                width="240"
                :label="$t('Sending Action')">
                <template slot-scope="scope">
                    {{ humanActionName(scope.row.sending_action) }}
                </template>
            </el-table-column>
            <el-table-column
                width="130"
                :label="$t('Actions')" fixed="right">
                <template slot-scope="scope">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <el-tooltip class="item" effect="dark" :content="$t('Edit Notification')" placement="top-end">
                            <span @click="emitClick('editNotification', scope.$index)" style="cursor: pointer;">
                                <Icon icon="wpf-edit" class="wpf_action_icon"/>
                            </span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('Duplicate Notification')" placement="top-end">
                            <span @click="emitClick('duplicateNotification', scope.$index)" style="cursor: pointer;">
                                <Icon icon="wpf-duplicate" class="wpf_action_icon" />                         
                            </span>
                        </el-tooltip>
                        <!-- <remove class="pull-right" @on-confirm="emitClick('deleteNotification', scope.$index)">
                            
                            <i class="wpf-delete-activity el-icon-delete-solid" slot="icon"></i>
                        </remove> -->
                        <!-- <Icon icon="wpf-delete" /> -->
                        <el-tooltip class="item" effect="dark" :content="$t('Delete Notification')" placement="top-end">
                            <remove @on-confirm="emitClick('deleteNotification', scope.$index)">
                                <p style="font-size: 12px;" slot="info">
                                    {{$t('All the settings of this')}}<br/>
                                    {{$t('this email setup will be deleted.')}}<br/>
                                    {{$t('Are you sure to delete this?')}}
                                </p>
                                <Icon icon="wpf-delete" class="wpf_action_icon"/>
                            </remove>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script type="text/babel">
    import remove from '../../pieces/confirmation.vue';
    import Icon from '../../Icons/Index.vue';
    export default {
        name: 'notifications_table',
        props: ['notifications'],
        components: {
            remove,
            Icon
        },
        data() {
            return {
                outerVisible: false,
                deleteIndex: -1,
                asset_url: window.wpPayFormsAdmin.asset_url
            }
        },
        methods: {
            emitSaveNotification(notification) {
                this.$emit('saveNotification', { from: 'child', title: notification.title, status: notification.status });
            },
            emitClick(eventName, dataIndex) {
                this.outerVisible = false;
                this.$emit(eventName, dataIndex);
            },
            humanActionName(action) {
                let names = {
                    'wppayform/after_form_submission_complete' : 'After Form Submission',
                    'wppayform/form_payment_success' : 'After Payment Success',
                    'wppayform/form_payment_failed' : 'After Payment Failed',
                    'wppayform/send_email_after_subscription_cancel_for_user' : 'After Subscription Cancelled',
                    'wppayform/manual_trigger_notification' : 'Manual Triggered Notification',
                    'wppayform/send_reminder_email_to_user' : 'Send Reminder Email To User',
                }
                if(names[action]) {
                    return names[action];
                }
                return action;
            }
        }
    }
</script>
