<template>
    <div class="refund_container">
        <el-form label-position="top" require-asterisk-position="left">
            <el-form-item label="Transaction Amount">
                <el-select v-model="selectedTransaction" placeholder="Select Transaction" @change="updateMaxRefund"
                    style="width: 100%">
                    <el-option v-for="(transaction, index) in filteredTransactions" :key="transaction.id"
                        :label="formatTransactionLabel(transaction)" :value="transaction" />
                </el-select>
            </el-form-item>

            <el-form-item label="Refund Amount" class="refund_amount_input">
                <el-input v-model.number="refundAmount" type="number" :min="0" :max="maxRefundAmount"
                    placeholder="Refund amount">
                    <template #prefix>
                        <span v-html="currencySign"></span>
                    </template>
                </el-input>
                <small class="max-amount-info">
                    Max refund amount for this transaction:
                    <span v-html="getFormattedMoney(maxRefundAmount)"></span>
                </small>
            </el-form-item>

            <el-form-item label="Reason of Refund">
                <el-select v-model="refundReason" placeholder="Select refund reason" clearable style="width: 100%">
                    <el-option v-for="reason in refundReasons" :key="reason.value" :label="reason.label"
                        :value="reason.value" />
                </el-select>
            </el-form-item>
            <el-form-item class="subscription_checkbox" v-if="hasSubscription">
                <el-checkbox v-model="cancel_Subscription" id="cancel_Subscription">
                    Cancel Subscription (if any)
                </el-checkbox>
            </el-form-item>

            <el-form-item class="wpf_refund_submit_btn">
                <el-button @click="closeDialog" size="mini" class="cancel-btn">Cancel</el-button>
                <el-button type="primary" size="mini" @click.prevent="confirmRefund" v-loading="refundProcessing"
                    :disabled="!isRefundValid" class="refund-btn">
                    <i class="el-icon-refresh-right" v-if="!refundProcessing"></i>
                    {{ $t('Process Refund') }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import formatPrice from '../../../../common/formatPrice';

export default {
    name: 'Refund',
    props: {
        submission: {
            type: Object,
            required: true
        },
        subscription: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            transactions: [],
            subscriptionItem: null,
            selectedTransaction: null,
            refundAmount: 0,
            refundReason: '',
            maxRefundAmount: 0,
            refundProcessing: false,
            cancel_Subscription: false,
            refundReasons: [
                { value: 'duplicate', label: 'Duplicate charge' },
                { value: 'fraudulent', label: 'Fraudulent charge' },
                { value: 'requested_by_customer', label: 'Requested by customer' },
                { value: '', label: 'Other' }
            ]
        };
    },
    watch: {
        subscription: {
            handler(newVal) {
                this.subscriptionItem = newVal || null;
                this.updateMaxRefund();
            },
            immediate: true
        },
        submission: {
            handler(newVal) {
                this.transactions = Array.isArray(newVal.transactions) ? newVal.transactions : [];
                this.updateMaxRefund();
            },
            immediate: true
        }
    },
    computed: {
        hasSubscription() {
            return this.subscriptionItem && Object.keys(this.subscriptionItem).length > 0;
        },
        currencySign() {
            return this.submission.currencySetting?.currency_sign || '!';
        },
        isRefundValid() {
            return this.selectedTransaction && this.refundAmount > 0 && this.refundAmount <= this.maxRefundAmount;
        },
        filteredTransactions() {
            const validOneTimeTransactions = this.transactions.filter(
                transaction =>
                    transaction.status === 'paid' &&
                    transaction.transaction_type === 'one_time'
            );

            const validSubscriptionTransactions = this.hasSubscription && 
                this.subscriptionItem.status === 'paid' &&
                this.subscriptionItem.transaction_type === 'subscription'
                ? [this.subscriptionItem]
                : [];

            if (validOneTimeTransactions.length > 0 && !validSubscriptionTransactions.length) {
                return validOneTimeTransactions;
            } else if (validSubscriptionTransactions.length > 0) {
                return validSubscriptionTransactions;
            } else {
                return [];
            }
        }
    },
    methods: {
        formatTransactionLabel(transaction) {
            return `#${transaction.id} - ${transaction.status} - ${transaction.payment_total / 100}`;
        },
        updateMaxRefund() {
            if (this.filteredTransactions.length > 0) {
                this.selectedTransaction = this.filteredTransactions[0];
                this.maxRefundAmount = this.selectedTransaction.refund_available / 100;
                this.refundAmount = this.maxRefundAmount;
            }
        },
        processRefund() {
            if (!this.selectedTransaction) return;

            this.refundProcessing = true;

            const payload = {
                form_id: this.submission.form_id,
                submission_id: this.submission.id,
                transaction_id: this.selectedTransaction.id,
                amount: this.refundAmount,
                reason: this.refundReason,
                transaction_type: this.selectedTransaction.transaction_type,
                cancel_Subscription: this.cancel_Subscription
            };
            Promise.resolve(
                this.$post(`form/${this.submission.form_id}/entries/${this.submission.id}/refund`, {
                    payload: payload
                })
            )
                .then(res => {
                    this.handleRefundSuccess(res);
                })
                .catch(error => {
                    this.handleRefundError(error);
                })
                .finally(() => {
                    this.refundProcessing = false;
                });
        },
        confirmRefund() {
            if (this.cancel_Subscription && this.hasSubscription) {
                this.$confirm('Are you sure you want to cancel the subscription? This action cannot be undone.', 'Confirm Subscription Cancellation',
                    {
                        confirmButtonText: 'Yes, Refund',
                        cancelButtonText: 'No, Keep Subscription',
                        confirmButtonClass: 'el-button--primary',
                        cancelButtonClass: 'el-button--default',
                        type: 'warning'
                    })
                    .then(() => {
                        this.processRefund();
                    })
                    .catch(() => {
                        this.cancel_Subscription = false;
                    });
            } else {
                this.processRefund();
            }
        },
        handleRefundSuccess(res) {
            this.$message.success(res.message);
            if (res && res.refund) {
                this.updateTransactionData(res.refund);
                this.$emit('close_refund_modal');
                this.$emit('reload_entry');
            }
        },
        updateTransactionData(refund) {
            if (refund.transaction_type === 'one_time') {
                this.transactions.push(refund);
            } else if (refund.transaction_type === 'subscription') {
                this.subscriptionItem = refund;
            }
            this.updateMaxRefund();
        },
        handleRefundError(error) {
            const rawMessage = error.responseJSON?.error || error.message || 'Refund failed';
            const friendly = this.getFriendlyRefundError(rawMessage);

            this.$notify.error({
                title: friendly.title,
                message: friendly.message,
                duration: 7000,
                dangerouslyUseHTMLString: true
            });
        },
        getFriendlyRefundError(rawMessage) {
            const message = String(rawMessage);

            const chargeMatch = message.match(/No such charge:?\s*'?([\w_]+)'?/i);
            if (chargeMatch) {
                return {
                    title: 'Transaction not found',
                    message: `Transaction <code>${chargeMatch[1]}</code> was not found. Please confirm it exists and that you are connected to the correct payment account.`
                };
            }

            return {
                title: 'Refund failed',
                message: this.escapeHtml(message)
            };
        },
        escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        getFormattedMoney(amount) {
            if (amount === undefined || amount === null) {
                return 'n/a';
            }
            amount = amount * 100;
            return formatPrice(amount, this.submission.currencySetting);
        },
        closeDialog() {
            this.$emit('close_refund_modal');
        }
    },
    mounted() {
        this.transactions = Array.isArray(this.submission.transactions)
            ? this.submission.transactions
            : [];
        this.subscriptionItem = this.subscription || null;
    }
};
</script>
<style scoped>
.max-amount-info {
    font-size: 13px;
    color: #909399;
}
</style>
