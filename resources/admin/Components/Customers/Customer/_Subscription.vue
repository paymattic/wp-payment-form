<template>
    <div class="wpf_customer_content_wrapper ">
        <app-card>
            <div slot="header">
                <h3>{{ $t('Subscriptions') }}</h3>
            </div>
            <div slot="body" style="width: 100%;" class="wpf_customer_subscriptions wpf_payment_view" element-loading-text="Loading..."
                element-loading-spinner="el-icon-loading">
                <div class="wpf_customer_subscription_item" v-for="subscription in subscriptions" :key="subscription.id">
                    <div class="payment_header_left" style="min-width: min-content">
                        <div class="subscription_status">
                            <p class="head_small_title">{{ subscription.plan_name }}<span v-if="subscription.item_name && subscription.item_name !== subscription.plan_name"
                                    class="mini_title">({{ subscription.item_name }})</span>
                            </p>
                            <span :class="'wpf_paystatus_badge wpf_pay_status_' + subscription.status">
                                <Icon :icon="getPaymentStatusIcon(subscription.status)" /> {{ subscription.status }}
                            </span>
                        </div>
                        <div class="head_payment_amount">
                            <div>
                                <span class="pay_amount"
                                    v-html="getFormattedMoney(subscription.recurring_amount, subscription.currency_settings)"></span>
                                <span v-if="subscription?.original_plan?.interval_count && subscription?.original_plan?.interval_count > 1">/ {{$t('per ')}} {{subscription?.original_plan?.interval_count}} {{ subscription.billing_interval }}'s</span><span v-else>/ {{ subscription.billing_interval }}</span><span v-if="subscription.quantity > 1"> x
                                    {{ subscription.quantity }}</span>
                                <span v-show="parseInt(subscription.initial_amount)"> & Signup Fee: <em
                                        v-html="getFormattedMoney(subscription.initial_amount, subscription.currency_settings)"></em></span>
                            </div>
                            <div class="payment_date">
                                <p style="margin: 0;">Created at: {{ subscription.created_at | dateFormat('MMM DD, YYYY h:mm a') }}</p>
                                <p style="margin: 0;" v-if="subscription.expiration_at">Expired at: {{ subscription.expiration_at | dateFormat('MMMDD, YYYY h: mm a')}}</p>
                            </div>

                        </div>
                    </div>
                    <div class="payment_header_right" style="min-width: min-content">
                        <el-button size="mini" class="view-entries-btn" style="margin-bottom: 18px;">
                            <i class="el-icon-check-round"></i>
                            <el-badge :is-dot="subscription.submission.status === 'new'" class="item">
                                <router-link
                                    :to="{ name: 'entry', params: { entry_id: subscription.submission_id, form_id: subscription.form_id } }">
                                    view entry
                                </router-link>
                            </el-badge>
                        </el-button>
                        <p>
                            <i style="color:rgb(139 138 138);" class="el-icon-info"></i>
                            <span v-html="subscriptionHumanText(subscription.original_plan)"></span>
                        </p>
                        <a v-show="getSubscriptionUrl(subscription)" rel="noopener" target="_blank"
                            :href="getSubscriptionUrl(subscription)"
                            class="el-button el-button--default el-button--mini wpf_new_ui_button2">
                            View on {{ subscription.submission.payment_method }}
                        </a>
                    </div>
                </div>
                <div v-if="!subscriptions.length">
                    No subscriptions found!
                </div>
            </div>
        </app-card>
    </div>
</template>

<script>
import { getFormattedMoney, subscriptionHumanText, getSubscriptionUrl } from './customer_helper.js';
import { paymentStatusIcon } from '@admin/Components/helper.js';
// Components
import AppCard from '@admin/Components/Common/AppCard.vue';
import Icon from '@admin/Components/Icons/Index.vue';
export default {
    components: {
        AppCard,
        Icon
    },
    props: {
        subscriptions: {
            type: [Array, Object],
            required: true
        },
    },
    methods: {
        getPaymentStatusIcon(status) {
            return paymentStatusIcon(status);
        },
        subscriptionHumanText(plan) {
            return subscriptionHumanText(plan);
        },
        getSubscriptionUrl(subscription) {
            return getSubscriptionUrl(subscription);
        },
        getFormattedMoney(amount, currencySettings) {
            return getFormattedMoney(amount, currencySettings);
        }
    }
}
</script>