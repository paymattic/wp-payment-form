<template>
    <el-form :class="{'disabled_content': !has_pro}" ref="form-bottom" label-width="220px" label-position="left">

        <AppCard :body="false" :footer="false">
            <div slot="header" class="schedule_card_heading">
                <div class="heading">
                    <h3>{{ $t('Form Status') }}</h3>
                    <p>{{ $t('Change the status of the form to either active or inactive.') }}</p>
                </div>
                <el-switch v-model="form_status" active-value="publish" inactive-value="draft" @change="updateStatus" />
            </div>
        </AppCard>


        <AppCard>
            <div slot="header" class="schedule_card_heading">
                <div class="heading">
                    <h3>{{ $t('Maximum Number of Entries') }}</h3>
                    <p>{{ $t('Enter a number to restrict the amount of entries permitted on this form. When that limit is reached, the form will become inactive.') }}</p>
                </div>
                <el-switch active-value="yes" inactive-value="no" v-model="form.limitNumberOfEntries.status"></el-switch>
            </div>

            <div slot="body" class="schedule_card_body">
                <div v-if="form.limitNumberOfEntries.status == 'yes'" class="conditional-items schedule_body">
                    <div class="inputs_wrapper">
                        <div  class="schedule_input_wrapper">
                            <label> {{ $t('Maximum Entries') }}</label>
                            <el-input-number style="width: 100%;" :min="0" v-model="form.limitNumberOfEntries.number_of_entries"
                            ></el-input-number>
                        </div>

                        <div  class="schedule_input_wrapper">
                            <label> {{ $t('For') }}</label>
                            <el-select v-model="form.limitNumberOfEntries.limit_type">
                                <el-option v-for="(label, period) in entryPeriodOptions" :key="period"
                                        :label="label" :value="period"
                                ></el-option>
                            </el-select>
                        </div>

                        <div class="schedule_input_wrapper">
                            <el-select multiple v-model="form.limitNumberOfEntries.limit_payment_statuses">
                                <el-option v-for="(label, label_value) in paymentStatuses" :key="label_value"
                                    :label="label" :value="label_value"
                                ></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="schedule_input_wrapper" style="width: 100%; margin: 20px 0px;">
                         <label>{{ $t('Message Shown on Reaching Max. Entries')}}</label>
                        <el-input v-model="form.limitNumberOfEntries.limit_exceeds_message" type="textarea"></el-input>
                    </div>
                </div>
            </div>
        </AppCard>

        <AppCard>
            <div slot="header" class="schedule_card_heading">
                <div class="heading">
                    <h3>{{ $t('Form Scheduling') }}</h3>
                    <p>{{ $t('Scheduling will be performed based on your server time.') }}</p>
                </div>
                <el-switch active-value="yes" inactive-value="no" v-model="form.scheduleForm.status"></el-switch>
            </div>

            <div slot="body" class="schedule_card_body">
                <div v-if="form.scheduleForm.status == 'yes'" class="conditional-items schedule_body">
                    <div class="inputs_wrapper">
                        <div  class="schedule_input_wrapper" style="width: calc(50% - 10px);">
                            <label> {{ $t('Submission Starts Date') }}</label>
                            <el-date-picker
                                class="el-fluid"
                                style="width: 100%;"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="form.scheduleForm.start_date"
                                type="datetime"
                                placeholder="Select date and time"
                                :picker-options="datePickerOptions">
                            </el-date-picker>
                        </div>

                        <div style="width: calc(50% - 10px);" class="schedule_input_wrapper">
                            <label> {{ $t('Submission Ends Date') }}</label>
                            <el-date-picker
                                class="el-fluid"
                                style="width: 100%;"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="form.scheduleForm.end_date"
                                type="datetime"
                                placeholder="Select date and time"
                                :picker-options="datePickerOptions">
                            </el-date-picker>
                        </div>
                    </div>

                    <div class="schedule_input_wrapper" style="width: 100%; margin: 20px 0px;">
                         <label>{{ $t('Form Waiting Message') }}</label>
                         <el-input v-model="form.scheduleForm.before_start_message" type="textarea"></el-input>
                    </div>

                     <div class="schedule_input_wrapper" style="width: 100%; margin: 20px 0px;">
                         <label>{{ $t('Form Expired Message') }}</label>
                         <el-input v-model="form.scheduleForm.expire_message" type="textarea"></el-input>
                    </div>
                </div>
            </div>
        </AppCard>

        <AppCard>
            <div slot="header" class="schedule_card_heading">
                <div class="heading">
                    <h3>{{ $t('Limit by payments')}}</h3>
                    <p>{{ $t('Enter an amount below to limit the number of payments for this form. The form will become inactive once this amount is reached.') }}</p>
                </div>
                <el-switch active-value="yes" inactive-value="no" v-model="form.limitByPayments.status"></el-switch>
            </div>

            <div slot="body" class="schedule_card_body">
                <div v-if="form.limitByPayments.status == 'yes'" class="conditional-items schedule_body">

                    <div class="schedule_input_wrapper" style="width: 100%; padding-bottom: 20px;">
                         <label>{{ $t('Limit Amount') }}</label>
                         <el-input-number :min="0" v-model="form.limitByPayments.payment_limit"></el-input-number>
                    </div>

                     <div class="schedule_input_wrapper" style="width: 100%;">
                         <label>{{ $t('Message to show') }}</label>
                         <el-input v-model="form.limitByPayments.limit_exceeds_message" type="textarea"></el-input>
                    </div>
                </div>
            </div>
        </AppCard>

        <!--Require user to be logged in-->
        <AppCard>
            <div slot="header" class="schedule_card_heading">
                <div class="heading">
                    <h3>{{ $t('Login Requirement Settings')}}</h3>
                    <p>{{ $t('Check this option to require a user to be logged in to view this form.') }}</p>
                </div>
                <el-switch  active-value="yes" inactive-value="no" v-model="form.requireLogin.status"></el-switch>
            </div>

            <div slot="body" class="schedule_card_body">
                <div v-if="form.requireLogin.status == 'yes'" class="conditional-items schedule_body">
                    <div class="schedule_input_wrapper" style="width: 100%;">
                        <div style="display: flex; gap: 4px; align-items: center;">
                            <label>{{ $t('Require Login Message') }}</label>
                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <p> Enter a message to be displayed to users who <br> are not logged in (shortcodes and HTML are supported).</p>
                                </div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>
                         <el-input type="textarea" v-model="form.requireLogin.message"></el-input>
                    </div>
                </div>
            </div>
        </AppCard>

        <AppCard v-if="hasAnyRestriction">
            <div slot="header" class="schedule_card_heading">
                <div class="heading">
                    <h3>{{ $t('Form Display option when restrictions is met')}}</h3>
                </div>
            </div>

            <div slot="body" class="schedule_card_body">
                <div class="conditional-items schedule_body">
      
                    <div  class="schedule_input_wrapper" style="width: 100%;">
                        <div style="display: flex; gap: 4px; align-items: center;">
                            <label>{{ $t('Restricted Form Status') }}</label>
                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <p> You can show / hide the form inputs if any restrictions is met</p>
                                </div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>
                        <el-radio-group v-model="form.restriction_applied_type" class="schedule_radio_btn">
                            <el-radio class="el_radio_dashed_button" label="hide_form">{{ $t('Hide Form')}}</el-radio>
                            <el-radio class="el_radio_dashed_button" label="hide_submit_button">{{ $t('Hide Submit Button')}}</el-radio>
                            <el-radio class="el_radio_dashed_button" label="validation_failed">{{ $t('Make validation failed after submit')}}</el-radio>
                        </el-radio-group>
                    </div>

                </div>
            </div>
        </AppCard>
    </el-form>
</template>

<script>
    import AppCard from '@admin/Components/Common/AppCard.vue';

    export default {
        name: 'FormRestrictions',
        components: { AppCard },
        props: {
            data: {
                required: true
            },
            current_date_time: {
                required: false,
                type: String
            },
            form_status: {
                required: false,
                type: String,
                default: 'publish'
            }
        },
        data() {
            return {
                entryPeriodOptions: {
                    total: 'Total Entries',
                    day: 'Per Day',
                    week: 'Per Week',
                    month: 'Per Month',
                    year: 'Per Year',
                },
                paymentStatuses: window.wpPayFormsAdmin.paymentStatuses,
                datePickerOptions: {
                    shortcuts: [
                        {
                            text: 'Today',
                            onClick(picker) {
                                picker.$emit('pick', new Date());
                            }
                        },
                        {
                            text: 'Tomorrow',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        },
                        {
                            text: 'Yesterday',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        },
                        {
                            text: 'A week after',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                            }
                        }
                    ]
                },
                has_pro: window.wpPayFormsAdmin.has_pro,
            }
        },
        computed: {
            form() {
                return this.data;
            },
            hasAnyRestriction() {
                if(
                    this.data.limitNumberOfEntries.status == 'yes' ||
                    this.data.scheduleForm.status == 'yes' ||
                    this.data.requireLogin.status == 'yes'
                ) {
                    return true;
                }
                return false;
            }
        },
        methods: {
            updateStatus() {
                this.$emit('updateStatus', this.form_status);
            }
        }
    }
</script>

<style lang="scss" scoped>
.schedule_card_heading {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
}
.schedule_card_body {
    width: 100%;
    .schedule_body {
        // padding: 20px;
        // border-top: 1px solid #EAECF0;
        .inputs_wrapper {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            align-items: flex-end;
        }
    }
}
.schedule_input_wrapper {
    width: calc(33% - 11px);
    display: flex;
    flex-direction: column;
    gap: 10px;
    label {
        font-weight: 500;
        font-size: 14px;
        color: #333;
    }
}
.app-card-header {
    padding-bottom: 10px !important;
    &:has(.schedule_card_heading) {
        border-bottom: 0;
    }
}
.app-card-body {
    &:has(.schedule_card_body) {
        padding: 0;
    }
}
.schedule_radio_btn {
    display: flex;
    gap: 10px;
    margin-top: 4px;
    .el-radio {
        margin-right: 0px;
    }
}
</style>
