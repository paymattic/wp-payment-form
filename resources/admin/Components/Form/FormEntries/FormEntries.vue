<template>
    <div class="payform_section">
        <div v-if="is_payment_form" class="wpf_report_cards">
            <div class="wpf_report_title">
                <h4>Stats Overview</h4>
            </div>
            <div class="wpf_report_status">
                <div v-for="(report, report_name) in reports" :key="report_name"
                    @click="changePaymentStatus(report_name)"
                    v-if="['total', 'paid', 'pending', 'refunded'].includes(report_name)" class="wpf_report_card">
                    <div class="wpf_report_header">
                        <div class="wpf_report_icon">
                            <Icon v-if="report_name === 'total'" icon="wpf-total" class="report_name_total" />
                            <Icon v-if="report_name === 'paid'" icon="wpf-paid" class="report_name_paid" />
                            <Icon v-if="report_name === 'pending'" icon="wpf-pending" class="report_name_pending" />
                            <Icon v-if="report_name === 'refunded'" icon="wpf-refunded" class="report_name_refunded" />
                        </div>

                        <div class="wpf_report_line">
                            <span>{{ report.label }}</span>
                            <p>{{ report.submission_count }}</p>
                        </div>
                    </div>
                    <div class="wpf_report_body">
                        <div v-if="is_payment_form" class="wpf_report_line">
                            <span v-if="report_name === 'total'">Total Amounts: {{ formatMoney(report.payment_total)
                                }}</span>
                            <span v-if="report_name === 'paid'">Total Paid: {{ formatMoney(report.payment_total)
                                }}</span>
                            <span v-if="report_name === 'pending'">Total Pending: {{ formatMoney(report.payment_total)
                                }}</span>
                            <span v-if="report_name === 'refunded'">
                                Total Refunded: {{ formatMoney(report.payment_total) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="wpf_form_entries">
            <div :class="is_payment_form ? 'has_payments_table' : 'no_payments_table'">
                <form-entries-table
                    :form_id.sync="form_id"
                    :payment_status="selected_payment_status"
                    :show-gift-aid-export="has_gift_aid_declarations"
                    @open-gift-aid-modal="openGiftAidModal"
                    ref="entriesTable"
                />
            </div>

        </div>
        <el-dialog :visible.sync="show_pro" width="60%">
            <div class="payform_section_body payform_upgrade_wrapper">
                <div class="payform_upgrade_section">
                    <h1><i class="el-icon-lock"></i></h1>
                    <h3>Export data is a pro feature. Upgrade to pro to unlock this feature.</h3>
                    <a target="_blank" :href="pro_purchase_url" class="el-button el-button--primary">Upgrade To Pro
                        version</a>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            title="Export Gift Aid Declarations"
            :visible.sync="giftAidExportModal.visible"
            width="480px">
            <el-form label-position="top">
                <el-form-item label="Charity name" required>
                    <el-input v-model="giftAidExportModal.charityName" placeholder="e.g. Helping Hands UK" />
                </el-form-item>
                <el-form-item label="HMRC reference" required>
                    <el-input v-model="giftAidExportModal.hmrcRef" placeholder="e.g. AB12345" />
                </el-form-item>
                <el-form-item label="Date range (optional)">
                    <div style="display:flex; gap:8px;">
                        <el-date-picker
                            v-model="giftAidExportModal.dateFrom"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="From"
                            style="flex:1;" />
                        <el-date-picker
                            v-model="giftAidExportModal.dateTo"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="To"
                            style="flex:1;" />
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="closeGiftAidModal">Cancel</el-button>
                <el-button type="primary" @click="exportGiftAid">Download CSV</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import formEntriesTable from '../../Common/EntriesTable.vue';
import fromatPrice from '../../../../common/formatPrice';
import moment from 'moment';
import Icon from '../../Icons/Index.vue';

export default {
    name: "Entries",
    components: {
        formEntriesTable,
        Icon
    },
    data() {
        return {
            form_id: this.$route.params.form_id,
            available_forms: [],
            selected_payment_status: 'total',
            available_statuses: window.wpPayFormsAdmin.paymentStatuses,
            show_pro: false,
            has_gift_aid_declarations: false,
            giftAidExportModal: {
                visible: false,
                charityName: '',
                hmrcRef: '',
                dateFrom: '',
                dateTo: '',
            },
            search_string: '',
            entry_ticker: 1,
            reports: {},
            currencySettings: {},
            is_payment_form: false,
            dateRange: null,
            start_date: null,
            end_date: null,
            isSearching: false,
            timeout: null,
            currentOption: 'total',
            viewOptions: {
                total: {
                    label: this.$t('All'),
                },
                paid: {
                    label: this.$t('Paid'),
                },
                processing: {
                    label: this.$t('Processing'),
                },
                pending: {
                    label: this.$t('Pending'),
                },
                failed: {
                    label: this.$t('Failed'),
                },
                refunded: {
                    label: this.$t('Refunded'),
                },
                abandoned: {
                    label: this.$t('Abandoned'),
                },
            },

        }
    },
    watch: {
        start_date() {
            this.getFormReport();
        }
    },
    methods: {

        // filterEntries(optionKey) {
        //     this.currentOption = optionKey;
        //     console.log('optionKey = ', optionKey);
        //     if (optionKey) {
        //         this.$refs.entriesTable.getEntries(optionKey);
        //     }
        // },
        // performSearch() {
        //     // this.entry_ticker = this.entry_ticker + 1;
        //     this.isSearching = true,
        //         clearTimeout(this.timeout);
        //     const self = this;
        //     this.timeout = setTimeout(function () {
        //         self.getFormReport();
        //         self.isSearching = false;
        //     }, 1000);
        // },
        changePaymentStatus(reportName) {
            this.selected_payment_status = reportName;
            this.$router.push({ query: { payment_status: this.selected_payment_status } });
        },

        // filterByDate() {
        //     this.start_date = this.dateRange == null ? null : moment(this.dateRange[0]).startOf('day').format('YYYY/MM/DD');
        //     this.end_date = this.dateRange == null ? null : moment(this.dateRange[1]).endOf('day').format('YYYY/MM/DD');
        // },
        // exportCSV(doc_type) {
        //     if (!this.has_pro) {
        //         this.show_pro = true;
        //         return;
        //     }
        //     let query = {
        //         doc_type: doc_type,
        //         search_string: this.search_string,
        //         payment_status: this.selected_payment_status,
        //         start_date: this.start_date,
        //         end_date: this.end_date,
        //         _wpnonce: window.wpPayFormsAdmin.rest.nonce
        //     };
        //     var data = new URLSearchParams(query)
        //     window.location.href = window.wpPayFormsAdmin.rest.url + `/form/${this.form_id}/export/?` + data;
        // },
        getFormReport() {
            let query = {
                search_string: this.search_string,
                payment_status: this.selected_payment_status,
                start_date: this.start_date,
                end_date: this.end_date,
            };
            // SubmissionController@reports
            this.$get(`form/${this.form_id}/entries/reports`, query)
                .then(response => {
                    this.reports = response.data.reports;
                    this.currencySettings = response.data.currencySettings;
                    this.is_payment_form = response.data.is_payment_form;
                    this.has_gift_aid_declarations = !!response.data.has_gift_aid_declarations;
                })
                .fail(error => {
                    console.log(error);
                })
                .always(() => {

                });
        },
        formatMoney(price) {
            return fromatPrice(price, this.currencySettings);
        },
        openGiftAidModal() {
            this.giftAidExportModal.visible = true;
        },
        closeGiftAidModal() {
            this.giftAidExportModal.visible = false;
        },
        exportGiftAid() {
            const modal = this.giftAidExportModal;
            if (!modal.charityName.trim() || !modal.hmrcRef.trim()) {
                this.$message.error('Charity name and HMRC reference are required.');
                return;
            }
            const params = new URLSearchParams({
                charity_name: modal.charityName.trim(),
                hmrc_ref:     modal.hmrcRef.trim(),
                date_from:    modal.dateFrom || '',
                date_to:      modal.dateTo   || '',
                _wpnonce:     window.wpPayFormsAdmin.rest.nonce,
            });
            window.location.href =
                window.wpPayFormsAdmin.rest.url +
                '/form/' + this.form_id + '/gift-aid/export?' +
                params.toString();
            this.closeGiftAidModal();
        },
    },
    mounted() {
        if (this.$route.query.payment_status) {
            this.selected_payment_status = this.$route.query.payment_status;
        }
        this.getFormReport();
        window.WPPayFormsBus.$emit('site_title', 'Form Entries');
    },
}
</script>

<style></style>
