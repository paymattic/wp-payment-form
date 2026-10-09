<template>
    <div class="wpf_content_wrapper_parent_v2 wpf-customer-profile" v-loading="fetchingCustomer">
        <Header :customer_email="customer_email"></Header>
        <div class="customer_data_wrapper">
            <div class="profile-section">
                <div class="subscription_section">
                    <Subscription v-if="!fetchingCustomer && subscriptions.length" :subscriptions="subscriptions">
                    </Subscription>

                    <div class="engagement">
                        <EngagementForm :engagements="engagements" :fetchingEngagements="fetchingEngagements" :customer_email="customer_email"/>
                    </div>

                    <!-- <app-card> -->
                        <!-- <div slot="header">
                            <h3>{{ $t('Customer Spent vs date Graph') }}</h3>
                        </div> -->
                        <div style="width: 100%;" slot="body" class="wpf_customer_content_wrapper" v-if="hasRevenueChartData">
                            <RevenuePeriodChartVue
                                :selectedCurrency="selectedCurrencyGraph"
                                :chartData="revenueChartFiltered"
                                :toggleOptions="revenueOptions"
                                :allChartData="revenueChartDataAll"
                                :chartTitle="'Customer Spent vs date Graph'"
                                :specificCustomer="true"
                            >
                                <div slot="footer" style="display: flex; justify-content: center; gap: 20px;">
                                    <p><i class="el-icon-top"></i> {{ $t('Customer Spent') }}</p>
                                    <p><i class="el-icon-right"></i> {{ $t('Date Graph') }}</p>
                                </div>
                            </RevenuePeriodChartVue>
                        </div>
                    <!-- </app-card> -->

                    <div class="wpf_customer_content_wrapper activity-section">
                        <app-card>
                            <div slot="header" style="display: flex; justify-content: space-between; align-items: center;">
                                <h3>{{ $t('Activity') }}</h3>
                                <div class="" style="display: flex; justify-content: end; gap: 20px;">
                                    <div class="wpf_modules_date">
                                        <el-date-picker @change="filterByDate" v-model="dateRange"
                                            format="dd-MMMM-yyyy" type="daterange" size="mini"
                                            start-placeholder="Start Date" end-placeholder="End Date">
                                        </el-date-picker>
                                    </div>

                                    <div class="wpf_modules_forms">
                                        <el-select @change="filterByStatus()" size="mini" v-model="payment_status"
                                            placeholder="All">
                                            <el-option label="All" value=""></el-option>
                                            <el-option v-for="(status, status_key) in available_statuses"
                                                :key="status_key" :label="status" :value="status_key">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>

                            <div slot="body" style="width: 100%;">
                                <div class="wpf_customer_activity" element-loading-text="Loading..."
                                    element-loading-spinner="el-icon-loading" v-loading="fetchingProfile">
                                    <!-- {{ filtered_entries }} -->
                                    <el-table v-if="!filterRelatedPayments.length" class="wpf_customer_engagement_table" :data="filtered_entries" empty-text="No Entries found!" style="width: 100%">
                                        <el-table-column width="110" label="Entry ID">
                                            <template slot-scope="scope">
                                                <router-link style="margin-right: 5px;"
                                                    :to="{ name: 'entry', params: { entry_id: scope.row.id, form_id: scope.row.form_id } }">
                                                    {{ scope.row.id }}
                                                </router-link>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="created_at" label="Submission Date" width="230">
                                            <template slot-scope="scope">
                                                <span class="creation_time">{{ scope.row.created_at | dateFormat('MMM DD, YYYY h: mm a')}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="payment_total" :label="$t('Amount')" width="220">
                                            <template slot-scope="scope">
                                                <span class="payment_amount"
                                                    v-html="getFormattedMoney(scope.row.payment_total, scope.row.currency_settings) + ' ' + getFormattedLetter(scope.row.currency)"></span>
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="payment_method" :label="$t('Payment Method')" width="160">
                                            <template slot-scope="scope">
                                                <Icon v-if="scope.row.payment_method" :icon="getPaymentMethodIcon(scope.row.payment_method)" /> 
                                            </template>
                                        </el-table-column>]
                                        <el-table-column v-if="!filtered_entries[0]?.subscription_id" prop="payment_status" :label="$t('Payment Status')" width="145">
                                            <template slot-scope="scope">
                                                <span v-if="scope.row.payment_method" :class="'wpf_paystatus_badge wpf_pay_status_' + scope.row.payment_status">
                                                    <Icon style="width: 10px;" :icon="getPaymentStatusIcon(scope.row.payment_status)" /> {{ scope.row.payment_status }}
                                                </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="status" :label="$t('Status')"  width="140">
                                        </el-table-column>
                                    </el-table>

                                    <el-table v-if="filterRelatedPayments.length" class="wpf_customer_engagement_table" :data="filterRelatedPayments" max-height="453"
                                        empty-text="No Entries found!">
                                        <el-table-column width="110" label="Entry ID">
                                            <template slot-scope="scope">
                                                <router-link style="margin-right: 5px;"
                                                    :to="{ name: 'entry', params: { entry_id: scope.row.transactions.submission_id, form_id: scope.row.transactions.form_id } }">
                                                    {{ scope.row.transactions.submission_id }}
                                                </router-link>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="item_name" label="Item Name" width="220">
                                        </el-table-column>
                                        <el-table-column prop="payment_total" :label="$t('Amount')" width="170">
                                            <template slot-scope="scope">
                                                <span class="payment_amount"
                                                    v-html="getFormattedMoney(scope.row.transactions.payment_total, scope.row.transactions.currency_settings) + ' ' + getFormattedLetter(scope.row.transactions.currency)"></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="payment_method" :label="$t('Payment Method')" width="160">
                                            <template slot-scope="scope">
                                                <Icon v-if="scope.row.transactions.payment_method" :icon="getPaymentMethodIcon(scope.row.transactions.payment_method)" /> 
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="created_at" label="Submission Date" width="230">
                                            <template slot-scope="scope">
                                                <span class="creation_time">{{ scope.row.transactions.created_at | dateFormat('MMM DD, YYYY h: mm a')}}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </app-card>
                    </div>
                </div>
                <div class="profile-info">
                    <Profile :info="info" :fetchingProfile="fetchingProfile" :customer_email="customer_email"
                        :spends="spends" :permissions="permissions" :user_id="user_id"></Profile>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { paymentStatusIcon, paymentMethodIcon } from '@admin/Components/helper.js';
import priceFormat from '../../../../common/formatPrice.js';
import Header from './Header.vue';
import Profile from './_Profile.vue';
import moment from 'moment';
import size from 'lodash/size';
import cardChart from '../../Reports/CardChart.vue';
import RevenuePeriodChartVue from '../../Reports/RevenuePeriodChart.vue';
import Subscription from './_Subscription.vue';
import EngagementForm from './EngagementForm.vue';
import AppCard from '@admin/Components/Common/AppCard.vue';
import Icon from '@admin/Components/Icons/Index.vue';

export default {
    name: 'customer',
    components: {
        cardChart,
        RevenuePeriodChartVue,
        Header,
        Profile,
        Subscription,
        EngagementForm,
        AppCard,
        Icon
    },
    data() {
        return {
            fetchingCustomer: false,
            fetchingProfile: false,
            fetchingEngagements: false,
            customer_email: '',
            entries: [],
            engagements: [],
            filtered_entries: [],
            filterable_entries: [],
            info: [],
            subscriptions: [],
            payments: [],
            permissions: [],
            user_id: 0,
            spends: [],
            customer_since: '',
            payment_status: '',
            dateRange: '',
            startDate: '',
            endDate: '',
            revenueOptions: [],
            hasRevenueChartData: false,
            selectedCurrencyGraph: 'USD',
            filterRelatedPayments: [],
            filterActivity: {
                payment_status: '',
                start: '',
                end: ''
            },
            available_statuses: {
                'paid': 'Paid',
                'processing': 'Processing',
                'pending': 'Pending',
                'refunded': 'Refunded',
                'failed': 'Failed'
            },
            customerChart: {
            },
            revenueChartDataAll: [],
            revenueChartFiltered: {
                id: 'revenue_chart',
                type: 'line',
                height: '80',
                title: 'Total Revenue',
                color: '#7be873',
                backgroundColor: 'rgb(186 255 181 / 31%)'
            }
        }
    },
    watch: {
        filterActivity: {
            handler(filterData, sec, th) {
                const { payment_status, start, end } = filterData;
                this.filtered_entries = this.entries.filter((entrie) =>
                    //No status no date
                    (!payment_status && !start) ||
                    //Status or date
                    (!start && payment_status && entrie.payment_status.toLowerCase().includes(payment_status.toLowerCase())) ||
                    (!payment_status && start && end && (filterData?.start <= this.mySqlDateToJsDate(entrie?.created_at) && filterData?.end >= this.mySqlDateToJsDate(entrie?.created_at))) ||
                    // status and date
                    ((payment_status && entrie.payment_status.toLowerCase().includes(payment_status.toLowerCase())) && start && end && (filterData?.start <= this.mySqlDateToJsDate(entrie?.created_at) && filterData?.end >= this.mySqlDateToJsDate(entrie?.created_at)))
                );
            },
            deep: true
        },
    },
    methods: {
        changeCurrencyGraph() {
            this.updateScales(window[this.revenueChartFiltered.id]);
        },
        getCustomer() {
            this.fetchingCustomer = true;
            this.$get(`reports/customers/${this.customer_email}`, {
            }).then(response => {
                this.entries = response.entries;
                this.filtered_entries = response.entries;
                this.info = response.info;
                this.subscriptions = response.subscriptions;
                this.payments = response.orders;
                this.filterRelatedPayments = response.subscriptions.map(sub => ({
                    item_name: sub.item_name,
                    transactions: sub.subscription_payments.transactions
                }));
                this.fetchingCustomer = false;
            }).always(() => {
                this.fetchingCustomer = false;
            });
        },
        getCustomerProfile() {
            this.fetchingProfile = true;
            this.$get(`reports/customers/${this.customer_email}/profile`, {
            }).then(response => {
                this.spends = response.spends;
                this.user_id = response.permissions.user_id;
                this.permissions = response.permissions;

                this.fetchingProfile = false;
            }).always(() => {
                this.fetchingProfile = false;
            });
        },
        getFormattedMoney(amount, currency) {
            if (!amount) {
                return 'n/a';
            }
            return priceFormat(amount, currency);
        },
        getPaymentStatusIcon(status) {
            return paymentStatusIcon(status);
        },
        getPaymentMethodIcon(method) {
            return paymentMethodIcon(method);
        },
        getCustomerEngagements() {
            this.fetchingCustomer = true;
            this.fetchingEngagements = true;
            this.$get(`reports/customers/${this.customer_email}/engagements`, {
            }).then(response => {
                this.fetchingEngagements = false;
                this.engagements = response.customers;
                // chart data formation
                this.revenueOptions = response.graphicalData.options
                this.revenueChartDataAll = response.graphicalData.chartData;
                if (!this.revenueChartDataAll.USD) {
                    this.selectedCurrencyGraph = Object.keys(this.revenueChartDataAll)[0];
                }
                let graphData = this.revenueChartDataAll[this.selectedCurrencyGraph];
                this.revenueChartFiltered.data = graphData.data;
                this.revenueChartFiltered.label = graphData.label;
                this.hasRevenueChartData = true;
            }).always(() => {
                this.fetchingCustomer = false;
                this.fetchingEngagements = false;
            });
        },
        mySqlDateToJsDate(date) {
            return moment(date).endOf('day').diff(moment(), 'days') - 1;
        },
        filterByDate() {
            this.filterActivity.start = this.dateRange == null ? '' : moment(this.dateRange[0]).diff(moment(), 'days');
            this.filterActivity.end = this.dateRange == null ? '' : moment(this.dateRange[1]).diff(moment(), 'days');
        },
        filterByStatus() {
            this.filterActivity.payment_status = this.payment_status;
        },
        getFormattedLetter(currency) {
            if (!currency) {
                return '';
            }
            return currency.toUpperCase();
        }
    },
    mounted() {
        this.customer_email = this.$route.params.email_id;
        this.getCustomer();
        this.getCustomerProfile();
        this.getCustomerEngagements();
    },
}
</script>

<style lang="scss">
// .wpf_customer_profile_avatar {
//     width: 100%;
//     margin: 0 auto;
//     img {
//         border-radius: 50%;
//         width: 80px;
//         height: 80px;
//         border: 6px solid #e6ebf0;
//         max-width: 100px;
//         margin: 0 auto;
//     }
// }
// .wpf_customer {
//     &_engagement_table {
//         border: 1px solid #f1f0f0 !important;
//         border-radius: 5px;
//         .el-table__cell {
//             padding: 6px 0 !important;
//         }
//     }
//     &_content_wrapper {
//         margin-bottom: 32px;
//         h3 {
//             font-size: 17px;
//         }
//         .wpf_rev_currency_toggler {
//             padding: 0px 35px;
//         }
//     }
//     &_subscription_item {
//         &_view {
//             margin-right: 10px;
//         }
//         display: flex;
//         justify-content: space-between;
//         border: 1px solid #f0eeee;
//         padding: 8px 20px;
//         margin-bottom: 16px;
//         border-radius: 7px;
//         .head_small_title {
//             font-size: 14px;
//             font-weight: 400;
//         }
//     }
//     &_title {
//         text-transform: uppercase;
//         font-size: 0.625rem;
//         letter-spacing: 0.0625rem;
//         color: #818ea3;
//     }
//     &_profile_activity{
//         margin: 40px 0px;
//         .user_roles {
//             color: #00bcd4;
//             padding: 2px 11px;
//             border: 1px solid #ccc;
//             margin-right: 12px;
//             border-radius: 11px;
//         }
//     }
//     &_profile_name{
//         .customer_name {
//             margin-bottom: 42px;
//             text-align: center;
//         }
//         .customer_email {
//             font-size: 14px;
//             font-weight: 300;
//             margin: 0 !important;
//             font-style: italic;
//             color: #8c8c8c;
//         }
//     }
//     &_data_wrapper {
//         max-width: 1100px;
//         background: white;
//         margin: 23px auto !important;
//         padding: 25px;
//         .summary_item {
//             border-bottom: 1px dashed #e7e7e7;
//             p {
//                 margin: 3px;
//             }
//             display: flex;
//             justify-content: space-between;
//         }
//     }
//     &_activity{
//         td {
//             padding: 10px;
//             .has_payment{
//                 &_paid {
//                     color: green;
//                 }
//                 &_failed {
//                     color: #ed1e1e;
//                 }
//                 &_pending {
//                     color: #eda21e;
//                 }
//                 &_processing {
//                     color: #4f94d4;
//                 }
//                 &_refunded {
//                     color: #7f807f;
//                 }
//             }
//             .payment_status {
//                 border: 1px solid #ccc;
//                 border-radius: 11px;
//                 padding: 2px 10px;
//                 text-transform: capitalize;
//             }
//             span.creation_time,
//             .form_name {
//                 font-weight: 200;
//             }
//         }
//     }

//     &_profile_wrapper {
//         // margin-top: 120px;
//         border-radius: 7px;
//     }
// }
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>