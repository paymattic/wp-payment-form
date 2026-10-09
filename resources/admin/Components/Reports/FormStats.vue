<template>
    <div class="form_stats_body">
        <div class="wpf_performance_item">
            <div class="wpf_performance_form_top">
                <div class="card-item">
                    <Icon icon="wpf-form" />
                    <div class="info">
                        <span class="overview_label">Form ID</span>
                        <p class="total_entry">{{form_id}}</p>
                    </div>
                </div>
                <div class="card-item">
                    <Icon icon="wpf-entries" />
                    <div class="info">
                        <span class="overview_label">Total Entry</span>
                        <p class="total_entry">{{formReportsTotal.submission_count}}</p>
                    </div>
                </div>
                <!-- <div v-if="isPaymentForm">
                    <p class="overview_label">Payment Received</p>
                    <p class="total_entry" style="margin: 0;" v-html="currencySettings.currency_sign + parseFloat(formReportsTotal.payment_total / 100)"></p>
                </div> -->
            </div>
            <div class="wpf_performance_form_middle">
                <div>
                    <ul>
                        <li v-for="(report, key) in reports" :key="key">
                            <div class="left">
                                <p class="label">{{report.label}}</p>
                                <p class="entry">{{report.submission_count}} {{ $t('Entries') }}</p>
                            </div>
                            <td>
                                <p v-html="currencySettings.currency_sign + parseFloat(report.payment_total / 100)"  style="font-size: 14px;"></p>
                            </td>
                        </li>
                    </ul>
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
    props: ['formReportsTotal', 'reports', 'form_id', 'currencySettings', 'isPaymentForm'],
    data() {
        return {}
    }
}
</script>