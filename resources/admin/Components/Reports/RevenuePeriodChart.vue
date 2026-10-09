<template>
    <div class="wpf_revenue_item wpf_chart_shadow">
        <app-card>
            <template slot="header">
                <div class="wpf_rev_currency_toggler">
                    <h3 style="padding: 10px 0px; display: flex; gap: 10px;">{{ chartTitle }} <Icon icon="wpf-upgrade" /></h3>
                    <div class="wpf_modules_forms_select" :class="{'disabled_content': !has_pro}">
                        <el-date-picker
                            v-if="!specificCustomer"
                            v-model="filter_date"
                            type="daterange"
                            range-separator="To"
                            start-placeholder="Start date"
                            style="width: 300px;"
                            @change="filterReports(filter_date)"
                            end-placeholder="End date">
                        </el-date-picker>
                        <el-select @change="changeCurrencyGraph()" filterable size="mini" v-model="activeCurrency"
                            label="currency">
                            <el-option v-for="currencies in toggleOptions" :key="currencies.value" :label="currencies.label"
                                :value="currencies.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </template>
            <div slot="body" style="width: 100%; position: relative;" class="wpf_report_revenue_period_chart">
                <UpgradeNotice v-if="!has_pro"  title="This is a pro version feature." :type="('cart')" />
                <CardChart :class="{'disabled_content': !has_pro}" v-if="hasRevenueChartData" :chartProps="revenueFiltered" :chartOptions="revenueChartOptions"></CardChart>
                <div v-else class="wpf_empty_graph">
                    <div style="text-align: center;">
                        <Icon icon="wpf-empty-graph" />
                        <p>No data available</p>
                    </div>
                </div>
                <slot name="footer"></slot>
            </div>
        </app-card>
    </div>
</template>

<script>
import moment from 'moment';
import Chart from 'chart.js/auto';
import CardChart from './CardChart.vue';
import Icon from '@admin/Components/Icons/Index.vue';
import AppCard from '@admin/Components/Common/AppCard.vue';
import { LastThirtyDays } from './reports_helper.js';
import UpgradeNotice from '../Common/UpgradeNotice.vue';


export default {
    props: [
        'chartData',
        'toggleOptions',
        'allChartData',
        'chartTitle',
        'specificCustomer',
        'selectedCurrency',
    ],
    components: {
        CardChart,
        AppCard,
        UpgradeNotice,
        Icon
    },
    
    watch: {
        selectedCurrency(val) {
            if (val) {
                this.activeCurrency = val;
            }
        },
        allChartData: {
            handler: function (val) {
                this.hasRevenueChartData = Object.keys(this.allChartData).length > 0;
                if(this.hasRevenueChartData) {
                    // Fall back to first available currency if activeCurrency isn't in the data
                    if (!val[this.activeCurrency]) {
                        this.activeCurrency = Object.keys(val)[0];
                    }
                    this.changeCurrencyGraph();
                }
            },
            deep: true
        },
        filter_data: {
            handler: function (val) {
                this.$emit('recentRevenues', this.filter_data);
            },
            deep: true
        }
    },
    data() {
        return {
            filter_date: '',
            filter_data: {},
            hasRevenueChartData: true,
            activeCurrency: this.activeCurrency || window.wpPayFormsAdmin.default_currency || 'USD',
            revenueFiltered: this.chartData,
            revenueChartOptions: {
                elements: {
                    line: {
                        tension: 0.3
                    },
                    point: {
                        radius: 2
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.formattedValue + ' ' + this.activeCurrency;
                            }
                        }
                    }
                }
            },
            has_pro: window.wpPayFormsAdmin.has_pro,
        }
    },
    methods: {
        changeCurrencyGraph() {
            if(!this.has_pro){
                return;
            }
            this.updateScales(window[this.revenueFiltered.id]);
        },
        filterReports(date) {
            if(!this.has_pro){
                return;
            }
            if(date) {
                let start_date = moment(date[0]).format('YYYY-MM-DD');
                let end_date = moment(date[1]).format('YYYY-MM-DD');
                this.filter_data = {
                    startDate: start_date,
                    endDate: end_date
                };
            } else {
                this.filter_data = {};
            }
        },
        updateScales(chart) {
            console.log({chart});
            chart.destroy();
            this.revenueFiltered.data = this.allChartData[this.activeCurrency].data;
            this.revenueFiltered.label = this.allChartData[this.activeCurrency].label;
            var options = {
                type: 'line',
                data: {
                    labels: this.revenueFiltered.label,
                    datasets: [
                        {
                            bezierCurve: false,
                            label: '',
                            data: this.revenueFiltered.data,
                            borderWidth: 1,
                            borderColor: this.revenueFiltered.color,
                            backgroundColor: this.revenueFiltered.backgroundColor,
                            fill: true,
                        }
                    ]
                },
                options: this.revenueChartOptions
            }
            const id = 'wpf_overview_chart_' + this.revenueFiltered.id;
            var ctx = document.getElementById(id).getContext('2d');
            document.getElementById(id).height = '120';
            window[this.revenueFiltered.id] = new Chart(ctx, options);
        }
    },
    mounted() {
        this.filter_date = LastThirtyDays();
    }
}
</script>

<style scoped>
.wpf_modules_forms_select {
    display: flex;
    gap: 10px;
}
</style>

