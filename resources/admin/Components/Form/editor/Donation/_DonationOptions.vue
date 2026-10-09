<template>
    <div class="payment_options_settings">
        <template>
            <el-row class="payment_actions" v-if="enableImage == 'yes'">
                <el-form-item class="wpf_upload_image" label="Upload Image">
                    <div class="imageUpload">
                        <div v-for="(item,index) in pricing_details.image_url" :key="index">
                            <photo-widget :product="item" />
                        </div>
                    </div>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="Show Statistics">
                    <el-switch
                        v-model="pricing_details.show_statistic"
                        active-value="yes"
                        inactive-value="no">
                    </el-switch>
                </el-form-item>
            </el-row>
            <el-row v-if="pricing_details.show_statistic == 'yes'">
                <el-form-item label="Goal amount">
                    <el-input-number
                        size="small"
                        v-model="pricing_details.donation_goals"
                        :min="0">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="Show progress bar">
                    <el-checkbox
                        true-label="yes"
                        false-label="no"
                        v-model="pricing_details.progress_bar">
                        Progress Bar
                    </el-checkbox>
                </el-form-item>
            </el-row>

            <div style="display: flex;" class="raising_amount" >
                <el-form-item :label="$t('Initial Raising Amount')"></el-form-item>
                <el-input type="number" v-model="element.field_options.intial_raising_amount " placeholder=""></el-input>
            </div>
        </template>
        <div
            class="pricing_key_pair_options">
            <el-form-item label="Predefined donation amounts">
                <key-pair-pricing :value.sync="pricing_details.multiple_pricing" enableImage='no'></key-pair-pricing>
            </el-form-item>
            <el-form-item v-if="has_pro" label="Allow custom amount">
                <el-checkbox
                    true-label="yes"
                    false-label="no"
                    v-model="pricing_details.allow_custom_amount">
                </el-checkbox>
            </el-form-item>
            <!-- Add default donation amount -->
            <div class="select_default_amount" v-if="pricing_details.multiple_pricing.length">
                <el-form-item :label="$t('Default donation amount')">
                    <el-select v-model="element.field_options.default_value" placeholder="" style="width: 25%;">
                        <el-option v-for="(multiple_pricing, index) in pricing_details.multiple_pricing" :value="index" :label="multiple_pricing.label || multiple_pricing.value" :key="index">
                            {{multiple_pricing.label || multiple_pricing.value}}
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>
            <!-- End default donation amount -->
            <!-- Gift Aid -->
            <div class="gift_aid_settings" style="margin-top: 16px;">
                <label v-if="!has_pro" class="wpf_pro_hint" style="margin-left: 220px; margin-bottom: 12px;">
                    <i class="el-icon-lock"></i>
                    Gift Aid is a pro feature. <a href="https://paymattic.com/pricing/" target="_blank">~Try pro</a>
                </label>
                <div :class="{ 'disabled_content': !has_pro }">
                    <el-form-item label="Enable Gift Aid">
                        <el-switch
                            v-model="element.field_options.enable_gift_aid"
                            active-value="yes"
                            inactive-value="no"
                            :disabled="!has_pro"
                        />
                    </el-form-item>
                    <el-form-item v-if="has_pro && element.field_options.enable_gift_aid === 'yes'" label="Gift Aid Title">
                        <el-input
                            v-model="element.field_options.gift_aid_title"
                            placeholder="Boost your donation with Gift Aid"
                            :maxlength="255"
                            class="wpf-gift-aid-title-input"
                        />
                    </el-form-item>
                    <el-form-item v-if="has_pro && element.field_options.enable_gift_aid === 'yes'" label="Gift Aid Declaration Text">
                        <el-input
                            type="textarea"
                            :rows="3"
                            v-model="element.field_options.gift_aid_declaration"
                            placeholder="Enter the Gift Aid declaration text shown to donors"
                            maxlength="2000"
                            style="display: block; width: 79%; padding-left: 210px;"
                        />
                    </el-form-item>
                </div>
            </div>
            <el-form-item v-if="has_pro" label="Collect recurring donation">
                <el-checkbox
                    true-label="yes"
                    false-label="no"
                    v-model="pricing_details.allow_recurring">
                    Allow Recurring amount
                </el-checkbox>
            </el-form-item>
            <div v-if="!has_pro" style="margin-top: 25px; margin-left: 220px;"> 
                <label class="wpf_pro_hint">
                    <i class="el-icon-lock"></i>
                    These are pro-only features. <a href="https://paymattic.com/pricing/" target="_blank">~Try pro</a>
                </label>
                <el-form-item label="Allow custom amount">
                    <el-checkbox
                        true-label="yes"
                        false-label="no"
                        disabled
                        >
                        
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="Collect recurring donation">
                    <el-checkbox
                        true-label="yes"
                        false-label="no"
                        disabled
                        >
                    </el-checkbox>
                </el-form-item>
            </div>
            <template v-if="pricing_details.allow_recurring == 'yes' && has_pro">
                <el-form-item label="Max bill time">
                    <div class="recurring_max_bill">
                        <el-input-number
                            :default="pricing_details.bill_time_max"
                            size="small"
                            v-model="pricing_details.bill_time_max"
                            :min="0">
                        </el-input-number>
                        <el-tooltip class="item" placement="top-start" effect="light">
                            <div slot="content">
                                <p>
                                    Keep 0 for unlimited recurring donations.
                                </p>
                            </div>
                            <i class="el-icon-info" />
                        </el-tooltip>
                    </div>
                </el-form-item>

                <el-form-item label="Show Interval as">
                    <el-radio-group
                        size="small"
                        v-model="pricing_details.interval_display_type">
                            <el-radio label="dropdown" key="dropdown">
                                {{ $t('Dropdown') }}
                            </el-radio>

                            <el-radio label="button" key="button">
                                {{ $t('Button') }}
                            </el-radio>
                        </el-radio-group>
                </el-form-item>
                
                <el-form-item label="Allowed bill intervals">
                    <div class="interval_selection">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Allow all</el-checkbox>
                        <el-tooltip class="item" placement="top-start" effect="light">
                            <div slot="content">
                                <p>
                                    You can check by order which will <br/>follow that order on frontend
                                </p>
                            </div>
                            <i class="el-icon-info" />
                        </el-tooltip>
                    </div>
                    <!-- <div style="margin: 15px 0;"></div> -->
                    <!-- <p>Dropdown order: {{this.pricing_details.intervals}}</p> -->
                <el-form-item :label="$t('Dropdown order:')">
                    {{ pricing_details.intervals.map(intervalLabel).join(', ') }}
                </el-form-item>
                <el-form-item :label="$t('Interval')">
                    <el-checkbox-group v-model="pricing_details.intervals" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="interval in intervalOptions" :label="interval" :key="interval">{{ intervalLabel(interval) }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                </el-form-item>

                <el-form-item :label="$t('Interval labels')" v-if="pricing_details.intervals.length">
                    <div class="interval_custom_labels">
                        <div
                            class="interval_custom_label_row"
                            v-for="interval in pricing_details.intervals"
                            :key="interval">
                            <label class="interval_custom_label_key">{{ defaultIntervalLabel(interval) }}</label>
                            <el-input
                                size="small"
                                v-model="pricing_details.interval_custom_labels[interval]"
                                :placeholder="defaultIntervalLabel(interval)">
                            </el-input>
                        </div>
                        <p class="interval_custom_labels_help" style="padding-left: 100px !important;">
                            {{ $t('Leave a field blank to use the default label.') }}
                        </p>
                    </div>
                </el-form-item>
            </template>
        </div>
    </div>
</template>
<script type="text/babel">
    import KeyPairPricing from '../Widget/KeyPairOption/_key_pair_pricing_options';
    import PhotoWidget from '../Widget/PhotoWidget/_photo_widget';


    export default {
        name: 'payment_options_settings',
        props: ['item', 'pricing_details','enableImage', 'element'],
        components: {
            KeyPairPricing,
            PhotoWidget
        },
        data() {
            return {
                checkAll: false,
                intervalOptions: this.pricing_details.interval_options,
                isIndeterminate: true,
                has_pro: window.wpPayFormsAdmin.has_pro || false
            }
        },
        created() {
            const defaults = {
                day: '', week: '', fortnight: '', month: '',
                quarter: '', half_year: '', year: ''
            };
            if (!this.pricing_details.interval_custom_labels) {
                this.$set(this.pricing_details, 'interval_custom_labels', { ...defaults });
            } else {
                Object.keys(defaults).forEach((key) => {
                    if (this.pricing_details.interval_custom_labels[key] === undefined) {
                        this.$set(this.pricing_details.interval_custom_labels, key, '');
                    }
                });
            }
            if (!this.element.field_options.enable_gift_aid) {
                this.$set(this.element.field_options, 'enable_gift_aid', 'no');
            }
            if (!this.element.field_options.gift_aid_declaration) {
                this.$set(this.element.field_options, 'gift_aid_declaration',
                    'I am a UK taxpayer and want this donation to qualify for Gift Aid. I understand that the charity will reclaim 25p for every £1 I donate and that I must have paid at least that amount in UK Income Tax and/or Capital Gains Tax during the tax year.');
            }
            if (this.element.field_options.gift_aid_title === undefined || this.element.field_options.gift_aid_title === null) {
                this.$set(this.element.field_options, 'gift_aid_title', 'Boost your donation with Gift Aid');
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.pricing_details.intervals = val ? this.intervalOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.intervalOptions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.intervalOptions.length;
            },
            defaultIntervalLabel(interval) {
                const labels = {
                    day:        this.$t('Day'),
                    week:       this.$t('Week'),
                    fortnight:  this.$t('Fortnight'),
                    month:      this.$t('Month'),
                    quarter:    this.$t('Quarter'),
                    half_year:  this.$t('Half Year'),
                    year:       this.$t('Year'),
                };
                return labels[interval] || interval;
            },
            intervalLabel(interval) {
                const custom = this.pricing_details.interval_custom_labels
                    && this.pricing_details.interval_custom_labels[interval];
                if (custom && String(custom).trim() !== '') {
                    return custom;
                }
                return this.defaultIntervalLabel(interval);
            }
        },
    }
</script>

<style scoped>
    .interval_custom_labels {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .interval_custom_label_row {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .interval_custom_label_key {
        min-width: 90px;
        font-size: 13px;
        color: #606266;
    }
    .interval_custom_labels_help {
        margin: 4px 0 0;
        font-size: 12px;
        color: #909399;
    }
    .wpf-gift-aid-title-input {
        display: block;
        width: 79%;
        padding-left: 210px;
    }
    .wpf_pro_hint {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 14px;
        background: #fff6ea;
        border: 1px solid #ffe1bb;
        border-radius: 8px;
        color: #d9820a;
        font-size: 13px;
        font-weight: 400;
        line-height: 1.4;
    }
    .wpf_pro_hint .el-icon-lock {
        font-size: 14px;
        font-weight: 700;
    }
    .wpf_pro_hint a {
        color: #c76a00;
        font-weight: 600;
        text-decoration: none;
        border-bottom: 1px solid currentColor;
        transition: color .15s ease;
    }
    .wpf_pro_hint a:hover {
        color: #a85800;
    }
</style>