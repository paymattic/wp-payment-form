<template>
    <div class="no_shadow payform_section">
        <div v-if="has_pro">
            <div v-if="!isDbMigrated" class="wpf-addons-notice" style="text-align: center;">
                <div>
                    <p style="margin-bottom: 30px; font-size: 15px;">
                        Please activate Custom Payment module. May need to reload this page.
                    </p>
                    <el-button
                        target="_blank"
                        class="el-button el-button--danger"
                        @click="migrateMetaTables"
                    >
                        Activate Now
                    </el-button>
                </div>
            </div>
            <div v-else>
                <AppCard>
                    <template slot="header">
                        <div class="payform_section_header">
                            <!--Save settings-->
                            <h3 class="payform_section_title" style="display: flex; gap: 10px;">
                                {{ $t('Stripe Settings') }} <Icon icon="wpf-upgrade" />
                            </h3>
                            <!-- <div class="payform_section_actions">
                                <el-button @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium" type="primary">
                                    {{saving ? $t('Saving') : $t('Save')}} {{ $t('Settings')}}
                                </el-button>
                            </div> -->
                        </div>
                    </template>
                    <template slot="body">
                        <div v-loading="loading" class="payform_section_body" style="width: 100%;">
                            <el-form class="wpf_settings_section wpf_form_payment_settings" v-if="settings" label-width="180px" label-position="left">
                                <div class="wpf_card_block" v-if="payment_methods">
                                    <AppCard>
                                        <template slot="header">
                                            <div class="wpf_stripe_meta_settings" v-if="payment_methods">
                                                <div class="wpf_stripe_meta_settings_header">
                                                    <h3>{{ $t('Stripe Meta Data')}}</h3>
                                                    <h4>{{ $t('Push Form Data to Stripe')}}</h4>
                                                </div>
                                                <div class="">
                                                    <el-switch v-model="settings.push_meta_to_stripe">
                                                    </el-switch>
                                                </div>
                                            </div>
                                        </template>
                                        <template slot="body">
                                            <div v-if="settings.push_meta_to_stripe == true " class="wpf_stripe_meta_settings_body">
                                                <h3>{{ $t('Please Map meta Data for Stripe')}}</h3>
                                                <dropdown-label-repeater
                                                        :settings="settings"
                                                        :field="{ key: 'stripe_meta_data' }"
                                                        :editorShortcodes="editorShortcodes"
                                                />
                                            </div>
                                        </template>
                                    </AppCard>

                                    <el-form-item label="" class="wpf_form_payment_method">
                                        <template slot="label">
                                            <span>{{ $t('Limit accepted methods')}}</span>
                                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                                <div slot="content">
                                                    <p>
                                                        You can select which payment methods <br/>
                                                        will be available in stripe checkout page. <br/>
                                                        Please make sure you have those methods <br/>
                                                        enabled and match with your selected currency.
                                                    </p>
                                                </div>
                                                <i class="el-icon-info el-text-info"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('Check all')}}</el-checkbox>
                                        <div style="margin: 15px 0;"></div>
                                        <el-checkbox-group v-model="settings.stripe_checkout_methods">
                                            <el-checkbox
                                                    v-for="(methodName,methodKey) in stripeCheckoutMethods"
                                                    :key="methodKey"
                                                    :label="methodKey"
                                                    @change="handleCheckedStriprCheckoutMethods"
                                            >{{methodName}}</el-checkbox>
                                        </el-checkbox-group>

                                        <p v-show="settings.stripe_checkout_methods.length > 1">Please make sure the selected methods are enabled in your stripe settings and match the selected currency</p>

                                    </el-form-item>

                                    <div class="wpf_form_stripe_account">
                                        <el-form-item label="" :style="{padding: settings.stripe_account_type === 'custom' ? '0 0 10px 0' : ''}">
                                            <template slot="label">
                                                <span>{{ $t('Stripe Account')}}</span>
                                                <el-tooltip class="item" placement="bottom-start" effect="light">
                                                    <div slot="content">
                                                        <p>
                                                            You can select which stripe account <br/>
                                                            credential will be used for this form. <br/>
                                                            Select "Custom Stripe Credential" for <br/>
                                                            a different stripe account than global.
                                                        </p>
                                                    </div>
                                                    <i class="el-icon-info el-text-info"></i>
                                                </el-tooltip>
                                            </template>
                                            <el-radio-group v-model="settings.stripe_account_type">
                                                <el-radio class="el_radio_dashed_button" label="global">{{ $t('As per global settings')}}</el-radio>
                                                <el-radio class="el_radio_dashed_button"label="custom">{{ $t('Custom Stripe Credentials')}}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                    <div class="wpf_form_stripe_settings" v-if="settings.stripe_account_type == 'custom'">
                                        <el-form-item label="" class="wpf_form_stripe_mode">
                                            <template slot="label">
                                                Payment Mode
                                                <el-tooltip class="item" placement="bottom-start" effect="light">
                                                    <div slot="content">
                                                        <h3>Payment Mode</h3>
                                                        <p>
                                                            Select the payment mode. for testing <br/>
                                                            purposes you should select Test  <br/>
                                                            Mode otherwise select Live mode.
                                                        </p>
                                                    </div>
                                                    <i class="el-icon-info el-text-info"></i>
                                                </el-tooltip>
                                            </template>
                                            <el-radio-group v-model="settings.stripe_custom_config.payment_mode">
                                                <el-radio class="el_radio_dashed_button" label="live">Live Mode</el-radio>
                                                <el-radio class="el_radio_dashed_button" label="test">Test Mode</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <AppCard>
                                            <template slot="header">
                                                <h4>Please provide your <b style="color: red;">{{settings.stripe_custom_config.payment_mode | ucFirst}} API keys</b></h4>
                                                <p>You can find the API keys to <a target="_blank" rel="noopener" href="https://dashboard.stripe.com/apikeys">Stripe Dashboard</a></p>
                                            </template>
                                            <template slot="body">
                                                <div class="wpf_form_stripe_key">
                                                    <el-form-item label="Publishable key">
                                                        <template slot="label">
                                                            {{settings.stripe_custom_config.payment_mode | ucFirst}} Publishable key
                                                        </template>
                                                        <el-input v-if="settings.stripe_custom_config.payment_mode == 'test'"  type="text" size="small" v-model="settings.stripe_custom_config.test_publishable_key"
                                                                placeholder="Publishable key"/>
                                                        <el-input v-if="settings.stripe_custom_config.payment_mode == 'live'"  type="text" size="small" v-model="settings.stripe_custom_config.publishable_key"
                                                                placeholder="Publishable key"/>
                                                    </el-form-item>
                                                    <el-form-item label="">
                                                        <template slot="label">
                                                            {{settings.stripe_custom_config.payment_mode | ucFirst}} Secret key
                                                        </template>
                                                        <el-input v-if="settings.stripe_custom_config.payment_mode == 'test'" type="password" size="small" v-model="settings.stripe_custom_config.test_secret_key"
                                                                placeholder="Secret key"/>
                                                        <el-input v-if="settings.stripe_custom_config.payment_mode == 'live'" type="password" size="small" v-model="settings.stripe_custom_config.secret_key"
                                                                placeholder="Secret key"/>
                                                    </el-form-item>
                                                    <!-- <p>You can find the API keys to <a target="_blank" rel="noopener" href="https://dashboard.stripe.com/apikeys">Stripe Dashboard</a></p> -->
                                                </div>
                                            </template>
                                        </AppCard>
                                    </div>
                                </div>
                            </el-form>
                        </div>
                    </template>
                </AppCard>

                <div style="margin-top: 20px;" class="wpf_card_block" v-if="payment_methods">
                    <AppCard>
                        <template slot="header">
                            <h3>{{ $t('PayPal Settings')}}</h3>
                        </template>
                        <template slot="body"> 
                            <div class="wpf_form_paypal_settings" v-if="settings">
                                <el-form class="wpf_settings_section">
                                    <el-form-item label="">
                                        <template slot="label">
                                            <span>{{ $t('PayPal Account')}}</span>
                                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                                <div slot="content">
                                                    <p>
                                                        You can select which PayPal account <br/>
                                                        email will be used for this form. <br/>
                                                        Select "Custom PayPal ID" for a different <br/>
                                                        PayPal account than global.
                                                    </p>
                                                </div>
                                                <i class="el-icon-info el-text-info"></i>
                                            </el-tooltip>
                                        </template>
                                        <el-radio-group v-model="settings.paypal_account_type">
                                            <el-radio class="el_radio_dashed_button" label="global">{{ $t('As per global settings')}}</el-radio>
                                            <el-radio class="el_radio_dashed_button" label="custom">{{ $t('Custom PayPal ID')}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <template v-if="settings.paypal_account_type == 'custom'">
                                        <el-form-item label="">
                                            <template slot="label">
                                                Payment Mode
                                                <el-tooltip class="item" placement="bottom-start" effect="light">
                                                    <div slot="content">
                                                        <h3>Payment Mode</h3>
                                                        <p>
                                                            Select the payment mode. for testing <br/>
                                                            purposes you should select Test Mode <br/>
                                                            otherwise select Live mode.
                                                        </p>
                                                    </div>
                                                    <i class="el-icon-info el-text-info"></i>
                                                </el-tooltip>
                                            </template>
                                            <el-radio-group v-model="settings.custom_paypal_mode">
                                                <el-radio class="el_radio_dashed_button" label="live">Live Mode</el-radio>
                                                <el-radio class="el_radio_dashed_button" label="test">Test Mode</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="PayPal Email">
                                            <el-input v-if="settings.custom_paypal_mode == 'test'" type="email" v-model="settings.custom_test_paypal_id" placeholder="Custom PayPal Email" />
                                            <el-input v-if="settings.custom_paypal_mode == 'live'" type="email" v-model="settings.custom_paypal_id" placeholder="Custom PayPal Email" />
                                        </el-form-item>
                                    </template>
                                </el-form>
                            </div>
                        </template>
                    </AppCard>
                </div>

                <div class="wpf_transaction_type_settings">
                    <el-form class="wpf_settings_section" v-if="settings">
                        <el-form-item label="Transaction Type">
                            <el-radio-group v-model="settings.transaction_type">
                                <el-radio class="el_radio_dashed_button" label="product">{{ $t('Products')}} / Services</el-radio>
                                <el-radio class="el_radio_dashed_button" label="donation">{{ $t('Donations')}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="wpf_form_setting_btn" >
                    <el-button @click="saveSettings()" class="payform_action" size="medium" type="primary">
                        {{saving ? $t('Saving') : $t('Save')}} {{ $t('Settings')}}
                    </el-button>
                </div>
            </div>
        </div>
        <AppCard v-else>
            <template slot="header">
                <h3 class="payform_section_title" style="display: flex; gap: 10px;">
                    {{ $t('Stripe Settings') }} <Icon icon="wpf-upgrade" />
                </h3>
            </template>
            <template slot="body">
                <div style="height: 100vh;">
                    <upgrade-notice title="Individual form payment settings is a pro version feature." type="cart" style="top: 30%;"/>
                </div>
            </template>
        </AppCard>
        
    </div>
</template>

<script type="text/babel">
    import DropdownLabelRepeater from '../Templates/_DropdownLabelRepeater.vue';
    import FieldGeneral from '../Templates/_FieldGeneral.vue';
    import inputPopover from '../Templates/input-popover.vue';
    import _filter from 'lodash/filter';
    import UpgradeNotice from '../../Common/UpgradeNotice.vue'
    import AppCard from '../../Common/AppCard.vue';
    import Icon from '../../Icons/Index.vue';

    export default {
        name: 'payment-settings',
        props: [ 'form_id'],
        components: {
            DropdownLabelRepeater,
            FieldGeneral,
            inputPopover,
            UpgradeNotice,
            AppCard,
            Icon
        },
        data() {
            return {
                has_pro: window.wpPayFormsAdmin.has_pro,
                isDbMigrated: true,
                saving: false,
                settings: false,
                loading: false,
                payment_methods: false,
                editorShortcodes: [],
                inputs: [],
                stripeCheckoutMethods: {
                    card: 'Debit/Credit Card',
                    ideal: 'iDeal',
                    us_bank_account: 'ACH Debit',
                    sepa_debit: 'Sepa Debit',
                    alipay: 'Ali Pay',
                    fpx: 'FPX',
                    bacs_debit: 'BACS Direct Debit (UK)',
                    bancontact: 'Bancontact',
                    giropay: 'Giropay',
                    p24: 'Przelewy24 (P24)',
                    eps: 'EPS'
                },
                checkAll: false,
                isIndeterminate: false
            }
        },
        computed: {
            emailFields() {
                return _filter(this.inputs, (input) => {
                    return input.attributes.type === 'customer_email';
                });
            },
            addressFields() {
                return _filter(this.inputs, (input) => {
                    return input.attributes.type === 'address_input';
                });
            }
        },
        methods: {
            getSettings() {
                this.loading = true;
                this.$get(`form/${this.form_id}/payment-settings`, {})
                    .then(response => {
                        this.isDbMigrated = response.is_db_migrated;
                        this.settings = response.settings;
                        this.editorShortcodes = Object.values(response.shortCodes);
                        this.inputs = response.inputs;
                        this.payment_methods = response.payment_methods;
                        this.checkAll = this.settings.stripe_checkout_methods.length == Object.keys(this.stripeCheckoutMethods).length;
                        this.isIndeterminate = !this.checkAll;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            saveSettings() {
                this.saving = true;
                this.$post(`form/${this.form_id}/payment-settings`, {
                    settings: this.settings
                })
                    .then(response => {
                        this.$notify({
                            group: 'actions',
                            title: 'Settings Saved',
                            text: 'Your settings have been saved.',
                            type: 'success',
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {
                        this.$notify({
                            group: 'actions',
                            title: 'Error Saving Settings',
                            text: error.response.data.message,
                            type: 'error',
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            migrateMetaTables() {
				this.$post('forms/integration/enable', {})
                .then((response) => {
					this.$message({
						message: response.message,
						type: 'success',
						offset: 32
					});
				}).fail(error => {
                    this.$message({
                        dangerouslyUseHTMLString: true,
                        message: error.responseText,
                    });
                });
            },
             handleCheckAllChange(val) {
                this.settings.stripe_checkout_methods = val ? Object.keys(this.stripeCheckoutMethods) : [];
                this.isIndeterminate = false;
            },
            handleCheckedStriprCheckoutMethods() {
                this.checkAll = this.settings.stripe_checkout_methods.length == Object.keys(this.stripeCheckoutMethods).length;
                this.isIndeterminate = !this.checkAll;
            }
        },
        mounted() {
            this.has_pro && this.getSettings();
            jQuery('head title').text('Payment Settings :: Paymattic');
        }
    }
</script>
<style lang="scss" scoped>
.wpf_card_block {
    h3, span {
        color: var(--System-Dark, #2F3448);
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
    }
}
</style>
