<template>
    <div>
        <!-- Filter section start -->
        <div class="wpf_entry_actions wpf_inputs_new_ui payform_section_header"
            style="padding: 8px 10px; background: inherit; justify-content: flex-start;">
            <div class="wpf_entry_action">
                <label>
                    <span class="item_title">{{ $t('Filter By Form')}}</span>
                </label>
                <el-select @change="changeForm()" filterable size="mini" v-model="form_id" placeholder="Forms">
                    <el-option label="All Forms" value="0"></el-option>
                    <el-option v-for="form in available_forms" :key="form.ID"
                        :label="form.post_title + ' (ID: ' + form.ID + ')'" :value="form.ID">
                    </el-option>
                </el-select>
            </div>
            <div class="wpf_entry_action">
                <label>
                    <span class="item_title">{{ $t('Filter By Payment Status')}}</span>
                </label>
                <el-select @change="changeForm()" size="mini" v-model="selected_payment_status" placeholder="Forms"
                    tabindex="0">
                    <el-option label="All" value="all"></el-option>
                    <el-option v-for="(status, status_key) in paymentStatusData" :key="status_key" :label="status.text"
                        :value="status.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <!-- Filter section end -->
        <el-table ref="filterTable" :data="entries" style="width: 100%">
            <el-table-column prop="customer_name" label="Customer Name" sortable width="180" column-key="date">
                <template slot-scope="scope">
                    <span type="primary"><i class="el-icon-user" style="padding-right;: 5px"> </i>{{ scope.row.customer_name
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="customer_email" label="Customer Email" width="250">
                <template slot-scope="scope">
                    <span type="primary"><i class="el-icon-message" style="padding-right;: 5px"> </i>{{
                        scope.row.customer_email }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="payment_method" label="Payment Method" width="180">
            </el-table-column>
            <el-table-column prop="payment_total" label="Payment Total" sortable width="180">
                <template slot-scope="scope">
                    <span type="primary">{{ scope.row.payment_total / 100 }} {{ scope.row.currency }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="Created At" sortable width="180">
            </el-table-column>
            <el-table-column prop="payment_status" label="Payment Status" width="180">
                <template slot-scope="scope">
                    <el-tag :type="getPaymentStatusBaseColor(scope.row.payment_status)" disable-transitions>{{
                        scope.row.payment_status }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column  v-if="view_entry_details" prop="" label="Order Details" width="180">
                <template slot-scope="scope">
                    <EntryModal :form_id="scope.row.form_id" :entry_id="scope.row.id" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
import EntryModal from './EntryModal.vue';

export default {
    name: 'Entry',
    components: {
        EntryModal
    },
    data() {
        return {
            available_forms: [],
            form_id: '0',
            paymentStatusData: [
                {
                    text: 'Paid',
                    value: 'paid'
                },
                {
                    text: 'Pending',
                    value: 'pending'
                },
                {
                    text: 'Failed',
                    value: 'failed'
                },
                {
                    text: 'Refunded',
                    value: 'refunded'
                },
                {
                    text: 'Cancelled',
                    value: 'cancelled'
                },
                {
                    text: 'Processing',
                    value: 'processing'
                }
            ],
            entries: [],
            selected_payment_status: 'all'
        }
    },
    props: {
        filtered_entries: {
            type: Array,
            default: () => []
        },
        view_entry_details: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        resetDateFilter() {
            this.$refs.filterTable.clearFilter('date');
        },
        clearFilter() {
            this.$refs.filterTable.clearFilter();
        },
        formatter(row, column) {
            return row.address;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        getPaymentStatusBaseColor(status) {
            switch (status) {
                case 'paid':
                    return 'success';
                case 'pending':
                    return 'warning';
                case 'failed':
                    return 'danger';
                case 'refunded':
                    return 'info';
                case 'cancelled':
                    return 'info';
                case 'processing':
                    return 'info';
                default:
                    return 'info';
            }
        },
        
        changeForm() {
            console.log(this.form_id, this.selected_payment_status);
            if (this.form_id == '0' && this.selected_payment_status == 'all') {
                this.entries = this.filtered_entries;
                return;
            }
            if (this.form_id == '0') {
                this.entries = this.filtered_entries.filter(entry => entry.payment_status == this.selected_payment_status);
                return;
            } else if (this.selected_payment_status == 'all') {
                this.entries = this.filtered_entries.filter(entry => entry.form_id == this.form_id);
                return;
            } else {
                this.entries = this.filtered_entries.filter(entry => entry.form_id == this.form_id && entry.payment_status == this.selected_payment_status);
                return;
            }
        },
        // changePaymentStatus() {
        //     console.log(this.selected_payment_status, this.filtered_entries);
        //     this.entries = this.filtered_entries.filter(entry => entry.payment_status == this.selected_payment_status);
        // },
        getOnlyThisUserEntryFormTitles(forms) {
            const uniqueEntryForms = Array.from(new Set(this.filtered_entries.map(entry => entry.form_id)));
            let user_forms = forms.filter(form => uniqueEntryForms.includes(form.ID));
            return user_forms;
        },
        getFormTitles() {
            this.$get('dashboard/forms/formatted', {
            })
            .then(response => {
                console.log(response);
                this.available_forms = this.getOnlyThisUserEntryFormTitles(response.available_forms);
            });
        }
    },
    mounted() { 
        this.getFormTitles();
        this.entries = this.filtered_entries;
    },
}
</script>