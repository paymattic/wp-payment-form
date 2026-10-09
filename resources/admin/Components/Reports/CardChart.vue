<template>
    <canvas :id="chartId" :width="chartWidth" :height="'auto'"></canvas>
</template>
<script>

import Chart from 'chart.js/auto';
Chart.defaults.datasets.bar.barPercentage = 0.2;

export default({
    name: 'CardChart',
    props: ['chartProps', 'chartOptions'],
    data() {
        return {
            loading: false,
            chartId: 'wpf_overview_chart_' + this.chartProps.id,
            chartHeight: this.chartProps.height ? this.chartProps.height : 'auto',
            chartWidth: this.chartProps.width ? this.chartProps.width : 'auto',
        }
    },
    methods: {
        generateChart() {
            var options = {
                type: this.chartProps.type ? this.chartProps.type : 'line',
                data: {
                    labels: this.chartProps.label,
                    datasets: [
                        {
                            bezierCurve: false,
                            label: '',
                            data: this.chartProps.data,
                            borderWidth: 1,
                            borderColor: this.chartProps.color,
                            backgroundColor:this.chartProps.backgroundColor,
                            fill: true,
                        }
                    ]
                },
                options: this.chartOptions
            }

            var ctx = document.getElementById(this.chartId).getContext('2d');
            window[this.chartProps.id] = new Chart(ctx, options);
        }
    },
    mounted() {
        this.generateChart();
    }
})
</script>
