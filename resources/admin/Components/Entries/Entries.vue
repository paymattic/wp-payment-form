<template>
    <div class="payform_section">
        <!-- <div class="wpf_entry_actions"
            style="padding: 8px 10px; background: inherit; justify-content: flex-start;"> -->
        <!-- <div class="wpf_entry_action">
                <label>
                    <span class="item_title">{{ $t('Filter By Form') }}</span>
                </label>
                <el-select @change="changeForm()" filterable size="mini" v-model="form_id" placeholder="Forms">
                    <el-option label="Forms" value="0"></el-option>
                    <el-option v-for="form in available_forms" :key="form.ID"
                        :label="form.post_title + ' (ID: ' + form.ID + ')'" :value="form.ID">
                    </el-option>
                </el-select>
            </div>
            <div class="wpf_entry_action">
                <label>
                    <span class="item_title">{{ $t('Filter By Payment Status') }}</span>
                </label>
                <el-select @change="changePaymentStatus()" size="mini" v-model="selected_payment_status" placeholder="Forms"
                    tabindex="0">
                    <el-option label="All" value=""></el-option>
                    <el-option label="Payments only" value="all-payments"></el-option>
                    <el-option v-for="(status, status_key) in available_statuses" :key="status_key" :label="status"
                        :value="status_key">
                    </el-option>
                </el-select>
            </div>
            <div class="wpf_entry_action">
                <label>
                    <span class="item_title">{{ $t('Filter By Entry Status') }}</span>
                </label>
                <el-select @change="changeEntryStatus()" size="mini" v-model="selected_entry_status" placeholder="All">
                    <el-option label="All" value=""></el-option>
                    <el-option v-for="(status, status_key) in available_entry_statuses" :key="status_key" :label="status"
                        :value="status_key">
                    </el-option>
                </el-select>
            </div> -->
        <!-- <div class="wpf_entry_action"> -->
        <!-- <label> -->
        <!-- <span class="item_title">{{ $t('Search') }}</span>
                    <div class="wpf_modules_search">
                        <el-input size="mini" placeholder="Search" v-model="search_string" class="input-with-select"
                            @keyup.enter.native="performSearch">
                            <el-button slot="append" icon="el-icon-search" @click="performSearch"></el-button>
                        </el-input>
                    </div> -->
        <!--                    <el-input @keyup.enter.native="performSearch" size="mini" placeholder="Search" v-model="search_string" class="wpf_modules_search input_with_select">-->
        <!--                        <el-button @click="performSearch" size="mini" slot="append" icon="el-icon-search"></el-button>-->
        <!--                    </el-input>-->
        <!-- </label> -->
        <!-- </div> -->
        <!-- <div v-if="form_id && form_id != '0'" class="wpf_entry_action">
                <router-link :to="{ name: 'form_entries', params: { form_id: form_id } }" style="position: absolute;">View
                    Reports</router-link>
            </div> -->
        <!-- </div> -->
        <DashboardNotices v-if="displayNotice" :displayNotice="displayNotice"/>
        <div class="wpf_form_entries" :class="{ wpf_entries_top : getEntriesUrl }">
            <div class="has_payments_table">
                <form-entries-table :entry_ticker="entry_ticker" :form_id="form_id" :search_string="search_string"
                    :payment_status="selected_payment_status" :status="selected_entry_status" :filter_data="filter_data" />
            </div>
        </div>

    </div>
</template>

<script>
import formEntriesTable from '../Common/EntriesTable.vue';
import DashboardNotices from '../pieces/DashboardNotices.vue';

export default {
    name: "Entries",
    props: ['filter_data'],
    components: {
        formEntriesTable,
        DashboardNotices
    },
    data() {
        return {
            form_id2: '',
            form_id: '0',
            available_forms: [],
            selected_payment_status: '',
            available_statuses: window.wpPayFormsAdmin.paymentStatuses,
            search_string: '',
            entry_ticker: 1,
            selected_entry_status: '',
            available_entry_statuses: window.wpPayFormsAdmin.entryStatuses,
            displayNotice: false,
        }
    },
    computed: {
        getEntriesUrl() {
            return this.$route.path === '/entries';
            }
        },
    methods: {
        // performSearch() {
        //     this.entry_ticker = this.entry_ticker + 1;
        // },
        // changeForm() {
        //     this.$router.push({ query: { form_id: this.form_id } });
        // },
        // changePaymentStatus() {
        //     this.$router.push({ query: { payment_status: this.selected_payment_status } });
        // },
        // changeEntryStatus() {
        //     this.$router.push({ query: { status: this.selected_entry_status } });
        // },
        // getFormTitles() {
        //     console.log("Entries");
        //     this.$get('forms/formatted', {
        //     })
        //         .then(response => {
        //             this.available_forms = response.available_forms;
        //         });
        // }
        checkStatus() {
            this.$get('forms/settings/check-status', {})
                .then(response => {
                    this.displayNotice = response.displayNotice;
                    console.log(response);
                })
                .fail(() => {
                    // Status check failed — continue silently
                })
        },
    },
    mounted() {
        if (this.$route.query.form_id) {
            this.form_id = this.$route.query.form_id;
        }
        if (this.$route.query.payment_status) {
            this.selected_payment_status = this.$route.query.payment_status;
        }
        if (this.$route.query.status) {
            this.selected_entry_status = this.$route.query.status;
        }
        this.checkStatus();
        // this.getFormTitles();
        window.WPPayFormsBus.$emit('site_title', 'Form Entries');
    }
}
</script>

<style scoped>
.payform_section_header {
    display: flex;
}
.wpf_entries_top {
        margin-top: 20px;
    }
</style>