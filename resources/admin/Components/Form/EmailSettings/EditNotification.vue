<template>
    <div v-loading="loading" class="wpf_inputs_new_ui">
        <el-form v-if="editingNotificationIndex != null" ref="notificationForm" class="payform_hide_valdate_messages" :show-message="showErrorMessage" :rules="rules" label-position="top" :model="form" label-width="120px">
            <el-form-item prop="title" :label="$t('Notification Title')">
                <el-input size="small" :placeholder="$t('Notification Title')" v-model="form.title"></el-input>
            </el-form-item>
            <div class="payform_form_item_wrapper">
                <el-form-item prop="email_to" class="payform_item_half" :label="$t('Email To')">
                    <el-input size="small" :placeholder="$t('Email To')" v-model="form.email_to">
                        <popover
                            @command="(code) => { form.email_to += code }"
                            slot="suffix" :data="merge_tags"
                            btnType="text"
                            buttonText=''>
                        </popover>
                    </el-input>
                </el-form-item>
                <el-form-item class="payform_item_half" :label="$t('Reply To')">
                    <el-input size="small" :placeholder="$t('Reply To')" v-model="form.reply_to">
                        <popover
                            @command="(code) => { form.reply_to += code }"
                            slot="suffix" :data="merge_tags"
                            btnType="text"
                            buttonText=''>
                        </popover>
                    </el-input>
                </el-form-item>
            </div>
            <el-form-item prop="email_subject" :label="$t('Email Subject')">
                <el-input size="small" :placeholder="$t('Email Subject')" v-model="form.email_subject">
                    <popover
                        @command="(code) => { form.email_subject += code }"
                        slot="suffix" :data="merge_tags"
                        btnType="text"
                        buttonText=''>
                    </popover>
                </el-input>
            </el-form-item>
            <el-form-item prop="email_body" :label="$t('Email Body')">
                <wp-editor
                    :editor_id="'wp_email_editor_'+editingNotificationIndex"
                    v-model="form.email_body"
                    :editorShortcodes="merge_tags"
                />
            </el-form-item>

            <p>{{ $t('Conditional Logics')}} </p>
            <el-form-item>
              <filter-fields
                  :fields="inputs"
                  :conditionals="form['conditionals']"
                  :editorShortcodes="editorShortcodes"
                  :disabled="!has_pro"
              />
            </el-form-item>

            <el-form-item v-loading="loading" v-if="pdf_feeds.length > 0">
                <template slot="label">
                    {{ $t('PDF Attachments') }}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>{{ $t('PDF Attachments') }}</h3>
                            <p>
                                {{ $t('You can select PDF attachments from your created PDF templates') }}
                            </p>
                        </div>
                        <i class="el-icon-info el-text-info"></i>
                    </el-tooltip>
                </template>
                <el-checkbox-group v-model="form.pdf_attachments">
                      <el-checkbox v-for="feed in pdf_feeds" :key="feed.id" :label="feed.id">{{ feed.name }}
                    </el-checkbox>
                </el-checkbox-group>
               
            </el-form-item>

            <el-form-item prop="sending_action" :label="$t('When to send this email (Please Select when the email will be sent)')">
                <el-radio-group v-model="form.sending_action" class="wpf_radio-group">
                   
                    <el-radio v-for="sending_hook in notification_actions" :key="sending_hook.hook_name" class="radio-group-item"
                            :label="sending_hook.hook_name">
                            {{sending_hook.hook_title}}
                            <el-tooltip class="item" content="Bottom Left prompts info" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <p>
                                        {{ sending_hook.description  }}
                                    </p>
                                </div>
                                <i class="el-icon-info el-text-info"></i>
                            </el-tooltip>
                    </el-radio>
                </el-radio-group>

                <div class="wpf_refund_timing" style="padding-top: 20px;" v-if="form.sending_action === 'wppayform/send_reminder_email_to_user'">
                    <label class="wpf_refund_timing_label" style="display: block; line-height: 30px !important;">Send reminder</label>
                    <el-radio-group class="wpf_radio-group" v-model="form.reminder_time">
                        <el-radio class="radio-group-item" label="before">Before</el-radio>
                        <el-radio class="radio-group-item" label="after">After</el-radio>
                    </el-radio-group>
                </div>

                <div class="wpf_specific_date" style="padding-top: 10px;" v-if="form.sending_action === 'wppayform/send_reminder_email_to_user'">
                    <label class="wpf_specific_date_label" style="display: block; line-height: 30px !important;">Days before / after renewal</label>
                    <el-input-number  
                        v-model="form.reminder_days"
                        :min="1"
                        :max="31"
                        :size="'small'"
                        :placeholder="'Days before/after renewal'"
                        :class="'wpf_specific_date_input'"
                    >  
                    </el-input-number>  
                    <el-tooltip class="item" content="Top prompts info" placement="top" effect="light">
                        <div slot="content">
                            <h3>{{ $t('Days before / after renewal') }}</h3>
                            <p>
                                {{ $t('Choose how many days before / after renewal to send the reminder') }}
                            </p>
                        </div>
                        <i class="el-icon-info el-text-info"></i>
                    </el-tooltip>
                </div>
            <div class="wpf_tooltip">

                </div>
            </el-form-item>
            <div class="wpf_collapse"> 
                <el-collapse v-model="showAdvanced" accordion>
                    <el-collapse-item title="Advanced Settings" name="advanced_settings">
                        <div class="payform_form_item_wrapper">
                            <el-form-item class="payform_item_half" :label="$t('From Name')">
                                <el-input size="small" :placeholder="$t('From Name')" v-model="form.from_name">
                                    <popover
                                        @command="(code) => { form.from_name += code }"
                                        slot="suffix" :data="merge_tags"
                                        btnType="text"
                                        buttonText=''>
                                    </popover>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="payform_item_half" :label="$t('From Email')">
                                <el-input size="small" :placeholder="$t('From Email')" v-model="form.from_email">
                                    <popover
                                        @command="(code) => { form.from_email += code }"
                                        slot="suffix" :data="merge_tags"
                                        btnType="text"
                                        buttonText=''>
                                    </popover>
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="payform_form_item_wrapper">
                            <el-form-item class="payform_item_half" label="CC">
                                <el-input size="small" placeholder="CC" v-model="form.cc_to">
                                    <popover
                                        @command="(code) => { form.cc_to += code }"
                                        slot="suffix" :data="merge_tags"
                                        btnType="text"
                                        buttonText=''>
                                    </popover>
                                </el-input>
                            </el-form-item>
                            <el-form-item class="payform_item_half" label="BCC">
                                <el-input size="small" placeholder="BCC" v-model="form.bcc_to">
                                    <popover
                                        @command="(code) => { form.bcc_to += code }"
                                        slot="suffix" :data="merge_tags"
                                        btnType="text"
                                        buttonText=''>
                                    </popover>
                                </el-input>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <el-form-item class="submit_btn_right">
                <el-button size="medium" type="primary" @click="update('notificationForm')" class="wpf_primary-button">{{ $t('Update')}}</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script type="text/babel">
    import wpEditor from '../../Common/_wp_editor';
    import popover from '../../Common/input-popover-dropdown.vue'
    import FilterFields from "../Templates/FilterFields";

    export default {
        name: 'editNotification',
        components: {
            FilterFields,
            wpEditor,
            popover
        },
        props: ['notification', 'editingNotificationIndex', 'merge_tags', 'notification_actions', 'editorShortcodes', 'inputs'],
        data() {
            return {
                form: {},
                showAdvanced: '',
                rules: {
                    title: [
                        {
                            required: true, message: 'Please Provide Notification Title',
                        }
                    ],
                    email_to: [
                        {
                            required: true, message: 'Please Provide Email To', trigger: 'change'
                        }
                    ],
                    email_subject: [
                        {
                            required: true, message: 'Please Provide Email Subject',
                        }
                    ],
                    email_body: [
                        {
                            required: true, message: 'Please Provide Email Body',
                        }
                    ],
                    from_email: [
                        {
                            required: true, message: 'Please Provide Email Body'
                        }
                    ],
                    sending_action: [
                        {
                            required: true, message: 'When to send field is required'
                        }
                    ],
                    pdf_attachments: [
                       { required: false}
                    ]
                },
                pdf_feeds: [],
                showErrorMessage: false,
                has_pro: window.wpPayFormsAdmin.has_pro,
                loading: false,
                form_id: this.$route.params.form_id,
                reminder_days: '',
                reminder_time: '',
            }
        },
        watch: {
            editingNotificationIndex() {
                if (this.editingNotificationIndex != null) {
                    this.showErrorMessage = false;
                    this.form = JSON.parse(JSON.stringify(this.notification));
                }
            }
        },
        methods: {
            update(formName) {
                // validate first please
                this.showErrorMessage = true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('update:notification', JSON.parse(JSON.stringify(this.form)));
                        this.$emit('saveNotifications');
                    } else {
                         this.$notify.error({
                            title: 'Error',
                            message: 'Please provide all required fields',
                            position: 'bottom-right'
                        });
                        return false;
                    }
                });
            },
            fetchPdfFeeds() {
                this.loading = true;
                this.$get('wppayform-pdf/get_feeds', {form_id : this.form_id})
                    .then(response => {
                        this.pdf_feeds = [...response.data.pdf_feeds];
                    })
                    .fail(e => {
                        console.log(e);
                    })
                    .always(() => {
                        this.loading = false;
                    });
            }
        },
        created() {
            this.showErrorMessage = false;
            this.form = JSON.parse(JSON.stringify(this.notification));
            if ('yes' === window.wpPayFormsAdmin.fluent_pdf_active){
                this.fetchPdfFeeds();
            }
        },
    }
</script>
