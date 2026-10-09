<template>
    <el-col style="background: #fff; padding: 20px" :lg="20" :md="24" class="wpf_customer_content_wrapper">
        <p class="wpf_customer_title">Subscriptions</p>
        <hr>
        <div class="wpf_customer_subscriptions wpf_payment_view"
            element-loading-text="Loading..."
            element-loading-spinner="el-icon-loading"
        >
            <div class="wpf_customer_subscription_item" v-for="subscription in subscriptions" :key="subscription.id">
                <div class="payment_header_left">
                    <p class="head_small_title">{{subscription.plan_name}}<span class="mini_title">({{subscription.item_name}})</span></p>
                    <div class="head_payment_amount">
                        <span class="pay_amount" v-html="getFormattedMoney(subscription.recurring_amount, subscription.currency_settings)"></span>
                        <span>/{{subscription.billing_interval}}</span><span v-if="subscription.quantity > 1"> x {{subscription.quantity}}</span>
                        <span :class="'wpf_paystatus_badge wpf_pay_status_'+subscription.status">
                            <i :class="getPaymentStatusIcon(subscription.status)"></i> {{subscription.status}}
                        </span>
                        <span v-show="parseInt(subscription.initial_amount)"> & Signup Fee: <em v-html="getFormattedMoney(subscription.initial_amount, subscription.currency_settings)"></em></span>
                        <p>Created at: {{subscription.created_at | dateFormat('MMM DD, YYYY h:mm a')}}</p>
                        <p v-if="subscription.expiration_at">Expired at: {{subscription.expiration_at | dateFormat('MMM DD, YYYY h:mm a')}}</p>
                    </div>
                </div>
                <div class="payment_header_right">
                    <p>
                        <i style="color:rgb(139 138 138);" class="el-icon-info"></i>
                        <span style="font-style: italic;" v-html="subscriptionHumanText(subscription.original_plan)"></span>
                    </p>
                    <div style="margin-bottom: 18px;" v-if="view_subscription_entry_details">
                        <i class="el-icon-check-round"></i>
                        <el-badge :value="subscription.related_payments.length" class="item">
                            <SubscriptionEntryModal :related_payments="subscription.related_payments" />
                        </el-badge>
                    </div>
                    <!-- Cancel subscription feature is our next feature. So, we have disabled it for now. -->

                    <el-dropdown @command="cancelSubscription(subscription)" v-if="isCancelable(subscription)" :hide-on-click="false">
                        <span class="el-dropdown-link">
                        <i 
                            class="el-icon-more" style="transform:rotate(90deg); font-weight: 800; cursor: pointer;">
                        </i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item 
                                command="cancel-subscription"
                            >Cancel Subscription</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dialog
                        title="Confirm subscription cancelation"
                        :visible.sync="sub_cancel_modal === subscription.id"
                        v-if="canceling_subscription"
                        width="50%"
                    >
                        <h3>{{ $t('You are about to cancel this subscription') }} {{  }}}</h3>
                        <p v-if="subscription.submission.payment_method == 'stripe'">{{ $t('This will also ') }} <b>{{ $t('cancel the subscription at stripe.') }}</b>
                            {{ $t('So no further payment will be processed') }}</p>
                        <div v-else>
                            <p>{{subscription.submission.payment_method|ucFirst}} {{ $t('payment gateway does not support remote cancellation at this moment.') }}</p>
                            <p style="font-weight: bold;">{{ $t('Please cancel the subscription from ') }}{{subscription.submission.payment_method}}
                                {{ $t('dashboard too.') }}</p>
                        </div>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="sub_cancel_modal = false" class="wpf_new_ui_button2">{{ $t('Close') }}</el-button>
                            <el-button type="primary" @click="confirmCancel(subscription)" class="wpf_new_ui_button">{{ $t('Yes, cancel this subscription') }}</el-button>
                        </span>
                    </el-dialog>
                </div>
            </div>
            <div v-if="!subscriptions.length">
                No subscriptions found!
            </div>
        </div>
    </el-col>
</template>

<script>
import SubscriptionEntryModal from './SubscriptionEntryModal.vue';
export default {
    name: 'Subscriptions',
    data: function () {
        return {
            sub_cancel_modal: false,
            canceling_subscription: null,
            cancelling: false
        }
    },
    components: {
        SubscriptionEntryModal
    },
    props: ['getPaymentStatusIcon', 'subscriptions', 'getFormattedMoney', 'subscriptionHumanText', 'getSubscriptionUrl', 'view_subscription_entry_details'],
    methods: {
        // getFormattedMoney(amount, currencySettings) {
        //     return this.$store.getters.getFormattedMoney(amount, currencySettings);
        // },
        // getPaymentStatusIcon(status) {
        //     return this.$store.getters.getPaymentStatusIcon(status);
        // },
        // subscriptionHumanText(plan) {
        //     return this.$store.getters.subscriptionHumanText(plan);
        // },
        // getSubscriptionUrl(subscription) {
        //     return this.$store.getters.getSubscriptionUrl(subscription);
        // }
        cancelSubscription(subscription) {
            this.canceling_subscription = subscription;
            this.sub_cancel_modal = subscription.id;
        },
        isCancelable(subscription) {
            return (subscription.status == 'active' || subscription.status == 'trialling' || subscription.status == 'failing') && (subscription?.submission?.payment_method === 'stripe');
        },
        confirmCancel(subscription) {
            this.cancelling = true;
            this.$loading({
                target: '.el-dialog'
            })
            this.$post(`dashboard/${subscription.form_id}/entries/${subscription.submission_id}/cancel-subscription`,{ subscription : subscription })
                .then((res) => {
                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: res.data.message,
                        position: 'bottom-right'
                    });
                    this.$emit('getCustomer');
                    this.cancelling = false;
                    this.sub_cancel_modal = false;
                    this.canceling_subscription = false;
                    
                })
                .catch(errors => {
                    this.$notify.error({
                        title: "Error!",
                        offset: 30,
                        message: errors.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.cancelling = false;
                    this.sub_cancel_modal = false;
                    this.canceling_subscription = false;
                });
        },
    }
}
</script>