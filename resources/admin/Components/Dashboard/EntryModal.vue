<template>
    <div>
        <el-button @click="getEntry(entry_id, form_id)" icon="el-icon-view" size="small"></el-button>
        <el-dialog width="60%" title="Entry details" :visible.sync="dialogTableVisible">
            <div v-if="hasSubmissionItem(submission) || hasSubscription(submission)">
                <div v-if="hasSubmissionItem(submission)" class="entry_info_box entry_order_items">
                    <div class="entry_info_header">
                        <div class="info_box_header">Payment Items</div>
                    </div>
                    <div class="entry_info_body">
                        <div class="wpf_entry_order_items">
                            <table class="wp-list-table widefat table table-bordered striped">
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Item Price</th>
                                        <th>
                                            Meta option data
                                        </th>
                                        <th>Line Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in submission.order_items">
                                        <td>{{ item.item_name }}</td>
                                        <td>{{ item.quantity }}</td>
                                        <td v-html="getFormattedMoney(item.item_price)"></td>
                                        <td>
                                            <div v-if="item.item_meta" v-for="metaData in item.item_meta"
                                                style="display: flex">
                                                <div v-if="metaData.key">
                                                    <strong>{{ metaData.key }} </strong>
                                                </div>
                                                <div> = {{ metaData.value }}</div>
                                            </div>
                                        </td>
                                        <td v-html="getFormattedMoney(item.line_total)"></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th style="text-align: right" colspan="4">Sub Total:</th>
                                        <th v-html="getFormattedMoney(subTotal())"></th>
                                    </tr>
                                    <template v-if="submission.tax_items.length">
                                        <tr v-for="taxItem in submission.tax_items">
                                            <td style="text-align: right" colspan="4">
                                                {{ taxItem.item_name }}:
                                            </td>
                                            <td v-html="getFormattedMoney(taxItem.line_total)"></td>
                                        </tr>
                                    </template>
                                    <tr>
                                        <th style="text-align: right" colspan="4">
                                            <span v-if="submission.discounts.percent">
                                                Total
                                                <span class="" style="font-weight: normal; color: #52a055;">
                                                    (After discount):</span>
                                            </span>
                                            <span v-else>Total:</span>
                                        </th>
                                        <th v-html="getFormattedMoney(orderTotal())"></th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="entry_info_box entry_discounts" v-if="hasDiscount(submission)">
                    <div class="entry_info_header">
                        <div class="info_box_header">Discounts Based on Coupon Code</div>
                    </div>
                    <div class="entry_info_body">
                        <table style="margin-bottom:12px;" class="wp-list-table widefat table table-bordered striped">
                            <thead>
                                <tr>
                                    <th>Discounts</th>
                                    <th style="text-align: right; border: none;">Total Discount Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(discount, i) in submission.discounts.applied" :key="i">
                                    <th class="wpf-entry-applied-coupon" style="font-weight: normal; color: #52a055;"
                                        colspan="3">
                                        <i class="el-icon-discount" />
                                        Discount ({{ discount.item_name }}):
                                    </th>
                                    <th style="font-weight: normal;">
                                        <span v-html="getFormattedMoney(discount.line_total)"></span>
                                    </th>
                                </tr>
                                <tr>
                                    <th style="text-align: right" colspan="3">Total Discounts:</th>
                                    <th v-html="getFormattedMoney(submission.discounts.total)"></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <subscription-payments v-if="hasSubscription(submission)" :isPaymatticUser="true"
                :payment_method="submission.payment_method" :payment_mode="submission.payment_mode"
                :currencySetting="submission.currencySetting" :subscriptions="submission.subscriptions"
                :submission="submission" :discounts="submission.discounts" :entry_id="entry_id" :form_id="form_id"
                :is_admin_access="'no'" class="subscription-payments" />
            </div>
            <div v-else>
                <h4>There is no order item details</h4>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import fromatPrice from '../../../common/formatPrice';
import SubscriptionPayments from '../Form/FormEntries/_subscriptions.vue';
import each from 'lodash/each';
import omit from 'lodash/omit';


export default {
    name: 'SubscriptionEntryModal',
    components: {
        SubscriptionPayments
    },
    props: {
        form_id: {
            type: String
        },
        entry_id: {
            type: Number
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            submission: {},
            entry_items: {},
            responseData: {},
            related_payments: [
                {
                    "id": 1,
                    "form_id": 1,
                    "payment_method": "stripe",
                    "payment_total": 100,
                    "payment_status": "paid",
                    "currency": "usd",
                    "created_at": "2021-03-01 12:00:00",
                    "updated_at": "2021-03-01 12:00:00",
                    "payment_total_text": "1 USD"
                },
                {
                    "id": 2,
                    "form_id": 1,
                    "payment_method": "stripe",
                    "payment_total": 200,
                    "payment_status": "paid",
                    "currency": "usd",
                    "created_at": "2021-03-01 12:00:00",
                    "updated_at": "2021-03-01 12:00:00",
                    "payment_total_text": "2 USD"
                },
                {
                    "id": 3,
                    "form_id": 1,
                    "payment_method": "stripe",
                    "payment_total": 300,
                    "payment_status": "paid",
                    "currency": "usd",
                    "created_at": "2021-03-01 12:00:00",
                    "updated_at": "2021-03-01 12:00:00",
                    "payment_total_text": "3 USD"
                },
                {
                    "id": 4,
                    "form_id": 1,
                    "payment_method": "stripe",
                    "payment_total": 400,
                    "payment_status": "paid",
                    "currency": "usd",
                    "created_at": "2021-03-01 12:00:00",
                    "updated_at": "2021-03-01 12:00:00",
                    "payment_total_text": "4 USD"
                },
                {
                    "id": 5,
                    "form_id": 1,
                    "payment_method": "stripe",
                    "payment_total": 500,
                    "payment_status": "paid",
                    "currency": "usd",
                    "created_at": "2021-03-01 12:00:00",
                    "updated_at": "2021-03-01 12:00:00",
                    "payment_total_text": "5 USD"
                }
            ],
            subTotalPrice: 0,
        }
    },
    watch: {
        responseData: {
            handler: function (val) {
                this.submission = val.submission;
                this.entry_items = val.entry;
            },
            deep: true
        }
    },
    methods: {
        subTotal() {
            let total = 0;
            each(this.submission.order_items, (item) => {
                total += parseInt(item.line_total);
            });
            this.subTotalPrice = total;
            return total;
        },
        syncSubscription(subscription) {
            this.submission.subscriptions = subscription;
        },
        hasSubscription(submission) {
            if (this.has_pro && submission?.subscriptions && submission?.subscriptions?.length) {
                return true;
            }
            return false;
        },
        hasDiscount(submission) {
            if (submission?.discounts && submission?.discounts?.applied && submission.discounts.applied?.length) {
                return true;
            }
            return false;
        },
        orderTotal() {
            let total = 0;
            each(this.submission.tax_items, (item) => {
                total += parseInt(item.line_total);
            });

            if (this.submission.discounts.percent) {
                let discounted = this.subTotalPrice - this.submission.discounts.total;
                // let discounted = this.subTotal - (this.subTotal * (this.submission.discounts.percent / 100));
                return (total + discounted);
            } else {
                return total + this.subTotalPrice;
            }
        },
        getEntry(entry_id, form_id) {
            this.dialogTableVisible = true;
            this.fething = true;
            // SubmissionController@getSubmission
            this.$get(`dashboard/form/${form_id}/entries/${entry_id}`, {})
                .then(response => {
                    this.responseData = response.data;
                    // this.submission = response.data.submission;
                    // this.entry_items = response.data.entry;
                    // this.widgets = response.data.submission.widgets;
                    window.WPPayFormsBus.$emit('site_title', 'Entry#' + response.data.submission.id);
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error?.responseJSON?.data?.message || 'Something went wrong. Please try again.',
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.fething = false;
                });
        },
        hasSubmissionItem() {
            console.log(this.submission);
            return this.submission.order_items && parseInt(this.submission.order_items.length);
        },
        getFormattedMoney(amount) {
            if (amount === undefined || amount === null) {
                return 'n/a';
            }
            return fromatPrice(amount, this.submission.currencySetting);
        },
    },
    mounted() {
        // this.related_payments?.map(( subscription_entry, subscription_index)  => {
        //     let payment_total = subscription_entry?.payment_total/ 100 + ' ' + subscription_entry?.currency?.toUpperCase();
        //     this.$set(this.related_payments[subscription_index], 'payment_total_text', payment_total);
        // })
    },
}

</script>

<style scoped>
.entry_discounts {
    margin-top: 50px;
    margin-bottom: 50px;
}

.payment_head_top {
    display: flex;
    justify-content: space-between;
}

.info_box_header {
    font-size: 18px;
}

.subscription-payments {
    margin-bottom: 50px;
    box-sizing: border-box;
}

.info_box_header_custom {
    border-bottom: 1px solid #c3c4c7;
    width: 100%;
    margin-bottom: 15px;
    padding-bottom: 10px;
}
</style>