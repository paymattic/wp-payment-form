<template>
    <div>
        <el-form-item :label="item.label">
            <el-radio-group class="wpf_block_items" v-model="checkout_settings.style">
                <el-radio v-for="(checkoutStyle, checkoutStyleName) in normalizedCheckoutStyles" :key="checkoutStyleName" :label="checkoutStyleName">{{checkoutStyle}}</el-radio>
            </el-radio-group>
        </el-form-item>

        <template v-if="checkout_settings.style == 'stripe_checkout'">
            <el-form-item label="Place a hold on a payment">
                <el-switch
                    v-model="checkout_settings.place_a_hold_on_stripe"
                    active-value="yes"
                    inactive-value="no"
                    @change="showWarning(checkout_settings.place_a_hold_on_stripe)"
                    >
                </el-switch>
            </el-form-item>
            <el-form-item label="Require Billing info">
                <el-switch
                    v-model="checkout_settings.require_billing_info"
                    active-value="yes"
                    inactive-value="no">
                </el-switch>
            </el-form-item>
        </template>
        <template v-if="checkout_settings.style === 'embedded_form'">
            <el-form-item label="Place a hold on a payment">
                <el-switch
                    v-model="checkout_settings.place_a_hold_on_stripe"
                    active-value="yes"
                    inactive-value="no"
                    @change="showWarning(checkout_settings.place_a_hold_on_stripe)"
                    >
                </el-switch>
            </el-form-item>
        </template>
        <el-dialog
            title="Warning!"
            :visible.sync="showWarningDialog"
            width="40%"
            :modal="false"
            :center="true"
            :lock-scroll="false"
            :before-close="handleClose">
            <span class="wp-payform_warning">{{$t('Stripe will place a hold on the payment method, basically when you create a payment, you can place a hold on an eligible payment method to reserve funds that you can capture later. If the payment is not captured before expiring date, the hold amount will be released to the customer"s account.')}} <br/> <span style="color: #232426;">{{$t("To know how place a hold on a payment method works and it's benefits read the")}} <a href="https://paymattic.com/docs/stripe-payment-hold-in-paymattic/" target="_blank">documentation</a></span></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doNotHoldOnStripe">Cancel</el-button>
                <el-button type="primary" @click="makeHoldOnStripe">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'stripeCheckoutSettings',
        props: ['checkout_settings', 'item_name', 'item'],
        data() {
            return {
                checkoutStyles: {
                    'stripe_checkout': 'Stripe Hosted Checkout (Recommended)',
                    'embedded_form': 'Embedded Checkout Field'
                },
                showWarningDialog: false,
            }
        },
        computed: {
            normalizedCheckoutStyles() {
               if (this.checkout_settings.style === 'embeded_form') {
                   return {
                       'stripe_checkout': 'Stripe Hosted Checkout (Recommended)',
                       'embeded_form': 'Embedded Checkout Field'
                   };
               } else {
                    return {
                        'stripe_checkout': 'Stripe Hosted Checkout (Recommended)',
                        'embedded_form': 'Embedded Checkout Field'
                    };
                }
            }
        },
        methods: {
            showWarning(field) {
                if(field === 'yes') {
                    this.showWarningDialog = true;
                }
            },
            handleClose(done) {
                this.$confirm('Are you sure to close this?')
                .then(_ => {
                    this.checkout_settings.place_a_hold_on_stripe = 'no';
                    done();
                })
                .catch(_ => {});
            },
            makeHoldOnStripe() {
                this.showWarningDialog = false;
                this.checkout_settings.place_a_hold_on_stripe = 'yes';
            },
            doNotHoldOnStripe() {
                this.showWarningDialog = false;
                this.checkout_settings.place_a_hold_on_stripe = 'no';
            }
        },
    }
</script>

<style scoped>
    .wp-payform_warning {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: rgb(201 102 42);
        word-break: break-word;
    }
    .el-dialog__wrapper .el-dialog__body .dialog-footer{
        margin: 0px !important;
    }
</style>