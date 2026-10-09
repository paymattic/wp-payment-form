<template>
    <div class="wpf_content_wrapper_parent_v2">
        <div class="wpf_content_wrapper_parent_v2">
            <div class="payform_section_header">
                <h2 class="payform_gateway_title">
                    {{ $t('User Dashboard') }}
                </h2>
            </div>
            <div class="wpf_content_wrapper_v2">
                <div class="wppayform_sidebar_v2">
                    <ul style="align-items: flex-start;" class="wppayform_sidebar_list_v2 wpf_gateway_lists">
                        <li v-for="(settings_menu, settings_index) in userMenuArray" :key="settings_index"
                            @click="activeProfileMenu = settings_menu.key"
                            :class="activeProfileMenu === settings_menu.key ? 'user_dashboard_menu active' : 'user_dashboard_menu'"
                            v-if="$data[settings_menu.key]">
                            <i :class="settings_menu.icon"></i>
                            <span>{{ settings_menu.title }}</span>
                        </li>
                    </ul>
                </div>
                <div v-loading="!hasInfo(info)" class="all_payforms_wrapper payform_section">
                    <div class="payform_section_header">
                        <h3 class="payform_section_title">
                            {{ toFirstLetterUperCase(activeProfileMenu) }}
                        </h3>
                    </div>
                    <div class="payform_section_body">
                        <UserProfile v-if="activeProfileMenu === 'profile' && hasInfo(info)" :info="info"
                            :customer_email="customer_email" :spends="spends" :user_id="user_id"
                            :permissions="permissions" />
                        <Subscriptions v-if="activeProfileMenu === 'read_subscription_entry' && !fetchingProfile"
                            :subscriptions="subscriptions" :getFormattedMoney="getFormattedMoney"
                            :getPaymentStatusIcon="getPaymentStatusIcon" :subscriptionHumanText="subscriptionHumanText"
                            :getSubscriptionUrl="getSubscriptionUrl" @getCustomer="getCustomer"
                            :view_subscription_entry_details="view_subscription_entry_details" />
                        <Entry v-if="activeProfileMenu === 'read_entry' && !fetchingProfile && read_entry"
                            :filtered_entries="filtered_entries" :view_entry_details="view_entry_details" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import priceFormat from '../../../common/formatPrice.js';
import UserProfile from './User.vue';
import Subscriptions from './Subscriptions.vue';
import Entry from './Entry.vue';

export default {
    name: 'DashboardIndex',
    components: {
        UserProfile,
        Subscriptions,
        Entry
    },
    data() {
        return {
            info: {},
            spends: [],
            user_id: 0,
            permissions: {},
            customer_email: '',
            fetchingProfile: false,
            subscriptions: [],
            activeProfileMenu: 'profile',
            filtered_entries: [],
            userMenuArray: [
                {
                    title: 'Profile',
                    key: 'profile',
                    svg: 'profile',
                    icon: 'el-icon-user',
                },
                {
                    title: 'Subscriptions',
                    key: 'read_subscription_entry',
                    svg: 'subscription',
                    icon: 'el-icon-s-promotion',
                },
                {
                    title: 'Entries',
                    key: 'read_entry',
                    svg: 'entries',
                    icon: 'el-icon-document',
                }
            ],
            profile: true,
            read_entry: window.wpPayFormsAdmin?.user_capabilities?.read_entry || false,
            read_subscription_entry: window.wpPayFormsAdmin?.user_capabilities?.read_subscription_entry || false,
            view_entry_details: window.wpPayFormsAdmin?.user_capabilities?.view_entry_details || false,
            view_subscription_entry_details: window.wpPayFormsAdmin?.user_capabilities?.view_subscription_entry_details || false,
        }
    },
    methods: {
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + 'images/gateways/' + path;
        },
        hasInfo(info) {
            return Object.keys(info)?.length > 0;
        },
        toFirstLetterUperCase(string) {
            this.userMenuArray.forEach((menu) => {
                if (menu.key === string) {
                    string = menu.title;
                    return;
                }
            });
            return string;
        },
        getCustomerEngagements() {
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
                this.hasRevenueChartData = true;
            }).always(() => {
                this.fetchingCustomer = false;
            });
        },
        getCustomer() {
            this.fetchingCustomer = true;
            this.$get(`dashboard/customers/${this.customer_email}`, {
            }).then(response => {
                this.entries = response.entries;
                this.filtered_entries = response.entries;
                this.info = response.info;
                this.subscriptions = response.subscriptions;
                this.payments = response.orders;
                this.fetchingCustomer = false;
            }).always(() => {
                this.fetchingCustomer = false;
            });
        },
        getCustomerProfile() {
            this.fetchingProfile = true;
            this.$get(`dashboard/customers/${this.customer_email}/profile`, {
            }).then(response => {
                this.spends = response.spends;
                this.user_id = response.permissions.user_id;
                this.permissions = response.permissions;

                this.fetchingProfile = false;
            }).always(() => {
                this.fetchingProfile = false;
            });
        },
        subscriptionHumanText(plan) {
            if (parseInt(plan.bill_times)) {
                return 'Customer will be billed ' + plan.bill_times + ' times in total';
            } else {
                return 'Customer will be billed until cancelled';
            }
        },
        getPaymentStatusIcon(status) {
            if (status == 'pending') {
                return 'el-icon-time';
            } else if (status == 'active') {
                return 'el-icon-check';
            } else if (status == 'failed') {
                return 'el-icon-error';
            } else if (status == 'refunded') {
                return 'el-icon-warning';
            }
            return '';
        },
        getFormattedMoney(amount, currency) {
            if (!amount) {
                return 'n/a';
            }
            return priceFormat(amount, currency);
        },
        getSubscriptionUrl(subscription) {
            const submission = subscription.submission;
            if (submission.payment_method == 'stripe') {
                if (submission.payment_mode == 'test') {
                    return 'https://dashboard.stripe.com/test/subscriptions/' + subscription.vendor_subscriptipn_id;
                }
                return 'https://dashboard.stripe.com/subscriptions/' + subscription.vendor_subscriptipn_id;
            }
        },
    },
    mounted() {
        this.customer_email = window.wpPayFormsAdmin.user_email;
        this.getCustomer();
        this.getCustomerProfile();
    }
}
</script>

<style scoped lang="scss">
.payform_section_body {
    padding: 60px;
    background: #fff;
}

// .wpf_content_wrapper_v2 .wppayform_sidebar_v2 {
//     min-width: 145px !important;
//     background-color: #fbf7ef;
// }

// .wpf_content_wrapper_v2 .wppayform_sidebar_v2 {
//     text-align: start;
// }

.user_dashboard_menu {
    cursor: pointer;
}

.active {
    background: #fff !important;
}

.wpf_content_wrapper_v2 ul li {
    width: 100%;
}

.wpf_gateway_lists {
    margin-top: 34px;
}

.wpf_content_wrapper_v2 {
    position: relative;

    .wppayform_sidebar_list_v2 {
        position: sticky;
        top: 100px;

        li,
        .wpf_content_wrapper_v2 ul li {
            margin-bottom: 0px !important;
        }
    }
}

.li {
    margin-bottom: 0px;
}

.payform_section_title {
    margin-left: 10px !important;
}
</style>