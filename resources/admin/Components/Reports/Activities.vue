<template>
    <div>
        <div class="wpf_activities wpf_chart_shadow top_payer">
            <div class="header-section"  style="display:flex; justify-content: space-between;">
                <h3 class="">{{ $t('Top Customers')}}</h3>
                <div>
                    <el-select @change="changeCurrency()" filterable size="mini" v-model="selectedCurrency" label="currency">
                        <el-option value="transactions">Transactions</el-option>
                        <el-option
                            v-for="currencies in currencies"
                            :key="currencies.value"
                            :label="currencies.label"
                            :value="currencies.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <br/>
            <div v-if="hasPaymentActivity()" class="payer_container content-section">
                <div class="payer" v-for="(customer, email) in customers" :key="email">
                    <div class="payer_item">
                        <div class="">
                            <img :src="customer.avatar" alt="avatar" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                        </div>
                        <div class="payer_info">
                            <strong><p class="name">{{customer.name}}</p></strong>

                            <router-link
                                :to="{ name: 'customer', params: { email_id: email }}">
                                {{email}}
                            </router-link>
                        </div>
                        <div class="payment_info">
                            <ul>
                                <li v-for="(item, i) in customer.items" :key="i">
                                    {{item.total_paid}} {{item.currency}}
                                </li>
                            </ul>
                            <p class="amount">{{customer.amount}}</p>
                            <p class="payments_count">{{customer.count}} Payments</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="wpf_empty_graph">
                <div style="text-align: center;">
                    <Icon icon="wpf-empty-graph" />
                    <p>No data available</p>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import Icon from '@admin/Components/Icons/Index.vue';
export default {
    components: {
        Icon
    },
    props: ['payments_activity', 'customers', 'currencies', 'filter'],
    data() {
        return {
            payers: [],
            selectedCurrency: 'transactions',
            statuses: ['paid', 'pending', 'processing', 'failed', 'refunded'],
        }
    },
    watch: {
        filter: {
            handler: function (val) {
                this.selectedCurrency = val;
            },
            immediate: true
        }
    },
    methods: {
        getActivityTitle(payment) {
            if (payment.payment_method) {
               return payment.recurring_amount !== null ? 'Recurring' : 'One Time';
            } else {
                return payment.post_title;
            }
        },
        hasPaymentActivity() {
            return this.payments_activity.length > 0;
        },
        changeCurrency() {
            this.$post(`reports/top-customers`, {
                currency: this.selectedCurrency,
                filter: this.filter
            })
            .then(response => {
                this.$emit('change-customers', response.customers);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.flex-between {
    ul li{
        padding: 0 5px;
    }
    margin: 0;
    display: flex;
    justify-content: space-between;
}
.paid {
    color: green;
}
.failed {
    color: #ed1e1e;
}
.pending {
    color: #eda21e;
}
.processing {
    color: #4f94d4;
}
.refunded {
    color: #7f807f;
}
.overview_label {
    text-transform: uppercase;
    font-size: 0.625rem;
    color: #818ea3;
}
.mg-btm-12 {
    margin-bottom: 12px;
}
.top_payer {
    a .payer_item .name:hover {
        color: #0797c4;
    }
}
.wpf_activities {
    width: 100%;
    &::-webkit-scrollbar {
        display: none;
    }
    height: 100%;
    overflow: auto;
    background: white;
    .header-section {
        position: sticky;
        background: white;
        padding: 14px 18px;
        top: 0;
        border-bottom: 1px solid #e2e2e2;
        align-items: center;
        .title {
            font-family: Inter;
            font-size: 20px;
            font-style: normal;
            font-weight: 600;
            line-height: 28px;
        }
    }
    .content-section {
        padding: 0px 20px;
    }
    p, h3 {
        margin: 0 !important;
    }
    &.wpf_chart_shadow {
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 3px 15px 1px #e2e2e2;
    }
    .payer_container {
        .payer_item {
            align-items: center;
            display: flex;
            height: 68px;
        }
        .payer_info {
            a {
                text-decoration: none;
                color: #323DA5;
                font-family: Inter;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 16px;
            }
            display: flex;
            flex-direction: column;
            gap: 3px;
            flex: 1;
            margin-left: 12px;
        }
            .payer {
            color: inherit;
            display: contents;
            text-decoration: inherit;
        }
    }
    .payment_info {
        ul {
            margin: 0;
            li {
                display: inline;
                color: #2F3448;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
                padding: 0 5px;
                &:not(:last-child) {
                    border-right: 2px solid #2F3448;
                }
            }
        }
        .payments_count {
            color: #2F3448;
            font-size: 12px;
        }

        text-align: right;
        a {
            text-decoration: none;
        }
    }
}
</style>