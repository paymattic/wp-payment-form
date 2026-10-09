<template>
    <div>
        <div class="wpf_content_wrapper_parent_v2">
            <DashboardNotices v-if="displayNotice" :displayNotice="displayNotice"/>
            <div v-if="parseInt(entries_count) === 0" style="width: 70%; margin: 0 auto;">
                <div style="text-align: center; margin-top: 60px; ">
                    <div style="padding:34px; background: white; border-radius: 8px;">
                        <p>You have {{forms_count}} forms & {{entries_count}} entries</p>
                        <p style="font-size: 15px; font-weight: 500;">
                            There is no sufficient data to generate the report !
                        </p>
                        <el-button @click="changeRoute('entries')"
                            target="_blank"
                            size="small" type="primary"
                        >
                            See submissions
                        </el-button>
                    </div>
                </div>
            </div>

            <div v-else>
                <AppCard class="payment_stats_overview">

                    <template slot="header">
                        <div class="payform_section_header">
                            <h2 class="payform_gateway_title">
                                {{ $t('Reports Overview') }}
                            </h2>
                            <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap">
                                <el-date-picker
                                    v-model="over_view_date_picker"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="Start date"
                                    style="width: 250px;"
                                    @change="filterReports('', over_view_date_picker)"
                                    end-placeholder="End date">
                                </el-date-picker>

                                <!-- <el-select @change="getPaymentReports()" filterable size="mini" v-model="selectedCurrencyForOverview"
                                    label="currency">
                                    <el-option v-for="currencies in revenueOptions" :key="currencies.value" :label="currencies.label"
                                        :value="currencies.value">
                                    </el-option>
                                </el-select> -->

                                <div class="wpf_entries_status">
                                    <ul>
                                        <li v-for="(option, key) in dateFilterLabel" :key="key" @click="filterReports(option.value)"
                                            :class="{ active: currentOption === option.value }">
                                            {{ option.label }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template slot="body">
                        <div class="payform_section_body wpf_report_over_view" style="width: 100%;">
                            <OverViewCard :item="totalRevenueReports" :filter_label="$t('Total Revenue')" :icon="'wpf-money-bag'" :color="'#FEF4E6'" :redirectUrl="getRedirectUrl('paid')" />
                            <OverViewCard :item="totalPendingRevenue" :filter_label="$t('Pending Payments')" :icon="'wpf-submissions'" :color="'#F0ECFD'" :redirectUrl="getRedirectUrl('pending')" />
                            <OverViewCard :item="customerReports" :filter_label="$t('Total Customers')" :color="'#FCEBE6'" :redirectUrl="getRedirectUrl('paid', 'customers')" />
                            <OverViewCard :item="submissionReports" :filter_label="$t('Total Entries')" :color="'#E6F2FE'" :redirectUrl="getRedirectUrl('paid')" />
                        </div>
                    </template>

                </AppCard>

                <div>
                    <!-- <CardChart v-if="hasStatisticsData" :chartProps="methodsData" :chartOptions="statusChartOptions"></CardChart> -->
                    <div class="wpf_revenue_chart_container">
                        <div class="wpf_line_chart">
                            <RevenuePeriodChartVue
                            :chartData="revenueChartFiltered"
                            :selectedCurrency="selectedCurrencyGraph"
                            :toggleOptions="revenueOptions"
                            :allChartData="revenueChartDataAll"
                            chartTitle="Revenue for Period"
                            :specificCustomer="false"
                            @recentRevenues="recentRevenues"
                            ></RevenuePeriodChartVue>
                        </div>
                        <!-- <AppCard class="revenue_for_period_card">
                            <template slot="header">
                                <h3>Revenue for Period</h3>
                            </template>
                            <template slot="body">
                            </template>
                        </AppCard> -->
                        <div class="wpf_pie_chart">
                            <h3 class="chart_title">{{ $t('Payment Methods') }}</h3>

                            <div class="payment_status_graph_wrapper" style="margin-top: 40px;">
                                <CardChart v-if="hasStatisticsData" class="chart"  :chartProps="methodsData" :chartOptions="statusChartOptions"></CardChart>
                                <div v-if="hasStatisticsData" class="performance_description">
                                    <ul>
                                        <li v-for="(method, i) in methodsData.label" :key="method">
                                            <span class="color" :style="getColor(i)"></span>
                                            <span>{{method}}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div v-else class="wpf_empty_graph">
                                    <div style="text-align: center;">
                                        <Icon icon="wpf-empty-graph" />
                                        <p>No data available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AppCard class="recent_transaction">
                        <template slot="header">
                            <div class="payform_section_header">
                                <h2 class="payform_gateway_title">
                                    {{ $t('Recent Transactions') }}
                                </h2>
                            </div>
                        </template>

                        <template slot="body">
                            <el-table
                                v-if="hasPaymentsActivity()"
                                :data="paymentsActivity"
                                style="width: 100%"
                                max-height="400"
                            >
                                <el-table-column
                                    prop="post_title"
                                    label="Form"
                                    min-width="280">
                                </el-table-column>
                                <el-table-column
                                    prop="customer_name"
                                    label="Name"
                                    min-width="180"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="updated_at"
                                    label="Date"
                                    min-width="220"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="formattedTotal"
                                    label="Amount"
                                    min-width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                    prop="payment_status"
                                    label="Status"
                                    min-width="120"
                                    >
                                    <template slot-scope="scope">
                                        <div class="payment_status">
                                            <div :class="`badge ${scope.row.payment_status}`">
                                                <Icon :icon="getPaymentStatusIcon(scope.row.payment_status)" /> {{scope.row.payment_status}}
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    min-width="140"
                                    fixed="right">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            @click="changeRoute(`/edit-form/${scope.row.form_id}/entries/${scope.row.id}/view`)"
                                        >
                                            {{ $t('View Details') }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-else class="wpf_empty_graph">
                                <div style="text-align: center;">
                                    <Icon icon="wpf-empty-graph" />
                                    <p>No data available</p>
                                </div>
                            </div>
                        </template>
                    </AppCard>
                    
                    <div class="wpf_performance_container wpf_revenue_chart_container">

                        <div class="wpf_performance wpf_chart_shadow">
                           <div>
                                <div class="wpf_performance_header">
                                    <h3>{{ $t('Payment Statuses') }}</h3>
                                </div>
                                <div v-if="hasStatisticsData">
                                    <div class="wpf_performance_item" style="padding: 0px 19px;">
                                        <CardChart  v-if="hasStatisticsData" :chartProps="paymentStatuses" :chartOptions="statusChartOptions"></CardChart>
                                    </div>
                                    <p style="padding: 8px 19px 0px 19px; ">
                                        <i style="color: black; font-size: 11px;" class="el-icon-info"></i>
                                        {{ $t(`The Payment statuses represents a bar chart about the payment
                                        status for the number of paid, pending, processing, refunded and failed transactions on your site.`) }}
                                    </p>
                                </div>
                                <div v-else class="wpf_empty_graph">
                                    <div style="text-align: center;">
                                        <Icon icon="wpf-empty-graph" />
                                        <p>No data available</p>
                                    </div>
                                </div>
                           </div>
                        </div>
                        <activities  class="activities" v-loading="loading" :payments_activity="paymentsActivity" :customers="topCustomer" :currencies="revenueOptions" @change-customers="changeCustomers" :filter="filter_data"/>
                    </div>

                    <div class="wpf_performance_container">
                        <AppCard class="revenue_breakdown">
                            <template slot="header">
                                <div class="payform_section_header">
                                    <h2 class="payform_gateway_title">
                                        {{ $t('Revenue breakdown')}} 
                                    </h2>
                                    <el-select @change="changeCurrency()" filterable size="mini" v-model="selectedCurrency" label="currency" style="min-width: 38%; margin-right: 2px">
                                        <el-option
                                            v-for="currencies in revenueOptions"
                                            :key="currencies.value"
                                            :label="currencies.label"
                                            :value="currencies.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                            <template slot="body">
                                <RevenueBreakdown v-if="revenueTableData?.length > 0" :revData="revenueTableData" />
                                <div v-else class="wpf_empty_graph">
                                    <div style="text-align: center;">
                                        <Icon icon="wpf-empty-graph" />
                                        <p>No data available</p>
                                    </div>
                                </div>
                            </template>
                        </AppCard>
                        <div class="form_stats">
                            <AppCard>
                                <template slot="header">
                                    <div class="payform_section_header">
                                        <h2 class="payform_gateway_title">
                                            {{ $t('Form Stats') }}
                                        </h2>
                                        <el-select filterable size="mini" v-model="form_id" placeholder="Forms" style="min-width: 64%; margin-right: 2px">
                                            <el-option label="Forms" value="0"></el-option>
                                            <el-option
                                                v-for="form in available_forms"
                                                :key="form.ID"
                                                :label="form.post_title + ' (ID: '+form.ID+')'"
                                                :value="form.ID">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </template>
                                <template slot="body">
                                    <FormStats
                                        :formReportsTotal="formReportsTotal"
                                        :reports="reports"
                                        :form_id="form_id"
                                        :currencySettings="currencySettings"
                                        :isPaymentForm="isPaymentForm"
                                    />
                                </template>
                            </AppCard>
                        </div>
                    </div>
                </div>
                <!-- active subscription list (latest) -->
                <AppCard class="recent_transaction" style="position: relative">
                        <template slot="header">
                            <div class="payform_section_header">
                                <h2 class="payform_gateway_title" style="display: flex; gap: 10px;">
                                    {{ $t('Active Subscriptions') }} <Icon icon="wpf-upgrade" />
                                </h2>
                                <el-button :class="{'disabled_content': !has_pro}" size="mini" @click="changeRoute('entries?filter=subscription')">
                                    {{ $t('All Subscriptions') }} </el-button>
                            </div>
                        </template>

                        <template slot="body">
                            <UpgradeNotice  v-if="!has_pro" title="This is a pro version feature." :type="('cart')" style="top: 55% !important;"/>
                            <el-table
                                v-if="hasSubscriptions()"
                                :data="latestSubscriptions"
                                style="width: 100%"
                                max-height="400"
                                :class="{'disabled_content': !has_pro}"
                            >
                                <el-table-column
                                    prop="post_title"
                                    label="Form"
                                    min-width="280">
                                </el-table-column>
                                <el-table-column
                                    prop="customer_name"
                                    label="Name"
                                    min-width="180"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="plan_name"
                                    label="Subscription Plan"
                                    min-width="180"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="subscription_date"
                                    label="Subscription Date"
                                    min-width="220"
                                    >
                                    <template slot-scope="scope">
                                        {{formateDate(scope.row.subscription_date)}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="recurring_amount"
                                    label="Recurring amount"
                                    min-width="140"
                                    >
                                    <template slot-scope="scope">
                                        {{scope.row.recurring_amount / 100}} {{scope.row.currency}} 
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="payment_total"
                                    label="Total Amount"
                                    min-width="120"
                                    >
                                    <template slot-scope="scope">
                                        {{scope.row.payment_total / 100}} {{scope.row.currency}} 
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="bill_count"
                                    label="Billing Count"
                                    min-width="120"
                                    >
                                </el-table-column>
                                <el-table-column
                                    min-width="140"
                                    fixed="right">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            @click="changeRoute(`/edit-form/${scope.row.form_id}/entries/${scope.row.submission_id}/view`)"
                                        >
                                            {{ $t('View Details') }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-else class="wpf_empty_graph" :class="{'disabled_content': !has_pro}">
                                <div style="text-align: center;">
                                    <Icon icon="wpf-empty-graph" />
                                    <p>No data available</p>
                                </div>
                            </div>
                        </template>
                </AppCard>
                <AppCard class="recent_coupon_card" style="position: relative;">
                    <template slot="header">
                        <div class="payform_section_header">
                            <h2 class="payform_gateway_title">
                                {{ $t('Recent Applied Coupons') }}
                            </h2>
                            <el-button :class="{'disabled_content': !has_pro}" size="mini" @click="changeRoute('entries?filter=coupon')">
                                {{ $t('All Coupons') }} </el-button>
                        </div>
                    </template>
                    <template slot="body">
                        <UpgradeNotice v-if="!has_pro" title="This is a pro version feature." :type="('cart')" style="top: 55% !important;"/>
                        <el-table
                            v-if="has_pro && recentCoupons.length > 0"
                            :data="recentCoupons"
                            style="width: 100%"
                            max-height="400"
                            :class="{'disabled_content': !has_pro}"
                        >
                            <el-table-column
                                prop="form_name"
                                label="Form"
                                min-width="280">
                            </el-table-column>
                            <el-table-column
                                prop="submission_id"
                                label="Submission ID"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="item_name"
                                label="Coupon"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="customer_name"
                                label="Customer"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="customer_email"
                                label="Email"
                                min-width="180"
                            ></el-table-column>
                            <el-table-column
                                prop="line_total"
                                label="Discount"
                                min-width="120"
                            >
                                <template slot-scope="scope">
                                    {{scope.row.line_total / 100}} {{scope.row.currency}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="created_at"
                                label="Created At"
                                min-width="120"
                            >
                                <template slot-scope="scope">
                                    {{formateDate(scope.row.created_at)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                min-width="140"
                                fixed="right">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        @click="changeRoute(`/edit-form/${scope.row.form_id}/entries/${scope.row.submission_id}/view`)"
                                    >
                                        {{ $t('View Details') }}
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-else class="wpf_empty_graph" :class="{'disabled_content': !has_pro}">
                            <div style="text-align: center;">
                                <Icon icon="wpf-empty-graph" />
                                <p>No data available</p>
                            </div>
                        </div>
                    </template>
                </AppCard>
                <!-- <AppCard class="revenue_for_period_card" v-else>
                    <template slot="header">
                        <h3>Active Subscriptions</h3>
                    </template>
                    <template slot="body">
                        <UpgradeNotice  title="This is a pro version feature." />
                    </template>
                </AppCard> -->
            </div>
        </div>
        <!-- <div v-else> -->
            <!-- <UpgradeNotice title="Reports module is a pro version feature"/> -->
            <!-- <div class="wpf_customer_report_pro" style="min-height: 100vh; background-size: cover;"
                :style="{ 'background-image': 'url(' + assetsUrl('/images/promotions/reports-upgrade.png') + ')' }">
            </div> -->
            <!-- <img style="width:100%" :src="assetsUrl('/images/promotions/reports-upgrade.png')" alt=""> -->
        <!-- </div> -->
    </div>
</template>
<script>
import moment from 'moment';
import CardChart from './CardChart.vue';
import RevenueBreakdown from './RevenueBreakdown.vue';
import Activities from './Activities.vue';
import UpgradeNotice from '../Common/UpgradeNotice.vue';
import RevenuePeriodChartVue from './RevenuePeriodChart.vue';
import AppCard from '../Common/AppCard.vue';
import OverViewCard from './Pieces/OverViewCard.vue';
import FormStats from './FormStats.vue';
import DashboardNotices from '../pieces/DashboardNotices.vue';
import Icon from '../Icons/Index.vue';
import { paymentStatusIcon } from '../../Components/helper.js';
// import OverViewCard from './Pieces/OverViewCard.vue';

import { dateFilterLabels, getFilterDate, LastThirtyDays } from './reports_helper.js';
export default({
    name: 'Reports',
    components: {
        CardChart,
        RevenueBreakdown,
        Activities,
        UpgradeNotice,
        RevenuePeriodChartVue,
        AppCard,
        OverViewCard,
        Icon,
        FormStats,
        DashboardNotices
    },
    data() {
        return {
            over_view_date_picker: '',
            dateFilterLabel: [],
            selectedCurrencyForOverview: window.wpPayFormsAdmin.default_currency || 'USD',
            filter_data: {},
            currentOption: '',
            has_pro: window.wpPayFormsAdmin.has_pro,
            entries_count: window.wpPayFormsAdmin.entries_count,
            forms_count: window.wpPayFormsAdmin.forms_count,
            hasStatisticsData: false,
            hasData: false,
            hasWeeklyData: false,
            loading: false,
            showTotals: false,
            hasRevenueChartData: false,
            form_id: 0,
            formReportsTotal: {
                submission_count: 0
            },
            currencySettings: {},
            reports: {},
            isPaymentForm: true,
            revenueTableData: [],
            revenueData: {},
            revenueOptions: [],
            selectedCurrency: window.wpPayFormsAdmin.default_currency || 'USD',
            selectedCurrencyGraph: window.wpPayFormsAdmin.default_currency || 'USD',
            revenueChartDataAll: [],
            displayNotice: false,
            revenueChartFiltered: {
                id: 'revenue_chart',
                type: 'line',
                height: 'auto',
                title: 'Total Revenue',
                color: '#6B3CEB',
                backgroundColor: 'rgba(107, 60, 235, 0.1)',
            },
            totalRevenue: {
                id: 'total_revenue',
                title: 'Total Revenue',
                type: 'line',
                height: '70',
                value: [],
                label: [],
                data: [],
                color: 'rgb(7,123,254)',
                backgroundColor: '#E7F0FD',
            },
            paymentsActivity: [],
            available_forms: [
                {
                    'post_title': 'select a form',
                    'ID': 0
                }
            ],
            weeklyRevenue: {
                'title': this.$t('Weekly Revenue'),
                'value': [],
            },
            topCustomer: {},
            overviewOptions: {
                elements: {
                    line: {
                        tension: 0.2,
                    },
                    point:{
                        radius: 0
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        display: false,
                        grid: {
                            display: false,
                        },
                        beginAtZero: true
                    },
                    y: {
                        display: false,
                        grid: {
                            display: false
                        }
                    }
                }
            },
            customerReports: {
                'title': this.$t('Total Customers'),
                'value': 0,
                'change': '0%',
            },
            submissionReports: {
                'title': this.$t('Total Paid Submissions'),
                'value': 0,
                'change': '0%',
            },
            totalRevenueReports: {
                'title': this.$t('Total Revenue'),
                'value': 0,
                'change': '',
                'currency': ''
            },
            totalPendingRevenue: {
                'title': this.$t('Pending Payments'),
                'value': 0,
                'change': '',
                'currency': ''
            },
            statusChartOptions: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.formattedValue +' submissions';
                            }
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        barPercentage: 1,
                        categoryPercentage: 0.6
                    }],  
                }
            },
            methodsData: {},
            paymentStatuses: {},
            latestSubscriptions: [],
            recentCoupons: [],
        }

    },
    watch:{
        form_id: function(){
            this.changeForm();
        },
        filter_data: {
            handler: function(){
                this.getPaymentReports();
                this.getCustomerAndSubmissionReports();
                // this.getPaymentStatistics();
                // this.recentRevenues();
            },
            deep: true
        }
    },
    methods: {
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + path;
        },
        hasSubscriptions() {
            return this.latestSubscriptions?.length > 0;
        },
        hasPaymentsActivity() {
            return this.paymentsActivity?.length > 0;
        },
        getRedirectUrl(status, route = 'entries') {
            return {
                name: route,
                query: {
                    startDate: this.filter_data.startDate,
                    endDate: this.filter_data.endDate,
                    status: status,
                }
            };
        },
        getPaymentStatusIcon(status) {
            return paymentStatusIcon(status);
        },
        filterReports(option = 'last_30_days', date = null) {
            if (date) {
                let start_date = moment(date[0]).format('YYYY-MM-DD');
                let end_date = moment(date[1]).format('YYYY-MM-DD');
                this.filter_data = {
                    startDate: start_date,
                    endDate: end_date
                };
                this.currentOption = '';
            } else {
                this.filter_data = getFilterDate(option);
                this.currentOption = option;
                this.over_view_date_picker = '';
            }
        },
        changeRoute(route){
            if(!this.has_pro){
                return;
            }
            this.$router.push({path: route});
        },
        changeCurrency(){
            this.revenueTableData = this.revenueData[this.selectedCurrency];
        },
        changeCustomers(filteredCustomers){
          this.topCustomer = filteredCustomers;
        },
        changeForm() {
            this.$get(`form/${this.form_id}/entries/reports`)
            .then(response => {
                this.formReportsTotal = response.data.reports.total;
                this.currencySettings = response.data.currencySettings;
                this.reports = response.data.reports;
                this.isPaymentForm = response.data.is_payment_form;
            });
        },
        lackOfData(errors){
            this.$message({
                offset: 30,
                message: 'You have very little data to display reports.',
                type: 'warning'
            });
        },
        getColor(i) {
            return 'background:' + this.methodsData.backgroundColor[i];
        },
        getPaymentStatistics() {
            this.$get('reports/statistics', {
             })
                .then((response) => {
                    this.hasStatisticsData = true;
                    this.paymentStatuses = response.payment_statuses;
                    this.methodsData = response.payment_methods;
                })
                .fail(errors => {
                    this.lackOfData(errors);
                })
        },
        getCustomerAndSubmissionReports() {
            this.$get('reports/todays-data', {
                filter: this.filter_data,
                duration: this.currentOption
             })
                .then((response) => {
                    // this.weeklyRevenue = response.revenueWeekly;
                    this.customerReports = response.data.customerReports;
                    this.submissionReports = response.data.submissionReports;
                    this.totalRevenueReports = response.data.totalRevenue;
                    this.totalPendingRevenue = response.data.totalPendingRevenue;
                    // this.hasWeeklyData = true;
                })
                .fail(errors => {
                    this.lackOfData(errors);
                })
        },
        getPaymentReports() {
            this.$get('reports', {
                filter: this.filter_data
             })
                .then((response) => {
                    window.wpPayFormsAdmin.entries_count = response.entries_count;
                    this.paymentsActivity = response.payments;
                    this.latestSubscriptions = response.latest_subscriptions;
                    this.recentCoupons = response.recent_coupons;
                    this.topCustomer = response.customer;
                    this.totalRevenue.value = response.currency_base;
                    this.totalRevenue.data = response.chart.data;
                    this.totalRevenue.label = response.chart.label;
                })
                .fail(errors => {
                    this.lackOfData(errors);
                })
        },
        getForms() {
            this.$get('forms/formatted', {
             })
                .then((response) => {
                    this.available_forms = response.available_forms;
                    if (response.available_forms.length > 0) {
                        this.form_id = this.available_forms[0].ID;
                    }
                })
                .fail(errors => {
                    this.lackOfData(errors);
                })
        },
        recentRevenues(filter_data = {}) {
            this.$get('reports/recent-revenues', {
                filter: filter_data
             })
                .then((response) => {
                    //table data
                    this.revenueData = response.data;
                    this.revenueOptions = response.options;
                    this.revenueTableData = response.data[this.selectedCurrency];
                    // chart data
                    this.revenueChartDataAll = response.chartData;
                    let graphData = response.chartData[this.selectedCurrencyGraph];

                    this.revenueChartFiltered.data = this.totalRevenue.data = graphData.data;
                    this.revenueChartFiltered.label = this.totalRevenue.label = graphData.label;
                    this.hasRevenueChartData = true;
                    // this.$refs.revenuePeriodChart.changeCurrencyGraph();
                })
                .fail(errors => {
                    this.lackOfData(errors);
                })
        },
        formateDate(date){
            return moment(date).format('YYYY-MM-DD');
        },
        checkStatus() {
            this.$get('forms/settings/check-status', {})
                .then(response => {
                    this.displayNotice = response.displayNotice;
                })
                .fail(() => {
                    // Status check failed — continue silently
                })
        },
    },
    mounted() {
        // if (this.has_pro) {
            this.dateFilterLabel = dateFilterLabels;
            let last30Days = LastThirtyDays();
            this.filterReports();
            this.checkStatus();
            this.getPaymentReports();
            this.getCustomerAndSubmissionReports();
            this.getPaymentStatistics();
            this.getForms();
            this.recentRevenues({
                startDate: last30Days[0],
                endDate: last30Days[1]
            });
            window.WPPayFormsBus.$emit('site_title', 'Reports');
        // }
    }
})
</script>
<style lang="scss" scoped>
.mg-btm-12 {
    margin-bottom: 12px;
}
// .wpf_chart_shadow {
//     background-color: #fff;
//     box-shadow: 0px 3px 15px 1px #e2e2e2 !important;
// }
.wpf_revenue_chart_container {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-bottom: 30px;
    .wpf_line_chart {
        width: calc(70% - 30px);
        @media screen and (max-width: 1300px) {
            width: calc(60% - 30px);
        }
    }
    .revenue_for_period_card{
        margin-bottom: 0px;
        width: calc(70% - 32px);
        @media screen and (max-width: 1300px) {
            width: calc(60% - 32px);
        }
    }
    .wpf_pie_chart {
        width: 30%;
        @media screen and (max-width: 1300px) {
            width: 40%;
        }
        min-width: 300px;
        background: #fff;
        border-radius: 8px;
        .performance_description {
            ul {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                padding: 20px;
                padding-bottom: 0px;
                justify-content: center;
                li {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    .color {
                        width: 30px;
                        height: 10px;
                        border-radius: 2px;
                    }
                }
            }
        }
        .chart_title {
            // @include text( );
            border-bottom: 1px solid #f1f1f1;
            padding: 20px;
            margin: 0;
            margin-bottom: 20px;
        }
       .chart {
            max-width: 200px;
            width: 100%;
            margin: 0 auto;
        }
    }
    .wpf_revenue_item {
        border-radius: 8px;
        height: 100%;
        background: #fff;
        .app-card {
            margin-bottom: 0px !important;
        }
    }
}
.wpf_revenue_breakdown {
    padding: 15px;
    margin-bottom: 12px;
    border-radius: 5px;
}
.wpf_performance {
    border-radius: 10px;
    &_form_middle {
        p {
            margin: 0;
        }
        table {
            width: 100%;
        }
        td, tr {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
    }
    &_form_bottom {
        position: absolute;
        bottom: 3em;
    }
    .total_entry {
        font-size: 23px;
    }
    &_form_top {
        h4 {
            margin: 0;
            max-width: 60%;
            color: #4aa6d4;
            cursor: pointer;
            color: #4aa6d4;
            font-size: 1.2em;
        }
        display: flex;
        justify-content: space-between;
    }
    &_header {
        padding: 0.5em 1em;
    }
    .wpf_doughnut {
        max-width: 195px;
        margin: 0 auto;
    }
    .performance_description {
        padding-right: 10px;
        overflow: auto;
        max-height: 284px;
        ul li {
            display: flex;
            justify-content: space-between;
            margin: 0;
            color: #1e3a5f;
            padding: 7px;
            cursor: pointer;
            border-bottom: 1px solid #fff;
            background: #f8f8f8;
        }
    }
}

.overview_item {
    border: none;
    margin-bottom: 12px;
    border-radius: 10px;
    overflow: hidden;
    &_top {
        &::-webkit-scrollbar {
            display: none;
        }
        height: 90px;
        padding: 0 1rem;
        display: flex;
        &_right {
            width: 30%;
            text-align: right;
        }
        .overview_change {
            color: #4f9491;
        }
        h2.overview_amount {
            font-size: 28px;
        }
        p.overview_amount {
            margin: 0;
            font-family: Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;
            // font-size: 1.5rem;
            // font-weight: 500;
            color: #3d5170;
        }
    }
    &_bottom {
        min-height: 70px;
    }
    &_top_left {
        width: 70%;
        text-align: left;
    }

}
.overview_label {
    text-transform: uppercase;
    font-size: .625rem;
    letter-spacing: .0625rem;
    color: #818ea3;
}
</style>

