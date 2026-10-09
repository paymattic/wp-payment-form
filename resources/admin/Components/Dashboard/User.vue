<template>
    <div style="padding: 20px; background: #fff;">
        <el-row :gutter="20">
            <el-col :lg="6" :md="24" class="wpf_customer_profile_wrapper">
                <div v-if="info.fluent_crm" v-html="info.fluent_crm"></div>
                <div v-else class="wpf_customer_profile_avatar"  v-html="info.avatar"></div>
                <div class="wpf_customer_profile_info"
                    element-loading-text="Loading..."
                    element-loading-spinner="el-icon-loading"
                    v-loading="false">
                    <div class="wpf_customer_profile_name">
                        <h3 class="customer_name" v-if="!info.fluent_crm" style="text-transform: capitalize;">{{info.customer_name}}</h3>
                        <p class="customer_email">
                            <i class="el-icon-message"></i>
                            <a :href="'mailto:' + customer_email">{{customer_email}}</a>
                        </p>
                        <p>Since: {{info.created_at | dateFormat('MMM DD, YYYY h:mm a')}}</p>
                    </div>

                    <div class="wpf_customer_profile_activity">
                        <p class="wpf_customer_title">Customer Spent</p>
                        <hr>
                        <div class="summary_item" v-for="(item, i) in spends" :key="i">
                            <p class="summary_label">{{item.currency}}</p>
                            <p class="summary_val"><span v-html="item.sign"></span>  {{item.formatted_price}}</p>
                        </div>
                        <div v-if="!spends.length">
                            No payment received!
                        </div>
                    </div>

                    <div class="wpf_customer_profile_activity">
                        <p class="wpf_customer_title">Permissions</p>
                        <hr>
                        <div>
                            <div class="has_site_access" v-if="user_id">
                                <p><i class="el-icon-check" ></i><b>{{permissions.display_name}}</b> has site access!</p>
                                <p>
                                    <i class="el-icon-user"></i>
                                    <a v-if="permissions.manage_user"
                                        :href="permissions.manage_user">
                                        Manage site user
                                    </a>
                                </p>
                                <p>User has following roles: </p>
                                <span class="user_roles" v-for="role in permissions.roles" :key="role">
                                    {{role}}
                                </span>
                            </div>
                            <p v-else>No site access!</p>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :lg="18" :md="24" class="wpf_customer_content_wrapper" v-if="hasRevenueChartData">
                <p class="wpf_customer_title">Customer Spent vs date Graph</p>
                <hr>
                <RevenuePeriodChartVue
                    :selectedCurrency="selectedCurrencyGraph"
                    :chartData="revenueChartFiltered"
                    :toggleOptions="revenueOptions"
                    :allChartData="revenueChartDataAll"
                ></RevenuePeriodChartVue>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import RevenuePeriodChartVue from '../Reports/RevenuePeriodChart.vue';
export default {
    name: 'UserProfile',
    props: ['info', 'customer_email', 'user_id', 'permissions', 'spends'],
    components: {
        RevenuePeriodChartVue
    },
    data() {
        return {
            selectedCurrencyGraph: 'USD',
            revenueChartFiltered: {
                id: 'revenue_chart',
                type: 'line',
                height: '80',
                title: 'Total Revenue',
                color: '#7be873',
                backgroundColor: 'rgb(186 255 181 / 31%)'
            },
            revenueOptions: [],
            revenueChartDataAll: [],
            hasRevenueChartData: false,
            fetchingCustomer: false,
        }
    },
    methods: {
        getCustomerEngagements () {
            this.fetchingCustomer = true;
            this.$get(`dashboard/customers/${this.customer_email}/engagements`, {
            }).then(response => {
                this.fetchingCustomer = false;
                // this.engagements = response.customers;
                // chart data formation
                this.revenueOptions = response.graphicalData.options
                this.revenueChartDataAll = response.graphicalData.chartData;
                if (!this.revenueChartDataAll.USD) {
                    this.selectedCurrencyGraph = Object.keys(this.revenueChartDataAll)[0];
                }
                let graphData = this.revenueChartDataAll[this.selectedCurrencyGraph];
                this.revenueChartFiltered.data = graphData.data;
                this.revenueChartFiltered.label = graphData.label;
                this.hasRevenueChartData =  true;
            }) .always(() => {
                this.fetchingCustomer = false;
            });
        },
    },
    mounted() {
        this.getCustomerEngagements();
    },
}
</script>

<style scoped>
.wpf_customer_profile_name .customer_name {
    text-align: start;
}
</style>