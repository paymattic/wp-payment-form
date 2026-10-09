<template>
    <div class="no_shadow">
        <div class="edit_form_warpper">
            <div class="all_payforms_wrapper payform_section">
                <AppCard>
                    <template slot="header">
                        <div class="payform_section_header">
                            <h3 class="payform_section_title">
                                {{ $t('Currency and Language Settings') }}
                            </h3>
                        </div>
                    </template>
                    <template slot="body">
                        <div v-loading="fetching"  class="wpf_form_currency_settings">
                            <el-form ref="payment_settings"
                                :label-position="labelPosition"
                                :model="currency_settings"
                                label-width="220px"
                            >
                                <div class="wpf_sub_section">
                                    <div class="sub_section_body">
                                        <el-form-item :label="$t('Currency & Locale Setting')">
                                            <el-radio-group v-model="currency_settings.settings_type">
                                                <el-radio class="el_radio_dashed_button" label="global">{{ $t('As Per Global Settings') }}
                                                </el-radio>
                                                <el-radio class="el_radio_dashed_button" label="custom">{{ $t('Custom Settings') }}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <template v-if="currency_settings.settings_type == 'custom'">
                                            <div class="wpf_currency">
                                                <el-form-item label="Currency">
                                                    <el-select size="medium" filterable v-model="currency_settings.currency"
                                                            placeholder="Select Currency">
                                                        <el-option
                                                            v-for="(currencyName, currenyKey) in currencies"
                                                            :key="currenyKey"
                                                            :label="currencyName"
                                                            :value="currenyKey">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <el-form-item label="Stripe Checkout Locale">
                                                    <el-select size="medium" filterable v-model="currency_settings.locale"
                                                                placeholder="Select Stripe Checkput Language">
                                                        <el-option
                                                            v-for="(locale_name, locale_key) in locales"
                                                            :key="locale_key"
                                                            :label="locale_name"
                                                            :value="locale_key">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </el-form>
                            <div class="wpf_form_setting_btn">
                                <el-button @click="saveSettings()" class="payform_action" type="primary">
                                    {{ $t( 'Save Currency Settings' ) }}
                                </el-button>
                            </div>
                        </div>
                    </template>
                </AppCard>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import ConfirmationSettings from './_AddConfirmation';
    import AppCard from '../../Common/AppCard.vue';
    export default {
        name: 'currency_settings',
        props: ['form_id'],
        components: {
            ConfirmationSettings,
            AppCard
        },
        data() {
            return {
                fetching: false,
                currency_settings: {},
                app_ready: false,
                currencies: {},
                locales: {},
                labelPosition: 'top'
            }
        },
        methods: {
            getSettings() {
                this.fetching = true;

                //  FormController@settings
                this.$get(`form/${this.form_id}/settings`, {})
                    .then(response => {
                        this.currency_settings = response.currency_settings;
                        this.currencies = response.currencies;
                        this.locales = response.locales;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.fetching = false;
                        this.app_ready = true;
                    })
            },
            // FormController@saveSettings
            saveSettings() {
                this.saving = true;
                this.$post(`form/${this.form_id}/settings`, {
                    currency_settings: this.currency_settings,
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
                    })
            }
        },
        mounted() {
            this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Form Currency Settings');
            if(window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>