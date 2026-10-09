<template>
    <!-- <div id="print_view"> -->
    <div>
        <div v-loading="fetching" :class="print_hides" element-loading-text="Loading Entry..." class="wpf_payment_view">
            <template v-if="submission.id">
                <!-- <div class="payment_head_info">
                    <router-link class="payhead_nav_item payhead_back_icon"
                        :to="{ name: 'form_entries', params: { form_id: form_id } }"><span
                            class="dashicons dashicons-admin-home"></span></router-link>
                    <div class="payhead_title">
                        {{ submission.post_title }} #{{ submission.id }}
                    </div>
                    <div class="wpf_header_actions">
                        <el-button-group>
                            <el-button size="mini" @click="handleNavClick('prev')" type="info" icon="el-icon-d-arrow-left">
                                Prev
                            </el-button>
                            <el-button readonly size="mini" disabled type="plain">{{ submission.id }}</el-button>
                            <el-button size="mini" @click="handleNavClick('next')" type="info">Next <i
                                    class="el-icon-d-arrow-right el-icon-right"></i></el-button>
                            <el-dropdown v-if="submission.payment_method" @command="handleActionCommand">
                                <el-button size="mini" type="primary" class="wpf_new_ui_button">
                                    Actions <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="payment_status">
                                        Change Payment Status
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-button-group>
                    </div>
                </div> -->

                <div class="payment_head_info" style="padding-top: 0px;">
                    <div class="wpf_entry_title">
                        <div class="wpf_entries_url">
                            <router-link class="payhead_nav_item"
                                :to="{ name: 'form_entries', params: { form_id: form_id } }">
                                <span>Form Entries</span>
                            </router-link>
                        </div>

                        <div class="payhead_back_icon">
                            <Icon icon="GreaterIcon" />
                        </div>
                        <div class="payhead_title">
                            {{ submission.post_title }} #{{ submission.id }}
                        </div>
                    </div>
                    <div class="wpf_header_actions">
                        <el-button-group>
                            <el-button @click="handleNavClick('prev')">
                                <Icon icon="wpf-back" />
                                Prev
                            </el-button>
                            <el-button readonly>{{ submission.id }}</el-button>
                            <el-button @click="handleNavClick('next')">
                                Next
                                <Icon icon="wpf-forward" />
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
                <!-- <div class="wpf_payment_status_action">
                <div class="wpf_payment_status_action">
                    <div class="wpf_form_title">
                        {{ submission.post_title }} #{{ submission.id }}
                    </div>

                    <div class="wpf_entry_action">
                        <div class="wpf_entry_export">
                            <el-button @click="exportJSON()">
                                <Icon icon="wpf-export" />
                                Export JSON
                            </el-button>
                        </div>
                        <div class="wpf_meta_info">
                            <el-switch v-model="hide_sidebar"></el-switch>
                            <span>Meta Info</span>
                        </div>
                        <div class="wpf_payment_status">
                            <el-dropdown v-if="submission.payment_method" @command="handleActionCommand">
                                <el-button size="mini" type="primary" class="wpf_new_ui_button">
                                    Actions <i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="payment_status">
                                        Change Payment Status
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        <div class="payment_head_bottom">
                            <div class="info_block">
                                <div class="info_header">Date</div>
                                <div class="info_value">{{ submission.created_at }}</div>
                            </div>
                            <div class="info_block">
                                <div class="info_header">Email</div>
                                <div class="info_value">
                                    <span v-if="submission.customer_email">
                                        <router-link :to="{ path: '/customers/' + submission.customer_email }">
                                            {{ submission.customer_email }}
                                        </router-link></span>
                                    <span v-else>n/a</span>
                                </div>
                            </div>
                            <div class="info_block">
                                <div class="info_header">Name</div>
                                <div class="info_value">
                                    <span class="wpf_capitalize" v-if="submission.customer_name">
                                        <a :href="submission.user_profile_url" target="_blank"
                                            v-if="submission.user_profile_url">
                                            {{ submission.customer_name }}
                                        </a>
                                        <span v-else>
                                            {{ submission.customer_name }}
                                        </span>
                                    </span>
                                    <span v-else>n/a</span>
                                </div>
                            </div>
                            <div v-if="submission.payment_method" class="info_block">
                                <div class="info_header">Payment Method</div>
                                <div class="info_value wpf_capitalize">
                                    <span>{{ submission.payment_method }}</span>
                                </div>
                            </div>
                            <div v-if="submission.payment_mode" class="info_block">
                                <div class="info_header">Payment Mode</div>
                                <div class="info_value wpf_pay_mode wpf_capitalize"
                                    :class="'wpf_pay_mode_' + submission.payment_mode">{{ '[ ' +
            submission.payment_mode + ' ]'
                                    }}
                                </div>
                            </div>
                            <div class="info_block">
                                <div class="info_header">Entry Status</div>
                                <div title="Click icon to mark unread" class="info_value wpf_capitalize"
                                    style="cursor: pointer;">
                                    <span @click="changeStatus('new')" title="Mark as unread"
                                        v-if="submission.status !== 'new'"
                                        class="el-icon-circle-check action_button"></span>
                                    <span @click="changeStatus('read')" title="Mark as read" v-else
                                        class="el-icon-circle-check-outline action_button"></span>
                                    {{ submission.status }}
                                </div>

                            </div>
                        </div>
                    </div>
                </div> -->

                <div class="wpf_entry_layout">
                    <div class="wpf_entry_left" id="print_view">
                        <div class="wpf_payment_details" v-if="!print_hides.includes('print_hide_header_items')">
                            <div class="payment_header">
                                <div v-if="parseInt(submission.order_items?.length) || submission.subscription_payment_total"
                                    class="payment_head_top">
                                    <div class="payment_header_left">
                                        <div class="payment_icon">
                                            <Icon icon="wpf-payment" />
                                        </div>
                                        <div class="payment_amount_detail">
                                            <span class="head_small_title">Payment</span>
                                            <div class="head_payment_amount">
                                                <template v-if="parseInt(submission.payment_total) && !submission.subscription_payment_total">
                                                    <span class="pay_amount"
                                                        v-html="getFormattedMoney(orderTotal)"></span>
                                                    <!-- <span class="payment_currency">{{ submission.currency }}</span> -->
                                                    <span :class="'wpf_pay_status_' + submission.payment_status">
                                                        <!-- <i :class="getPaymentStatusIcon(submission.payment_status)"></i> -->
                                                        <Icon :icon="getPaymentStatusIcon(submission.payment_status)" />
                                                        {{ submission.payment_status }}
                                                    </span>
                                                </template>
                                                <template v-if="submission.subscription_payment_total">
                                                    <span class="pay_amount"
                                                        v-html="getFormattedMoney(submission.subscription_payment_total)">
                                                    </span>
                                                    <span :class="'wpf_pay_status_' + submission.payment_status">
                                                        <!-- <i :class="getPaymentStatusIcon(submission.payment_status)"></i> -->
                                                        <Icon :icon="getPaymentStatusIcon(submission.payment_status)" />
                                                        {{ submission.payment_status }}
                                                    </span>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="payment_header_right">
                                        <div class="wpf_payment_status" v-if="'authorized' !== submission.payment_status">
                                            <!-- <el-dropdown v-if="submission.payment_method"
                                                @command="handleActionCommand">
                                                <el-button size="mini" type="primary" class="wpf_new_ui_button">
                                                    Actions <i class="el-icon-arrow-down el-icon--right"></i>
                                                </el-button>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item command="payment_status">
                                                        Change Payment Status
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown> -->

                                            <span @click="handleActionCommand('payment_status')">
                                                Change Payment Status
                                            </span>
                                        </div>
                                        <div v-if="'authorized' === submission.payment_status" style="display: flex; gap: 4px; align-items: center;">
                                            <p v-if="customer_payment_method && 'expired' != expireDateForCapture" style="color: #80004e; word-break: break-word; font-size: 12px;">{{ expireDateForCapture }}</p>
                                            <el-button v-if="'authorized' === submission.payment_status && 'expired' != expireDateForCapture" size="mini" @click="showCaptureModal"><i class="el-icon-check" /> Capture</el-button> 
                                            <p v-if="'expired' === expireDateForCapture" style="color: rgb(210, 15, 15);">{{ $t('Time expired for Capture!') }}</p>
                                        </div>
                                        <!-- <p class="head_small_title">{{ firstTransaction.charge_id }}</p> -->
                                        <div class="wpf_payment_vendor">
                                            <a v-if="isUrl(firstTransaction.transaction_url)" target="_blank"
                                                :href="firstTransaction.transaction_url"
                                                class="el-button el-button--default el-button--mini">
                                                View on <span style="text-transform: capitalize">
                                                    {{ firstTransaction.payment_method }}
                                                </span>
                                            </a>
                                            <span v-else style="text-transform:capitalize; padding: 1px 7px;"
                                                :class="'wpf_pay_method_' + firstTransaction.payment_method">
                                                {{ firstTransaction.payment_method }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div v-else="">
                                    <div class="wpf_payment_info">
                                        <div class="payment_header_title">Payment</div>
                                        <div class="wpf_payment_status">
                                            <el-dropdown v-if="submission.payment_method"
                                                @command="handleActionCommand">
                                                <el-button size="mini" type="primary" class="wpf_new_ui_button">
                                                    Actions <i class="el-icon-arrow-down el-icon--right"></i>
                                                </el-button>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item command="payment_status">
                                                        Change Payment Status
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    </div>
                                </div> -->
                                <div class="payment_head_bottom">
                                    <div class="info_block">
                                        <div class="info_header">Name</div>
                                        <div class="info_value">
                                            <span class="wpf_capitalize" v-if="submission.customer_name">
                                                <a :href="submission.user_profile_url" target="_blank"
                                                    v-if="submission.user_profile_url">
                                                    {{ submission.customer_name }}
                                                </a>
                                                <span v-else>
                                                    {{ submission.customer_name }}
                                                </span>
                                            </span>
                                            <span v-else>n/a</span>
                                        </div>
                                    </div>
                                    <div class="info_block">
                                        <div class="info_header">Email</div>
                                        <div class="info_value">
                                            <span v-if="submission.customer_email">
                                                <router-link :to="{ path: '/customers/' + submission.customer_email }">
                                                    {{ submission.customer_email }}
                                                </router-link></span>
                                            <span v-else>n/a</span>
                                        </div>
                                    </div>
                                    <div class="info_block">
                                        <div class="info_header">Date</div>
                                        <div class="info_value">{{ formatDate(submission.created_at) }}</div>
                                    </div>

                                    <div v-if="submission.payment_method" class="info_block">
                                        <div class="info_header">Payment Method</div>
                                        <div class="info_value wpf_capitalize">
                                            <span>{{ submission.payment_method }}</span>
                                        </div>
                                    </div>
                                    <div v-if="submission.payment_mode" class="info_block">
                                        <div class="info_header">Payment Mode</div>
                                        <div class="info_value wpf_pay_mode wpf_capitalize"
                                            :class="'wpf_pay_mode_' + submission.payment_mode">
                                            {{ '[ ' + submission.payment_mode + ' ]' }}
                                        </div>
                                    </div>
                                    <div class="info_block">
                                        <div class="info_header">Entry Status</div>
                                        <div title="Click icon to mark unread" class="info_value wpf_capitalize"
                                            style="cursor: pointer;">
                                            <span @click="changeStatus('new')" title="Mark as unread"
                                                v-if="submission.status !== 'new'"
                                                class="el-icon-circle-check action_button"></span>
                                            <span @click="changeStatus('read')" title="Mark as read" v-else
                                                class="el-icon-circle-check-outline action_button"></span>
                                            {{ submission.status }}
                                        </div>

                                    </div>
                                    <!-- <div class="info_block">
                                        <div class="info_header">Payment Total</div>
                                        <span>{{ submission.payment_total }}</span>
                                    </div> -->
                                </div>
                            </div>
                        </div>

                        <div class="wpf_submisson_body">
                            <div class="wpf_submission_details">
                                <div class="entry_info_box entry_input_data" v-if="!print_hides.includes('print_hide_input_items')">
                                    <div class="entry_info_header">
                                        <div class="info_box_header">Form Entry Data</div>
                                        <div class="info_box_header_actions">
                                            <el-checkbox true-label="yes" false-label="no" v-model="show_empty">
                                                Show empty fields
                                            </el-checkbox>
                                        </div>
                                    </div>
                                    <div class="entry_info_body">
                                        <div class="wpf_entry_details">
                                            <div v-for="(entry, entry_id) in entry_items"
                                                v-show="show_empty == 'yes' || entry.value" :key="entry_id"
                                                class="wpf_each_entry">
                                                <div class="wpf_entry_label">
                                                    {{ entry.label }}
                                                </div>
                                                <div class="wpf_entry_value">{{ entry.value }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="parseInt(submission.order_items?.length) && !print_hides.includes('print_hide_order_items')"
                                    class="entry_info_box entry_order_items">
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
                                                            <div v-if="item.item_meta"
                                                                v-for="metaData in item.item_meta"
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
                                                        <th colspan="4">Sub Total:</th>
                                                        <th v-html="getFormattedMoney(subTotal)"></th>
                                                    </tr>
                                                    <template v-if="submission.tax_items?.length">
                                                        <tr v-for="taxItem in submission.tax_items">
                                                            <td colspan="4">
                                                                {{ taxItem.item_name }}:
                                                            </td>
                                                            <td v-html="getFormattedMoney(taxItem.line_total)"></td>
                                                        </tr>
                                                    </template>
                                                    <tr>
                                                        <th colspan="4">
                                                            <span
                                                                v-if="submission.discounts.percent || submission.discounts.total">
                                                                Total
                                                                <span class=""
                                                                    style="font-weight: normal; color: #52a055;">
                                                                    (After discount):</span>
                                                            </span>
                                                            <span v-else>Total:</span>
                                                        </th>
                                                        <th v-html="getFormattedMoney(orderTotal)"></th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <subscription-payments v-if="has_pro && submission.subscriptions?.length && !print_hides.includes('hide_subscription_payments')"
                                    @sync_subscription="syncSubscription" @reload_entry="getEntry"
                                    :payment_method="submission.payment_method" :payment_mode="submission.payment_mode"
                                    :currencySetting="submission.currencySetting"
                                    :subscriptions="submission.subscriptions" :submission="submission"
                                    :discounts="submission.discounts" :entry_id="entry_id" :form_id="form_id" />

                                <div class="entry_info_box entry_discounts" v-if="submission.discounts.total">
                                    <div class="entry_info_header">
                                        <div class="info_box_header">Discounts Based on Coupon Code</div>
                                    </div>
                                    <div class="entry_info_body">
                                        <table class="wp-list-table widefat table table-bordered striped">
                                            <thead>
                                                <tr>
                                                    <th>Discounts</th>
                                                    <th style="text-align: right; padding-right: 5%;">Total Discount Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(discount, i) in submission.discounts.applied" :key="i">
                                                    <td class="wpf-entry-applied-coupon"
                                                        style="font-weight: normal; color: #52a055;">
                                                        <i class="el-icon-discount" />
                                                        Discount ({{ discount.item_name }}):
                                                    </td>
                                                    <td style="font-weight: normal; text-align: right; padding-right: 12%;">
                                                        <span v-html="getFormattedMoney(discount.line_total)"></span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Total Discounts:</th>
                                                    <th style="text-align: right; padding-right: 12%;" v-html="getFormattedMoney(submission.discounts.total)"></th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div v-if="parseInt(submission.transactions?.length) && !print_hides.includes('print_hide_transactions') && !submission.subscriptions?.length"
                                    class="entry_info_box entry_transactions">
                                    <div class="entry_info_header" style="display: flex; justify-content: space-between;">
                                        <div class="info_box_header">Transaction Details</div>
                                        <div class="wpf_payment_refund">
                                            <el-button class="wpf_refund_btn" v-if="isAvailableRefund" size="mini" @click="refundDialogVisible = true">
                                                <Icon icon="wpf-refund" />
                                                Refund
                                            </el-button>
                                            <!-- refund modal -->
                                            <Modal title="Refund" :dialogVisible="refundDialogVisible"
                                                :dialogWidth="dialogWidth" @close="handleClose">
                                                <Refund v-if="refundDialogVisible" :submission="submission" @close_refund_modal="closeRefundModal" 
                                                    @reload_entry="getEntry"/>
                                            </Modal>
                                        </div>
                                    </div>
                                    <div class="entry_info_body">
                                        <div class="wpf_entry_transactions">
                                            <div v-for="(transaction, index) in submission.transactions" :key="index"
                                                class="wpf_entry_transaction">
                                                <h4 v-show="submission.transactions.length > 1">
                                                    Transaction #{{ index + 1 }}
                                                </h4>
                                                <ul class="wpf_list_items">
                                                    <li>
                                                        <div class="wpf_list_header">ID</div>
                                                        <div class="wpf_list_value">{{ transaction.id }}</div>
                                                    </li>
                                                    <li>
                                                        <div class="wpf_list_header">Payment Method</div>
                                                        <div class="wpf_list_value">
                                                            <span v-if="transaction.payment_method">
                                                                {{ transaction.payment_method }}
                                                            </span>
                                                            <span v-else>n/a</span>
                                                        </div>
                                                    </li>
                                                    <li v-if="transaction.charge_id">
                                                        <div class="wpf_list_header">Transaction ID</div>
                                                        <div class="wpf_list_value">

                                                            <a v-if="transaction.transaction_url" target="_blank"
                                                                :href="transaction.transaction_url">
                                                                {{ transaction.charge_id }}
                                                            </a>
                                                            <span v-else>{{ transaction.charge_id }}</span>

                                                        </div>
                                                    </li>
                                                    <li v-show="transaction.card_last_4">
                                                        <div class="wpf_list_header">Card Last 4</div>
                                                        <div class="wpf_list_value">
                                                            <span class="wpf_card_badge">
                                                                <!-- {{ transaction.card_brand }} -->
                                                                <Icon
                                                                    :icon="getPaymentCardIcon(transaction.card_brand)" />
                                                            </span>
                                                            <i class="el-icon-more"></i>
                                                            {{ transaction.card_last_4 }}
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="wpf_list_header">Payment Total</div>
                                                        <div class="wpf_list_value"
                                                            v-html="getFormattedMoney(transaction.payment_total)"></div>
                                                    </li>
                                                    <li>
                                                        <div class="wpf_list_header">Payment Status</div>
                                                        <div class="wpf_list_value"
                                                            :class="'wpf_pay_status_' + transaction.status">
                                                            <Icon :icon="getPaymentStatusIcon(transaction.status)" />
                                                            {{ transaction.status }}
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div class="wpf_list_header">Date</div>
                                                        <div class="wpf_list_value">
                                                            {{formatDate(transaction.created_at) }}
                                                        </div>
                                                    </li>
                                                </ul>

                                                <div v-if="transaction.converted_currency">
                                                    <div style="padding:16px 0px;" class="entry_info_header">
                                                        <i class="dashicons dashicons-controls-repeat"></i>
                                                        <div class="info_box_header">Currency Conversion Details</div>
                                                    </div>
                                                    <ul class="wpf_list_items"
                                                        v-for="(item, key) in transaction.converted_currency"
                                                        :key="item">
                                                        <li>
                                                            <div class="wpf_list_header">{{ key }}</div>
                                                            <div class="wpf_list_value">{{ item }}</div>
                                                        </li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    </div>                                    
                                </div>


                                <div v-if="parseInt(submission.refunds?.length)" class="entry_info_box entry_refunds">
                                    <div class="entry_info_header">
                                        <div class="info_box_header">Refunds</div>
                                        <div class="info_box_header_actions">
                                            Total: <span v-html="getFormattedMoney(submission.refundTotal)"></span>
                                        </div>
                                    </div>
                                    <div class="entry_info_body">
                                        <div class="wpf_entry_transactions">
                                            <div v-for="refund in submission.refunds" :key="refund.id"
                                                class="wpf_each_entry">
                                                <div class="wpf_entry_label">
                                                    <span v-html="getFormattedMoney(refund.payment_total)"></span>
                                                    refunded due to
                                                    {{ refund.payment_note }} at <span>{{ refund.created_at }}</span>
                                                </div>
                                                <div class="wpf_entry_value">
                                                    <span>Refund ID: {{ refund.charge_id }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="gift_aid" class="entry_info_box entry_gift_aid">
                                    <div class="entry_info_header">
                                        <div class="info_box_header">Gift Aid Declaration</div>
                                        <div class="info_box_header_actions">
                                            <span class="wpf_gift_aid_opted_in">
                                                <i class="el-icon-check"></i> Opted In
                                            </span>
                                        </div>
                                    </div>
                                    <div class="entry_info_body">
                                        <div class="wpf_entry_details">
                                            <div v-if="gift_aid.address" class="wpf_each_entry">
                                                <div class="wpf_entry_label">Address Line 1</div>
                                                <div class="wpf_entry_value">{{ gift_aid.address }}</div>
                                            </div>
                                            <div v-if="gift_aid.address_line2" class="wpf_each_entry">
                                                <div class="wpf_entry_label">Address Line 2</div>
                                                <div class="wpf_entry_value">{{ gift_aid.address_line2 }}</div>
                                            </div>
                                            <div v-if="gift_aid.city" class="wpf_each_entry">
                                                <div class="wpf_entry_label">City</div>
                                                <div class="wpf_entry_value">{{ gift_aid.city }}</div>
                                            </div>
                                            <div v-if="gift_aid.postcode" class="wpf_each_entry">
                                                <div class="wpf_entry_label">Postcode</div>
                                                <div class="wpf_entry_value">{{ gift_aid.postcode }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="entry_info_box entry_submission_activity" v-if="!print_hides.includes('print_hide_activities')">
                                    <div class="entry_info_header">
                                        <div class="info_box_header">Submission Activity Events</div>
                                        <!-- <div class="info_box_header_actions">
                                            <el-button @click="add_note_box = !add_note_box" size="mini" type="info">
                                                Add Note
                                            </el-button>
                                        </div> -->
                                    </div>
                                    <div class="entry_info_body">
                                        <div class="wpf_entry_details">
                                            <template v-if="submission.activities && submission.activities?.length">
                                                <div v-for="activity in submission.activities" :key="activity.id"
                                                    class="wpf_each_entry">
                                                    <div class="wpf_entry_activity">
                                                        <div class="wpf_activity_icon">
                                                            <Icon icon="wpf-dotted" />
                                                        </div>
                                                        <div class="wpf_entry_label">
                                                            <span class="wpf_activity_time">
                                                                {{ formatDate(activity.created_at) }}
                                                            </span>
                                                            <div class="wpf_activity_status">
                                                                <span class="wpf_activity_creator">
                                                                    {{ activity.created_by }}</span>
                                                                <!-- {{ activity.created_by }} - {{ activity.created_at }} -->
                                                                <span class="wpf_tag"
                                                                    :class="'wpf_each_entry_' + activity.type">
                                                                    <Icon v-if="activity.type === 'failed'"
                                                                        icon="wpf-activity" />
                                                                    <Icon v-else-if="activity.type === 'custom_note'"
                                                                        icon="wpf-activity" />
                                                                    <Icon v-else icon="wpf-activity" />
                                                                    <span class="wpf_activity_type">{{ activity.type
                                                                        }}</span>
                                                                </span>

                                                            </div>
                                                            <div class="wpf_entry_value" v-html="activity.content">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <remove class="pull-right"
                                                            @on-confirm="deleteActivity(activity)">
                                                            <p style="font-size: 12px;" slot="info">
                                                                {{ $t('All the data associated with') }}<br />
                                                                {{ $t('this entry will be deleted') }}<br />
                                                                {{ $t('Are you sure to delete this?') }}
                                                            </p>
                                                            <Icon icon="wpf-delete" />
                                                        </remove>
                                                    </div>
                                                </div>
                                            </template>

                                            <div class="wpf_each_entry text-center" v-else>
                                                <p>No Activity found</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="info_box_header_actions">
                                        <!-- <el-button @click="add_note_box = !add_note_box" size="mini">
                                            Add Note
                                        </el-button> -->
                                        <span class="wpf_activity_note" @click="add_note_box = !add_note_box">
                                            <Icon icon="wpf-black-add" /> Add Note
                                        </span>
                                    </div>
                                    <div v-if="add_note_box" class="wpf_add_note_box">
                                        <el-input type="textarea" :autosize="{ minRows: 3 }"
                                            placeholder="Please Provide Note Content" v-model="new_note_content">
                                        </el-input>
                                        <el-button @click="submitNote()" size="mini" type="primary" class="wpf_add_note">
                                            {{ $t('Submit Note')}}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="wpf_entrty_right">
                        <div class="entry_actions">
                            <div class="wpf_entry_header">
                                <span>Entry Actions</span>
                            </div>
                            <div class="wpf_entry_body">
                                <div class="wpf_entry_print">
                                    <Icon icon="wpf-print" />
                                    <span @click="dialogVisible = true">
                                        Print This Entry
                                    </span>
                                    <Modal title="Hide Sections From Print" :dialogVisible="dialogVisible"
                                        :dialogWidth="dialogWidth" @close="handleClose">
                                        <div class="wpf_print_container">
                                            <!-- <div class="wpf_print_header">
                                                <span>Hide Sections From Print</span>
                                            </div> -->
                                            <div class="wpf_print_body">
                                                <el-checkbox-group v-model="print_hides">
                                                    <el-checkbox label="print_hide_activities">
                                                        Hide Activities
                                                    </el-checkbox>
                                                    <el-checkbox label="print_hide_transactions">
                                                        Hide Transactions
                                                    </el-checkbox>
                                                    <el-checkbox label="print_hide_input_items">
                                                        Hide Input Items
                                                    </el-checkbox>
                                                    <el-checkbox label="print_hide_header_items">
                                                        Hide Header Bar
                                                    </el-checkbox>
                                                    <el-checkbox label="print_hide_order_items">
                                                        Hide Payment Items
                                                    </el-checkbox>
                                                    <el-checkbox label="hide_subscription_payments">
                                                        Hide Subscription
                                                    </el-checkbox>
                                                </el-checkbox-group>˝
                                            </div>

                                            <span slot="footer" class="dialog-footer">
                                                <!-- <el-button size="mini" @click="dialogVisible = false">Cancel</el-button> -->
                                                <el-button size="mini" @click="closeDialog">Cancel</el-button>
                                                <el-button @click="print" size="mini" type="primary">Print This Entry</el-button>
                                            </span>
                                        </div>
                                    </Modal>
                                </div>
                                <div class="wpf_entry_export">
                                    <Icon icon="wpf-export" />
                                    <span @click="exportJSON()">Export JSON</span>
                                </div>
                                <div class="wpf_entry_mail">
                                    <Icon icon="wpf-mail" />
                                    <!-- <span>Send Email Notification Manually</span> -->
                                    <email-resend :form_id="form_id" :entry_id="entry_id" />
                                </div>
                            </div>
                        </div>
                        <div v-for="(widget, widgetKey) in widgets" :key="widgetKey" class="entry_actions">
                            <div class="wpf_entry_header">
                                <b>{{ widget.title }}</b>
                            </div>
                            <div class="entry_info_body narrow_items">
                                <div v-html="widget.content"></div>
                            </div>
                        </div>
                        <div class="wpf_meta_info_wrapper entry_info_box">
                            <div class="entry_info_header"
                                :style="{ borderRadius: hide_sidebar === true ? '8px 8px 0 0' : '8px' }">
                                <div class="info_box_header">Meta Info</div>
                                <div class="wpf_meta_info">
                                    <el-switch v-model="hide_sidebar"></el-switch>
                                </div>
                            </div>
                            <div v-if="hide_sidebar == true"  class="entry_info_body wpf_meta_info">
                                <ul>
                                    <li>User Browser: {{ submission.browser }}</li>
                                    <li>Platform: {{ submission.device }}</li>
                                    <li>IP Address:
                                        <a target="_blank" rel="noopener"
                                            :href="'https://ipinfo.io/' + submission.ip_address">
                                            {{ submission.ip_address }}
                                        </a>
                                    </li>
                                    <li v-if="submission.user">User:
                                        <a target="_blank" rel="noopener" :href="submission.user.profile_url">
                                            {{ submission.user.display_name }}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- <div class="print_button_controls">
                <el-button @click="show_print_settings = !show_print_settings" size="mini" class="wpf_new_ui_button2"><i
                        class="el-icon-setting"></i></el-button>
                <el-button @click="print" type="info" size="mini" icon="el-icon-printer">Print This Entry</el-button>
                <el-button @click="exportJSON()" type="info" size="mini" icon="el-icon-document-copy">Export JSON
                </el-button>
                <email-resend :form_id="form_id" :entry_id="entry_id" />
                <div v-if="show_print_settings">
                    <h3>Mark Sections to hide from print screen</h3>
                    <el-checkbox-group v-model="print_hides">
                        <el-checkbox label="print_hide_activities">Hide Activities</el-checkbox>
                        <el-checkbox label="print_hide_transactions">Hide Transactions</el-checkbox>
                        <el-checkbox label="print_hide_input_items">Hide Input Items</el-checkbox>
                        <el-checkbox label="print_hide_header_items">Hide Header Bar</el-checkbox>
                        <el-checkbox label="print_hide_order_items">Hide Payment Items</el-checkbox>
                        <el-checkbox label="print_hide_meta_info">Hide Meta Info</el-checkbox>
                    </el-checkbox-group>
                </div>

                <el-button v-if="hide_sidebar == 'yes'" @click="hide_sidebar = 'no'" size="mini"
                    class="wpf_new_ui_button2">
                    Show Meta Info
                </el-button>

            </div> -->
            <!--Edit Payment Status Modal-->
            <payment-status-modal v-if="editing_payment_status" title="Edit payment status"
                :syncValue="editPaymentStatusModal" :confirmMethod="changePaymentStatus"
                @resetModalState="resetModalState" :editModel="payment_status_edit_model"
                :available_payment_statuses="available_payment_statuses" />
            <el-dialog :visible.sync="show_print_pro" width="60%">
                <div class="payform_section_body payform_upgrade_wrapper">
                    <div class="payform_upgrade_section">
                        <h1><i class="el-icon-lock"></i></h1>
                        <h3>Print Entry is a pro feature. Upgrade to pro to unlock this feature.</h3>
                        <a target="_blank" :href="pro_purchase_url" class="el-button el-button--primary">Upgrade To Pro
                            version</a>
                    </div>
                </div>
            </el-dialog>
            <el-dialog :visible.sync="show_capture_modal" width="30%" title="Capture payment" v-loading="fetching">
                <el-form>
                    <el-form-item label="Capture amount">
                        <el-input v-model="amount_to_be_captured" autocomplete="off" type="number" :max="capturable_amount" :min="0.50">
                            <template slot="prepend">{{ submission.currency }}</template>
                        </el-input>
                    </el-form-item>
                    <p v-if="show_amount_error" style="color: red"> Cannot capture more than the authorized amount {{ submission.currency }} {{ capturable_amount }}</p>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="show_capture_modal = false">Cancel</el-button>
                    <el-button type="primary" @click="captureAmountFromStripe">Capture</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script type="text/babel">
import each from 'lodash/each';
import fromatPrice from '../../../../common/formatPrice';
import omit from 'lodash/omit';
import SubscriptionPayments from './_subscriptions';
import EmailResend from './_RecentEmailNotification';
import Remove from '../../pieces/confirmation.vue'
import PaymentStatusModal from './__PaymentStatusModal.vue';
import Icon from '../../Icons/Index.vue';
import Modal from '../../Common/Modal.vue';
import moment from 'moment';

import {paymentMethodIcon, paymentStatusIcon, paymentCardIcon} from '../../../Components/helper.js';
import Refund from './_Refund.vue';


export default {
    name: "Entry",
    components: {
        SubscriptionPayments,
        EmailResend,
        Remove,
        PaymentStatusModal,
        Icon,
        Modal,
        Refund
    },
    data() {
        return {
            submission: {},
            gift_aid: null,
            entry_id: this.$route.params.entry_id,
            entry_items: {},
            form_id: this.$route.params.form_id,
            fetching: false,
            loading: false,
            show_empty: false,
            add_note_box: false,
            new_note_content: '',
            adding_note: false,
            editPaymentStatusModal: false,
            editing_payment_status: false,
            payment_status_edit_model: {
                status: '',
                note: ''
            },
            available_payment_statuses: window.wpPayFormsAdmin.paymentStatuses,
            print_hides: [],
            show_print_settings: false,
            show_capture_modal: false,
            capturable_amount: 0,
            amount_to_be_captured: 0,
            customer_payment_method: '',
            payment_expiring_at: '',
            authorization_date: null,
            amount_capture_expiring_date: '',
            show_amount_error: false,
            show_print_pro: false,
            hide_sidebar: true,
            fluent_pdf_active: window.wpPayFormsAdmin.fluent_pdf_active,
            dialogVisible: false,
            dialogWidth: '30%',
            refundDialogVisible: false,
            captureValidityInDays: 7,
        }
    },
    watch: {
        show_empty() {
            this.setStoreData('show_empty_entry_field', this.show_empty);
        },
        // hide_sidebar() {
        //     this.setStoreData('entry_sidebar_status', this.hide_sidebar);
        // }
    },
    computed: {
        subTotal() {
            let total = 0;
            each(this.submission.order_items, (item) => {
                total += parseInt(item.line_total);
            });
            return total;
        },
        orderTotal() {
            let total = 0;
            each(this.submission.tax_items, (item) => {
                total += parseInt(item.line_total);
            });

            if (this.submission.discounts.percent || this.submission.discounts.total) {
                let discounted = this.subTotal - this.submission.discounts.total;
                // let discounted = this.subTotal - (this.subTotal * (this.submission.discounts.percent / 100));
                return (total + discounted);
            } else {
                return total + this.subTotal;
            }
        },
        firstTransaction() {
            if (this.submission.transactions && this.submission.transactions?.length) {
                return this.submission.transactions[0];
            }
            return false;
        },
        expireDateForCapture() {
            if (this.authorization_date) {
                let timeDifference = null;
                if (this.payment_expiring_at) {
                    var expirationDate = new Date(this.payment_expiring_at * 1000);
                    // Get the current date
                    var currentDate = new Date();
                    // Calculate the difference in milliseconds
                    timeDifference = expirationDate.getTime() - currentDate.getTime();
                }

                if (null != timeDifference && timeDifference <= 0) {
                    return 'expired';
                }

                if (null === timeDifference) {
                    let date = new Date(this.authorization_date);
                    date.setDate(date.getDate() + this.captureValidityInDays);
                    var expirationDate = new Date(date);
                    // Calculate the time difference in milliseconds
                    timeDifference = expirationDate.getTime() - new Date().getTime();
                }
                
                if (timeDifference <= 0) {
                    return 'expired';
                }
                // Calculate the remaining days, hours, and minutes
                var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

                return 'Expires in ' + days + ' days ' + hours + ' hours ' + minutes + ' minutes...';
            }
        },
        isAvailableRefund() {
            const tx = this.submission.transactions?.[0];
            return ['stripe', 'razorpay', 'paystack', 'square'].includes(this.submission.payment_method) && tx?.status === 'paid' && tx?.transaction_type === 'one_time' && !this.submission?.subscriptions?.length;
        }
    },
    methods: {
        handleClose() {
            this.dialogVisible = false;
            this.refundDialogVisible = false;
            this.print_hides = [];
        },
        resetModalState() {
            this.editPaymentStatusModal = false;
            this.editing_payment_status = false;
            this.payment_status_edit_model.status = '';
        },
        formatDate(dateStr) {
            return moment(dateStr).format('MMM DD, YYYY HH:mm A');
        },
        deleteActivity(activity) {
            this.$del(`form/${activity.form_id}/entries/${activity.submission_id}/notes/${activity.id}`, {})
                .then(response => {
                    if (response.success) {
                        this.submission.activities = response.activities;
                        this.$notify.success({
                            title: 'Success',
                            offset: 32,
                            message: response.message,
                            position: 'bottom-right'
                        });
                    } else {
                        this.$notify.error({
                            title: 'Oops!',
                            offset: 30,
                            message: response.data.message,
                            position: 'bottom-right'
                        });
                    }
                })
        },
        getEntry() {
            this.fetching = true;
            // SubmissionController@getSubmission
            this.$get(`form/${this.form_id}/entries/${this.entry_id}`, {})
                .then(response => {
                    this.submission = response.data.submission;
                    this.entry_items = response.data.entry;
                    this.gift_aid = response.data.gift_aid || null;
                    if (this.entry_items && this.entry_items.hasOwnProperty('password')) {   
                        if (this.entry_items.password.value) {  
                            this.entry_items.password.value = '********* (truncated)';
                        }  
                    }
                    this.widgets = response.data.submission.widgets;
                    // this section is for capturing authorized payment
                    this.authorization_date = response.data.submission.transactions[0]?.updated_at;
                    this.capturable_amount = this.orderTotal / 100;
                    this.customer_payment_method = this.submission.customer_payment_method ?? '';
                    this.payment_expiring_at = this.submission.payment_expiring_at ?? '';
                    this.amount_to_be_captured = parseFloat(this.capturable_amount); 
                    // section end    
                    window.WPPayFormsBus.$emit('site_title', 'Entry#' + response.data.submission.id); 
                })
                .always(() => {
                    this.fetching = false;
                });
        },
        getPaymentStatusIcon(status) {
           return paymentStatusIcon(status);
        },
        getPaymentMethodIcon(status) {
            return paymentMethodIcon(status);
        },
        getPaymentCardIcon(card) {
            return paymentCardIcon(card);
        },
        syncSubscription() {
            this.fetching = true;
            this.$get(`form/${this.form_id}/entries/${this.entry_id}/sync-subscription`, {})
                .then(() => {
                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: 'Subscriptions updated!',
                        position: 'bottom-right'
                    });
                    this.getEntry();
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
                    this.fetching = false;
                });
        },
        getFormattedMoney(amount) {
            if (amount === undefined || amount === null) {
                return 'n/a';
            }
            return fromatPrice(amount, this.submission.currencySetting);
        },
        // getPaymentStatusIcon(status) {
        //     if (status == 'pending') {
        //         return 'el-icon-time';
        //     } else if (status == 'paid') {
        //         return 'el-icon-check';
        //     } else if (status == 'failed') {
        //         return 'el-icon-error';
        //     } else if (status == 'refunded') {
        //         return 'el-icon-warning';
        //     }
        //     return '';
        // },
        handleNavClick(type) {
            this.loading = true;
            const query = {
                type: type,
            }
            // SubmissionController@getNextPrevSubmission
            this.$get(`form/${this.submission.form_id}/entries/${this.submission.id}/navigate`,
                query
            )
                .then(response => {
                    this.submission = response.data.submission;
                    this.entry_items = response.data.entry;
                    this.gift_aid = response.data.gift_aid || null;
                    this.entry_id = response.data.submission.id;
                    this.widgets = response.data.submission.widgets;
                    window.WPPayFormsBus.$emit('site_title', 'Entry#' + response.data.submission.id);
                    this.$router.push({
                        name: 'entry',
                        params: { entry_id: response.data.submission.id },
                        query: { form_id: this.form_id }
                    })
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.loading = false;
                });
        },
        submitNote() {
            if (!this.new_note_content) {
                this.$message({
                    message: 'Please provide note',
                    type: 'error'
                });
                return;
            }
            this.adding_note = true;
            // SubmissionController@addSubmissionNote
            this.$post(`form/${this.submission.form_id}/entries/${this.submission.id}/notes`, {
                note: this.new_note_content
            })
                .then(response => {
                    this.submission.activities = response.activities;
                    this.$notify.success({
                        title: 'Success',
                        message: response.message,
                        position: 'bottom-right'
                    });
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.new_note_content = '';
                    this.adding_note = false;
                });
        },
        handleActionCommand(command) {
            if (command == 'payment_status') {
                this.editPaymentStatusModal = true;
                this.editing_payment_status = true;
                this.payment_status_edit_model.status = this.submission.payment_status
            }
        },
        changePaymentStatus() {
            this.$put(`forms/entries/${this.submission.id}/pay-status`, {
                form_id: this.submission.form_id,
                new_payment_status: this.payment_status_edit_model.status,
                status_change_note: this.payment_status_edit_model.note
            })
                .then(response => {
                    // this.editPaymentStatusModal = false;
                    this.$notify.success({
                        title: 'Success!',
                        message: response.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
                    this.payment_status_edit_model = {
                        status: '',
                        note: ''
                    };
                    this.resetModalState();
                    this.getEntry();
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    // this.editing_payment_status = false;
                });
        },
        showCaptureModal(){
            this.show_capture_modal = !this.show_capture_modal;
            this.amount_to_be_captured = this.capturable_amount; 
            this.show_amount_error = false
        },
        captureAmountFromStripe(){
            if (parseFloat(this.amount_to_be_captured) > this.capturable_amount){
                this.show_amount_error = true;
            } else {
                this.show_amount_error = false;
                this.fetching = true;
                this.$post(`form/${this.form_id}/entries/${this.entry_id}/capture-authorized-amount`, {
                    payment_method: this.submission.payment_method,
                    amount_to_be_captured: this.amount_to_be_captured
                })
                    .then((res) => {
                        this.$notify.success({
                            title: 'Success',
                            offset: 30,
                            message: res.data.message,
                            position: 'bottom-right'
                        });
                        this.getEntry();
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
                        this.fetching = false;
                        this.show_capture_modal = false;
                    });
            }
        },
        isUrl(maybeUrl) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(maybeUrl);
        },
        print() {
            if (!this.has_pro) {
                this.show_print_pro = true;
                return;
            }
            this.$htmlToPaper('print_view');
        },
        exportJSON() {
            if (!this.has_pro) {
                this.$message.error('Export JSON is a pro feature. Please upgrade');
            }
            let submission = JSON.parse(JSON.stringify(this.submission));
            submission = omit(submission, 'currencySetting');
            this.downloadObjectAsJson(submission, 'entry_' + submission.id);
        },
        downloadObjectAsJson(exportObj, exportName) {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", exportName + ".json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },
        changeStatus(status) {
            // SubmissionController@changeEntryStatus
            this.$post(`form/${this.submission.form_id}/entries/${this.submission.id}/status`, {
                status: status
            })
                .then(res => {
                    this.submission.status = res.status;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error?.responseJSON?.data?.message || 'Something went wrong. Please try again.',
                        position: 'bottom-right'
                    });
                });
        },
        closeDialog(){
            this.dialogVisible = false;
            this.print_hides = [];
        },
        closeRefundModal() {
            this.refundDialogVisible = false;
        }
    },
    mounted() {
        if (this.$route.query.form_id) {
            this.form_id = this.$route.query.form_id;
        }
        this.getEntry();
        this.show_empty = this.getFromStore('show_empty_entry_field', false);

        // this.hide_sidebar = this.getFromStore('entry_sidebar_status', 'no');

    }
}
</script>