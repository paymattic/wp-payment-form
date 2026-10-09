<template>
    <div v-if="subscriptions && subscriptions?.length" :class="getClasses()" id="subscription_box">
        <div class="entry_info_header">
            <div class="info_box_header">{{ $t('Subscriptions (Recurring Payments)') }}</div>
            <div v-if="!isPaymatticUser && !is_100_percent_discount">
                <div
                    v-if="(payment_method === 'stripe' || payment_method === 'square' || payment_method === 'authorizedotnet') && subscriptions[0]?.status === 'active'">
                    <el-button size="mini" class="wpf_subscription_sync_btn"
                        @click="() => this.$emit('sync_subscription')">
                        <Icon icon="wpf-sync" />
                        {{ $t('Sync') }}
                    </el-button>
                </div>
                <div v-if="payment_method === 'offline' && subscriptions[0]?.status === 'active'">
                    <el-tooltip :open-delay="100" class="item" effect="light"
                        :content="$t('Click to syncronize subscription billings.')" placement="top-start">
                        <i class="el-icon-info" />
                    </el-tooltip>
                    <el-button class="el-icon-refresh" size="medium" @click="syncOfflineSubscription">
                        {{ $t('Sync') }}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="entry_info_body">
            <div v-for="(subscription, subscriptionIndex) in subscriptions" :key="subscriptionIndex"
                class="payment_header subscripton_item">
                <div class="payment_head_top">
                    <div class="payment_header_left">
                        <p class="head_small_title">{{ subscription.plan_name }}<span v-if="subscription.item_name && subscription.item_name !== subscription.plan_name" class="mini_title">({{
                            subscription.item_name }})</span></p>

                        <div class="head_payment_amount">
                            <span class="pay_amount" v-html="getDiscountedRecurring(subscription)"></span>
                            <span v-if="subscription?.original_plan?.interval_count && subscription?.original_plan?.interval_count > 1">/ {{$t('per ')}} {{subscription?.original_plan?.interval_count}} {{ subscription.billing_interval }}'s</span><span v-else>/ {{ subscription.billing_interval }}</span><span v-if="subscription.quantity > 1"> x
                                {{ subscription.quantity }}</span>
                            <span :class="'wpf_paystatus_badge wpf_pay_status_' + subscription.status">
                                <!-- <i :class="getPaymentStatusIcon(subscription.status)"></i> {{ subscription.status }} -->
                                <Icon :icon="getPaymentStatusIcon(subscription.status)" /> {{ subscription.status }}
                            </span>
                            <span v-show="parseInt(subscription.initial_amount)"> & Signup Fee: <em
                                    v-html="getFormattedMoney(subscription.initial_amount)"></em></span>
                        </div>

                    </div>
                    <div v-if="!isPaymatticUser" class="payment_header_right">
                        <div v-if="'offline' === payment_method && !isPaymatticUser" class="payment_status_offline">
                            <div>
                                <el-dropdown :hide-on-click="false" @command="manageOfflineSubscriptionStatus">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"
                                            style="transform:rotate(90deg); font-weight: 800; cursor: pointer;">
                                        </i>
                                    </span>
                                    <el-dropdown-menu>
                                        <el-dropdown-item :command="{ type: 'change', subscription: subscription }">Change
                                            Subscription Status</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <p>
                                <span>Total Payment Received: </span><span class="table_payment_amount"
                                    v-html="subscriptionTotal(subscription.related_payments)"></span>
                            </p>
                            <p v-html="subscriptionHumanText(subscription.original_plan)"></p>
                        </div>
                        <div v-else class="wpf_payment_method">
                            <div class="subscription_payment_url">
                                <a v-show="getSubscriptionUrl(subscription)" rel="noopener" target="_blank"
                                    :href="getSubscriptionUrl(subscription)"
                                    class="el-button el-button--default el-button--mini">
                                    View on {{ payment_method }}
                                </a>
                                <el-dropdown @command="cancelSubscription(subscription)" v-if="isCancelable(subscription)"
                                    :hide-on-click="false">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-more"
                                            style="transform:rotate(90deg); font-weight: 800; cursor: pointer;"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="cancel-subscription">Cancel
                                            Subscription</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <div class="wpf_payment_amount">
                                <span>Total Payment Received: </span>
                                <span v-html="subscriptionTotal(subscription.related_payments)"></span>
                            </div>
                            <div class="wpf_payment_amount">
                                <span v-html="subscriptionHumanText(subscription.original_plan)"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="subscription?.related_payments?.length > 0" class="payment_head_bottom wpf_entry_order_items">
                    <h3>Related Payments</h3>
                    <table v-if="'offline' === payment_method" class="wp-list-table widefat table table-bordered striped">
                        <thead>
                            <tr>
                                <th>{{ $t('Amount') }}</th>
                                <th>{{ $t('Date (GMT)') }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(payment, i) in subscription.related_payments" :key="i + 99999">
                                <td>
                                    <div class="wpf_table_payment">
                                        <span class="table_payment_amount"
                                            v-html="getFormattedMoney(payment.payment_total)"></span>
                                        <span class="payment_currency">{{ payment.currency }}</span>
                                        <span class="wpf_paystatus_badge wpf_pay_status_active">{{ payment.status }}</span>
                                    </div>
                                </td>
                                <td>
                                    {{ payment.created_at | dateFormat('MMM DD, YYYY h:mm:ss a') }}
                                </td>
                                <td v-if="!isPaymatticUser">
                                    <el-dropdown v-if="subscription.status == 'active'" @command="handleActionCommand(payment)">
                                        <el-button size="mini" type="primary" class="wpf_new_ui_button">
                                            Actions <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="payment">
                                                Change Subscription Payment Status
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table v-else-if="subscription?.related_payments?.length && 'offline' != payment_method"
                        class="wp-list-table widefat table table-bordered striped">
                        <thead>
                            <tr>
                                <th>{{ $t('Amount') }} </th>
                                <th>{{ $t('Payment Method') }}</th>
                                <th>{{ $t('Charge ID')}}</th>
                                <th>{{ $t('Date (GMT)') }}</th>
                                <th>{{ $t('Preview URL') }}</th>
                                <th>{{ $t('Refund') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(payment, i) in subscription.related_payments" :key="i + 99">
                                <td>
                                    <div class="wpf_table_payment">
                                        <span class="table_payment_amount"
                                            v-html="getFormattedMoney(payment.payment_total)"></span>
                                        <span class="payment_currency">{{ payment.currency }}</span>
                                        <span :class="'wpf_paystatus_badge wpf_pay_status_' + payment.status">
                                            <Icon :icon="getPaymentStatusIcon(payment.status)" />
                                            {{ payment.status }}
                                        </span>
                                    </div>
                                </td>
                                <td v-if="payment?.payment_method">
                                    {{  payment?.payment_method }}
                                </td>
                                <td v-if="payment?.charge_id">
                                    <a v-if="payment.view_url" target="_blank" :href="payment.view_url" style="text-decoration: underline;">
                                        {{ payment?.charge_id }}
                                    </a>
                                    <span v-else>{{ payment?.charge_id }}</span>
                                </td>
                                <td>
                                    {{ payment.created_at | dateFormat('MMM DD, YYYY h:mm:ss a') }}
                                </td>
                                <td v-if="!isPaymatticUser">
                                    <a class="el-button el-button--mini" v-if="payment.view_url" target="_blank"
                                        rel="noopener" :href="payment.view_url">
                                        <i class="el-icon-view"></i>
                                    </a>
                                </td>
                                <td>
                                    <el-button size="mini" v-if="isAvailableRefund(payment)" @click="openRefundDialog(payment)">
                                        <Icon icon="wpf-refund" />
                                    </el-button>
                                    
                                    <el-button v-else size="mini" disabled class="">
                                        <Icon icon="wpf-refund-disable" />
                                    </el-button>
                                    <!-- refund modal -->
                                    <Modal :title="$t('Refund')" :dialogVisible="refundDialogVisible"
                                    :dialogWidth="dialogWidth" @close="handleClose">
                                        <Refund v-if="refundDialogVisible && selectedSubscription" :submission="submission" :subscription="selectedSubscription" 
                                            @close_refund_modal="closeRefundModal"
                                            @reload_entry="$emit('reload_entry')" />
                                    </Modal>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else>
                        <p>All received payments will be shown here. No payments received yet!</p>
                    </div>
                </div>
                <!--Edit offline subscription Payment Status Modal-->
                <payment-status-modal v-if="editing_subscription_payment_status" title="Edit payment status"
                    :syncValue="editSubscriptionPaymentStatusModal" :confirmMethod="changeOfflineSubscriptionPaymentStatus"
                    :editModel="subscription_payment_status_edit_model"
                    :available_payment_statuses="available_payment_statuses"
                    @resetModalState="resetModalState" />
                <!-- edit offline subscription status modal -->
                <el-dialog title="Edit Subscripttion Status" :visible.sync="editSubscriptionStatusModal"
                    v-if="editing_subscription_status" width="50%">
                    <div class="modal_body">
                        <p>Current Subscription Status: <b>{{ subscription?.status }}</b></p>
                        <el-form ref="payment_status_form" :model="subscription_status_edit_model" label-width="160px">
                            <el-form-item label="New Payment Status">
                                <el-radio-group v-model="subscription_status_edit_model.status">
                                    <el-radio v-for="(status, status_key) in available_subscription_statuses" :key="status"
                                        v-show="status_key !== 'abandoned'" :label="status_key">{{ status }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="Note">
                                <el-input type="textarea" placeholder="You may add a note for this status change (optional)"
                                    size="mini" v-model="subscription_status_edit_model.note"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="editSubscriptionStatusModal = false"
                            class="wpf_new_ui_button2">Cancel</el-button>
                        <el-button type="primary" @click="changeOfflineSubscriptionStatus"
                            class="wpf_new_ui_button">Confirm</el-button>
                    </span>
                </el-dialog>
                <!-- cancel subscsription modal -->
                <el-dialog title="Confirm subscription cancelation" :visible.sync="sub_cancel_modal"
                    v-if="canceling_subscription" width="50%">
                    <h3>{{ $t('You are about to cancel this subscription') }}</h3>
                    <p v-if="payment_method === 'stripe' || payment_method === 'square' || payment_method === 'authorizedotnet'">{{ $t('This will also ') }} <b>{{
                        $t('cancel the subscription at ') }} {{ payment_method }}.</b>
                        {{ $t('So no further payment will be processed') }}</p>
                    <div v-else>
                        <p>{{ payment_method | ucFirst }}
                            {{ $t('payment gateway does not support remote cancellation at this moment.') }}</p>
                        <p style="font-weight: bold;">{{ $t('Please cancel the subscription from ') }}{{ payment_method }}
                            {{ $t('dashboard too.') }}</p>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="sub_cancel_modal = false" class="wpf_new_ui_button2">{{ $t('Close')
                        }}</el-button>
                        <el-button type="primary" @click="confirmCancel()" class="wpf_new_ui_button">
                            {{ $t('Yes, cancel this subscription') }}</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import fromatPrice from '../../../../common/formatPrice';
import PaymentStatusModal from './__PaymentStatusModal.vue';
import each from 'lodash/each';
import Icon from '../../Icons/Index.vue';
import Modal from '../../Common/Modal.vue';
import Refund from './_Refund.vue';

export default {
    name: 'subscription_payments',
    props: ['subscriptions', 'submission', 'currencySetting', 'payment_mode', 'payment_method', 'discounts', 'form_id', 'entry_id', 'isPaymatticUser', 'is_admin_access'],
    components: {
        PaymentStatusModal,
        Icon,
        Modal,
        Refund
    },
    data() {
        return {
            canceling_subscription: false,
            editing_subscription_status: false,
            editable_subscription: false,
            sub_cancel_modal: false,
            cancelling: false,
            is_100_percent_discount: false,
            extraParams: { param1: 'foo', param2: 'bar' },
            editSubscriptionStatusModal: false,
            editSubscriptionPaymentStatusModal: false,
            available_subscription_statuses: {
                'active': 'active',
                'failing': 'failing',
                'trialing': 'trialing',
                'cancelled': 'cancelled',
                'pending': 'pending',
            },
            subscription_payment_status_edit_model: {
                status: '',
                note: ''
            },
            subscription_status_edit_model: {
                status: '',
                note: ''
            },
            available_payment_statuses: window.wpPayFormsAdmin.paymentStatuses,
            related_payment: this.subscriptions[0].related_payments[0],
            editing_subscription_payment_status: false,
            syncing_subscription: false,
            refundDialogVisible: false,
            selectedSubscription: null,
            dialogWidth: '30%',
        }
    },
    methods: {
        openRefundDialog(payment) {
            this.selectedSubscription = payment;
            this.refundDialogVisible = true;
        },
        closeRefundModal() {
            this.refundDialogVisible = false;
        },
        handleClose() {
            this.refundDialogVisible = false;
        },
        getClasses() {
            if (this.subscriptions[0] && this.subscriptions[0].status === 'cancelled') {
                return 'subscription_cancelled entry_info_box entry_subscription_items';
            }
            return 'entry_info_box entry_subscription_items';
        },
        subscriptionTotal(payments) {
            let total = 0;
            each(payments, (payment) => {
                if (payment.status == 'paid') {
                    total += parseInt(payment.payment_total);
                }
            });
            return this.getFormattedMoney(total);
        },
        getFormattedMoney(amount) {
            if (amount === null || amount === undefined || amount === '') {
                return 'n/a';
            }
            return fromatPrice(amount, this.currencySetting);
        },
        getPaymentStatusIcon(status) {
            if (status == 'intended' || status == 'intented') {
                return 'wpf-intended';
            } else if (status == 'paid') {
                return 'wpf-paid';
            } else if (status == 'active') {
                return 'wpf-active';
            }else if(status === 'cancelled') {
                return 'wpf-cancelled'
            } else if (status == 'failed') {
                return 'el-icon-error';
            } else if (status == 'refunded') {
                return 'wpf-refunded';
            }
            return '';
        },
        getLineItems(payment) {
            if (payment.payment_method == 'stripe') {
                return payment.payment_note.lines.data;
            }
            return [];
        },
        getChargeUrl(payment) {
            if (payment.payment_method == 'stripe' && payment.charge_id) {
                if (this.payment_mode == 'test') {
                    return 'https://dashboard.stripe.com/test/payments/' + payment.charge_id;
                }
                return 'https://dashboard.stripe.com/payments/' + payment.charge_id;
            }
            return '';
        },
        getSubscriptionUrl(subscription) {
            this.is_100_percent_discount = subscription?.vendor_subscriptipn_id?.includes('100%discount');
            if (this.payment_method == 'stripe' && !subscription?.vendor_subscriptipn_id?.includes('100%discount')) {
                if (this.payment_mode == 'test') {
                    return 'https://dashboard.stripe.com/test/subscriptions/' + subscription?.vendor_subscriptipn_id;
                }
                return 'https://dashboard.stripe.com/subscriptions/' + subscription?.vendor_subscriptipn_id;
            }
        },
        subscriptionHumanText(plan) {
            if (parseInt(plan?.bill_times)) {
                return 'Customer will be billed ' + plan?.bill_times + ' times in total';
            } else {
                return 'Customer will be billed until cancelled';
            }
        },
        manageOfflineSubscriptionStatus(command) {
            let { type, subscription } = command;
            this.editable_subscription = subscription;
            if ("change" === type) {
                this.editable_subscription = subscription;
                this.subscription_status_edit_model.status = subscription?.status;
                this.subscription_status_edit_model.note = subscription?.note;
                this.editSubscriptionStatusModal = true;
                this.editing_subscription_status = true;
            }
        },
        syncOfflineSubscription() {
            this.syncing_subscription = true;
            this.$loading({
                target: '.el-dialog'
            })
            // SubmissionController@syncOfflineSubscription
            this.$post(
                `form/${this.form_id}/entries/${this.entry_id}/sync-offline-subscription`,
                { subscriptions: this.subscriptions })
                .then((res) => {
                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: res.data.message,
                        position: 'bottom-right'
                    });
                    this.$emit('reload_entry');
                })
                .catch(errors => {
                    this.$notify.error({
                        title: "Error!",
                        offset: 30,
                        message: errors?.responseJSON?.data?.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.syncing_subscription = false;
                });
        },
        handleActionCommand(command) {
            this.related_payment = command;
            this.subscription_payment_status_edit_model.status = this.related_payment?.status;
            this.subscription_payment_status_edit_model.note = this.related_payment?.payment_note;
            this.editSubscriptionPaymentStatusModal = true;
            this.editing_subscription_payment_status = true;
        },
        changeOfflineSubscriptionPaymentStatus() {
            this.$loading({
                target: '.el-dialog'
            })
            // SubmissionController@changeOfflineSubscriptionPaymentStatus
            this.$post(
                `form/${this.form_id}/entries/${this.entry_id}/change-offline-subscription-payment-status`,
                { subscription_payment: this.related_payment, newStatus: this.subscription_payment_status_edit_model })
                .then((res) => {
                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: res.data.message,
                        position: 'bottom-right'
                    });
                    this.$emit('reload_entry');
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
                    this.resetModalState(); 
                });
        },
        changeOfflineSubscriptionStatus() {
            this.$loading({
                target: '.el-dialog'
            })
            // SubmissionController@changeOfflineSubscriptionStatus
            this.$post(
                `form/${this.form_id}/entries/${this.entry_id}/change-offline-subscription-status`,
                { subscription: this.editable_subscription, newStatus: this.subscription_status_edit_model })
                .then((res) => {
                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: res.data.message,
                        position: 'bottom-right'
                    });
                    this.$emit('reload_entry');
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
                    this.editing_subscription_status = false;
                    this.editSubscriptionStatusModal = false;
                });
        },
        cancelSubscription(subscription) {
            this.canceling_subscription = subscription;
            this.sub_cancel_modal = true;
        },
        confirmCancel() {
            this.cancelling = true;
            this.$loading({
                target: '.el-dialog'
            })
            // SubmissionController@cancelSubscription
            this.$post(`form/${this.form_id}/entries/${this.entry_id}/cancel-subscription`, { subscription: this.canceling_subscription })
                .then((res) => {

                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: res.data.message,
                        position: 'bottom-right'
                    });
                    this.$emit('reload_entry');
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
        getDiscountedRecurring(subscription) {
            const raw = subscription.discounted_recurring_amount ?? subscription.recurring_amount;
            return this.getFormattedMoney(parseInt(raw) || 0);
        },
        mayBeHandleDiscount(amount) {
            if (this.discounts.percent) {
                amount -= amount * (this.discounts.percent / 100)
            };
            return this.getFormattedMoney(amount);
        },
        getDiscountsTotal(amount) {
            let discounted = '-';
            if (this.discounts.percent) {
                discounted = amount * (this.discounts.percent / 100);
            }
            return this.getFormattedMoney(discounted);
        },
        isCancelable(subscription) {
            return (subscription.status == 'active' || subscription.status == 'trialling' || subscription.status == 'failing' || subscription.status == 'intented') && (this.payment_method === 'stripe' || this.payment_method === 'square' || this.payment_method === 'authorizedotnet');
        },
        resetModalState() {
            this.editSubscriptionPaymentStatusModal = false;
            this.editing_subscription_payment_status = false;
            this.subscription_payment_status_edit_model = {
                status: '',
                note: ''
            };
        },
        isAvailableRefund(payment) {
            return ['stripe', 'razorpay', 'paystack', 'square'].includes(payment.payment_method) && payment.status === 'paid';
        }
    },
    mounted() {
      
    }
}
</script>

<style lang="scss" scoped>
.wpf_disable_button {
    background-color: #f5f7fa;
    border-color: #e4e7ed; 
    color: #c0c4cc;
}
</style>