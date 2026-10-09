<template>
    <div class="form_entries_wrapper">
        <div v-loading="fetching" class="wpf_entries">
            <div class="wpf_entries_filter">
                <div class="wpf_entries_title">
                    <h3 class="payform_section_title">
                        {{ $t('Form Entries') }}
                    </h3>
                </div>
                <div class="wpf_entries_status">
                    <ul>
                        <li v-for="(option, key) in viewOptions" :key="key" @click="filterEntries(key)"
                            :class="{ active: currentOption === key }">
                            {{ option.label }}
                        </li>
                        <li v-if="has_pro && this.form_id === '0'" @click="filterEntries('subscription')" :class="{ active: currentOption === 'subscription' }">Subscription</li>
                        <li v-if="has_pro && this.form_id === '0'" @click="filterEntries('coupon')" :class="{ active: currentOption === 'coupon' }">Coupon</li>
                    </ul>
                </div>
            </div>

            <div class="wpf_entry_actions">
                <div class="wpf_bulk_action">
                    <template>
                        <el-select v-model="selectOption" placeholder="Select action" class="custom_select">
                            <el-option :disabled="true" value="Bulk Actions">{{ $t('Bulk Actions') }}</el-option>
                            <el-option value="delete">
                                {{ $t('Delete Entries') }}
                            </el-option>
                            <el-option v-if="this.form_id !== '0'" value="send-email">
                                {{ $t('Send Email') }}
                            </el-option>
                        </el-select>
                    </template>

                    <Remove v-show="showActionButton" @on-confirm="applyAction" class="button_action">
                        <p slot="info">
                            {{ $t('Selected entries will be deleted permanently?') }}
                        </p>
                        <template>
                            {{ $t('Apply') }}
                        </template>
                    </Remove>
                    <EmailResend v-if="this.selectedIds.length && this.form_id !== '0' && selectOption === 'send-email'"
                        :form_id="form_id" :entry_ids="this.selectedIds" class="button_action" />
                </div>
                <div class="payform_filter_actions">
                    <div class="wpf_modules_forms" v-if="showFormSelect">
                        <el-select @change="changeForm()" filterable v-model="selectedFormId" class="custom_select"
                            placeholder="Forms">
                            <el-option label="Forms" value="0"></el-option>
                            <el-option v-for="form in available_forms" :key="form.ID"
                                :label="form.post_title + ' (ID: ' + form.ID + ')'" :value="form.ID">
                            </el-option>
                        </el-select>

                        <div v-if="this.selectedFormId !== '0'" class="wpf_view_entries">
                        <router-link :to="{ name: 'form_entries', params: { form_id: this.selectedFormId } }">
                            View Reports
                        </router-link>
                    </div>
                    </div>
                    <!-- <div v-if="this.selectedFormId !== '0'" class="wpf_view_entries">
                        <router-link :to="{ name: 'form_entries', params: { form_id: this.selectedFormId } }">
                            View Entries
                        </router-link>
                    </div> -->

                    <div class="wpf_module_search">
                        <el-input size="medium" :placeholder="$t('Search')" v-model="search_string"
                            class="wpf_search_input" @keyup.native="performSearch()" prefix-icon="el-icon-search">
                        </el-input>
                    </div>

                    <div class="wpf_modules_date">
                        <el-date-picker @change="filterByDate" v-model="dateRange" type="daterange"
                            date-format="YYYY/MM/DD" size="mini" start-placeholder="Start Date"
                            end-placeholder="End Date">
                        </el-date-picker>
                    </div>
                     <!-- export entry option is available only in pro -->
                    <div class="wpf_entry_export" v-if="has_pro && this.form_id !== '0'">
                        <el-dropdown @command="exportCSV">
                            <el-button size="small">
                                {{ $t('Export') }} <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="csv">{{ $t('Export as CSV') }}</el-dropdown-item>
                                <el-dropdown-item command="xlsx">{{ $t('Export as Excel (xlsv)') }}</el-dropdown-item>
                                <el-dropdown-item command="ods">{{ $t('Export as ODS') }}</el-dropdown-item>
                                <el-dropdown-item command="json">{{ $t('Export as JSON Data') }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div v-if="showGiftAidExport" class="wpf_entry_export">
                        <el-button size="small" @click="openGiftAidExport">
                            <i class="el-icon-download" style="margin-right: 4px;"></i>{{ $t('Gift Aid') }}
                        </el-button>
                    </div>    
                    <!-- <div v-if="this.selectedFormId !== '0'" class="wpf_entry_action">
                        <router-link :to="{ name: 'form_entries', params: { form_id: this.selectedFormId } }"
                            style="position: absolute;">View
                            Reports</router-link>
                    </div> -->
                    <div class="wpf_entry_status" v-if="showFormSelect">
                        <el-dropdown>
                            <el-button class="el-dropdown-link">
                                <Icon icon="wpf-status" />
                            </el-button>
                            <el-dropdown-menu>
                                <el-dropdown-item>
                                    <el-radio v-model="selected_entry_status" @change="changeEntryStatus"
                                        label="">All</el-radio>
                                </el-dropdown-item>
                                <el-dropdown-item v-for="(status, status_key) in available_entry_statuses"
                                    :key="status_key">
                                    <el-radio v-model="selected_entry_status" @change="changeEntryStatus"
                                        :label="status_key">
                                        {{ status }}
                                    </el-radio>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>

            <el-table ref="multipleTable" :data="allEntry" style="width: 100%" class="wpf_entries_table"
                @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
                <el-table-column type="selection" width="40">
                </el-table-column>
                <el-table-column prop="id" :label="$t('ID')" width="80" :sort-by="['id']" sortable>
                    <template slot-scope="scope">
                        <div class="has_hover_item">
                            <router-link style="margin-right: 5px;"
                                :to="{ name: 'entry', params: { entry_id: scope.row.id, form_id: scope.row.form_id } }">
                                {{ scope.row.id }}
                            </router-link>
                            <div class="show_on_hover inline_actions">
                                <span @click="changeStatus(scope.row, scope.$index, 'new')" title="Mark as unread"
                                    v-if="scope.row.status !== 'new'" class="el-icon-circle-check action_button"></span>
                                <span @click="changeStatus(scope.row, scope.$index, 'read')" title="Mark as read" v-else
                                    class="el-icon-circle-check-outline action_button"></span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="!router_form_id" :label="$t('Form')" width="190">
                    <template slot-scope="scope">
                        {{ scope.row.post_title }} ({{ scope.row.form_id }})
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Name')" width="160" prop="customer_name" :sort-by="['customer_name']" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.customer_name }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Email')" prop="customer_email" min-width="210" :sort-by="['customer_email']" sortable>
                    <template slot-scope="scope">
                        {{ scope.row.customer_email }}
                    </template>
                </el-table-column>
                <el-table-column v-if="has_payment_items" :label="$t('Payment Status')" width="180">
                    <template slot-scope="scope">
                        <span
                            :class="scope.row.payment_method ? 'wpf_pay_status_' + scope.row.payment_status : 'wpf_pay_status_none'">
                            <Icon :icon="getPaymentStatusIcon(scope.row.payment_status, scope.row.payment_method)" />
                            {{ scope.row.payment_method ? scope.row.payment_status : 'None' }}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column prop="payment_total" v-if="has_payment_items" :label="$t('Payment Total')"
                    width="150" :sort-by="['payment_total']" sortable>
                    <template slot-scope="scope">
                        <span v-html="getFormattedMoney(scope.row)"></span>
                    </template>
                </el-table-column>
                <el-table-column v-if="has_payment_items" width="150" :label="$t('Payment Method')">
                    <template slot-scope="scope" v-if="entryLoaded">
                        <img v-if="scope.row.payment_method" :src="getSvg(scope.row.payment_method)"
                            :alt="scope.row.payment_method">
                    </template>
                </el-table-column>
                <el-table-column style="text-transform: capitalize;" :label="$t('Entry Status')" :min-width="120">
                    <template slot-scope="scope">
                        <span :class="'wpf_entry_status_' + scope.row.status">
                            {{ scope.row.status }}
                            <Icon v-show="scope.row.status === 'new'" icon="wpf-dot" />
                        </span>

                    </template>
                </el-table-column>

                <el-table-column prop="created_at" :label="$t('Submitted At')" width="145" :sort-by="['created_at']" sortable>
                    <template slot-scope="scope">
                        <!-- {{ formatCreatedAt(scope.row.created_at) }} -->
                        <div>
                            {{ formatCreatedAt(scope.row.created_at) }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('Actions')" width="140" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button-group>
                            <el-button @click="goToViewRoute(scope.row)" class="wpf-button" type="primary" icon="el-icon-view"
                                size="mini"></el-button>
                            <el-button @click="showDeleteConformation(scope.row)" type="danger" size="mini"
                                icon="el-icon-delete"></el-button>
                        </el-button-group> -->
                        <div class="wpf_action_button_group">
                            <el-tooltip class="item" effect="dark" content="View Entry" placement="top-start">
                                <!-- <a href="#" @click="goToViewRoute(scope.row)">
                                    <Icon icon="wpf-eye" />
                                </a> -->
                                <el-button @click="goToViewRoute(scope.row)" class="wpf-button" size="mini">
                                    {{ $t('View Details')}}
                                </el-button>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                                <a style="color:#565865" @click="showDeleteConformation(scope.row)" href="#">
                                    <Icon icon="wpf-delete" />
                                </a>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <!-- Display message when data is empty -->
                <template #empty>
                    <Empty v-if="allEntry.length === 0" src="images/empty-cart.svg"
                        :text="'There is no available data!!'" :image-size="120" />
                </template>
            </el-table>
        </div>

        <!-- <div class="tablenav bottom">
            <div class="alignleft actions bulkactions">
                <label for="bulk-action-selector-top" class="screen-reader-text">
                    {{ $t('Select bulk action') }}
                </label>
                <select name="action" v-model="selectOption">
                    <option value="-1">{{ $t('Bulk Actions') }}</option>
                    <option value="delete">{{ $t('Delete Entries') }}</option>
                    <option v-if="this.form_id !== '0'" value="send-email">{{ $t('Send Email') }}</option>
                </select>
                <remove v-show="(multipleSelection.length > 0 && selectOption == 'delete')" @on-confirm="applyAction()"
                    class="button action">
                    <p slot="info" style="font-size: 12px;">
                        {{ $t('Selected entries will be deleted permanently?') }}
                    </p>
                    <template>
                        {{ $t('Apply') }}
                    </template>
                </remove>
                <email-resend v-if="this.selectedIds.length && this.form_id !== '0' && selectOption === 'send-email'"
                    :form_id="form_id" :entry_ids="this.selectedIds" />
            </div>
            <div style="float: right">
                <el-pagination @size-change="pageSizeChange" @current-change="changePage"
                    :current-page.sync="pagination.current_page" :page-sizes="page_sizes"
                    :page-size="pagination.per_page" layout="total, sizes, prev, pager, next" :total="pagination.total">
                </el-pagination>
            </div>
        </div> -->

        <div class="wpf_pagination">
            <div class="pager-wrap">
                <span class="text">Page 1 to {{ pagination.per_page }} of {{ pagination.total }}</span>
                <el-select v-model="pagination.per_page" placeholder="Select">
                    <el-option v-for="item in page_sizes" :key="item" :label="item + ' Per page'" :value="item" />
                </el-select>
            </div>

            <div class="pagination_page_list">
                <el-pagination @size-change="pageSizeChange" @current-change="changePage"
                    :current-page.sync="pagination.current_page" :page-sizes="page_sizes"
                    :page-size="pagination.per_page" layout="prev, pager, next" :total="pagination.total">
                </el-pagination>
            </div>
        </div>

        <!--Delete Entry Confimation Modal-->
        <el-dialog title="Are You Sure, You want to delete this Entry?" :visible.sync="delete_pop_up"
            :before-close="handleDeleteClose">
            <div class="wpf_confirmation_modal">
                <div v-if="deleting_row" class="modal_body wpf_confirmation_modal_body">
                    <p class="warning_text">
                        {{ $t('All the data associate with this entry will be deleted, including payment information and otherassociate information')}}
                    </p>
                    <p class="form_info">{{ $t('You are deleting entry id')}}: <span>{{ deleting_row.id }}</span></p>
                    <p class="form_info">{{ $t('Form Title')}}: <span>{{ deleting_row.post_title }}</span></p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="delete_pop_up = false" size="medium">{{ $t('Cancel')}}</el-button>
                    <el-button type="primary" @click="deleteEntryNow()" class="new_button_delete" size="medium">
                        {{ $t('Confirm Delete')}}
                    </el-button>
                </span>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
import fromatPrice from '../../../common/formatPrice';
import Remove from '../pieces/confirmation';
import EmailResend from '../Form/FormEntries/_RecentEmailNotification.vue';
import Empty from './Empty.vue';
import moment from 'moment';
import Icon from '../Icons/Index.vue';

export default {
    name: 'entries_table',
    // props: ['form_id', 'payment_status', 'status', 'entry_ticker', 'search_string', 'start_date', 'end_date'],
    props: ['form_id', 'payment_status', 'status', 'filter_data', 'showGiftAidExport'],
    components: {
        Remove,
        Empty,
        EmailResend,
        Icon
    },
    watch: {
        form_id(newVal) {
            this.localFormId = newVal;
            this.pagination.current_page = 1;
            this.getEntries();
        },
        payment_status(newVal) {
            this.currentOption = newVal;
            this.pagination.current_page = 1;
            this.getEntries();
        },
        status(newVal) {
            this.entryStatus = newVal;
            this.pagination.current_page = 1;
            this.getEntries();
        },
        // entry_ticker() {
        //     this.pagination.current_page = 1;
        //     this.getEntries();
        // },
        start_date() {
            this.getEntries();
        },
        search_string() {
            this.isSearching = true;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.getEntries();
                this.isSearching = false;
            }, 1000);
        },
        'pagination.per_page'(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.pageSizeChange(newVal);
            }
        }
    },
    data() {
        return {
            fetching: false,
            entryLoaded: false,
            selectedFormId: '0',
            allEntry: [],
            pagination: {
                current_page: 1,
                per_page: 20,
                total: 0
            },
            router_form_id: parseInt(this.$route.params.form_id),
            delete_pop_up: false,
            deleting_row: null,
            deletetingItem: false,
            has_payment_items: true,
            has_subscription: false,
            multipleSelection: [],
            tableData: [],
            selectOption: 'Bulk Actions',
            visible: false,
            loading: false,
            selectedIds: [],
            payment_methods: window.wpPayFormsAdmin.payment_methods,
            isSearching: false,
            timeout: null,
            search_string: '',
            entry_ticker: 1,
            reports: {},
            currencySettings: {},
            is_payment_form: false,
            dateRange: null,
            start_date: null,
            end_date: null,
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
            available_forms: [],
            localFormId: this.form_id,
            selected_entry_status: '',
            available_entry_statuses: window.wpPayFormsAdmin.entryStatuses,
            entryStatus: this.status,
            has_pro: window.wpPayFormsAdmin.has_pro
        }
    },
    computed: {
        page_sizes() {
            let start = 20;
            let stop = this.pagination.total;
            let step = 20;
            const remainder = stop % step;
            if (remainder) {
                stop = stop + step;
            }
            var result = [];
            for (var i = start; step > 0 ? i <= stop : i >= stop; i += step) {
                result.push(i);
            }
            return result;
        },
        showActionButton() {
            return this.multipleSelection.length > 0 && this.selectOption == 'delete';
        },
        showFormSelect() {
            return this.$route.path === '/entries';
        }
    },

    methods: {
        openGiftAidExport() {
            this.$emit('open-gift-aid-modal');
        },
        changeForm() {
            this.localFormId = this.selectedFormId;
            this.getEntries();
        },
        changeEntryStatus() {
            this.entryStatus = this.selected_entry_status;
            this.getEntries();
        },
        filterEntries(optionKey) {
            this.currentOption = optionKey;
            this.$router.push({
                query: {
                    filter: optionKey
                }
            });

            if (optionKey) {
                this.getEntries();
            }
        },
        performSearch() {
            // this.entry_ticker = this.entry_ticker + 1;
            this.isSearching = true,
                clearTimeout(this.timeout);
            const self = this;
            this.timeout = setTimeout(function () {
                self.getEntries();
                self.isSearching = false;
            }, 1000);
        },
        filterByDate() {
            this.start_date = this.dateRange == null ? null : moment(this.dateRange[0]).startOf('day').format('YYYY/MM/DD');
            this.end_date = this.dateRange == null ? null : moment(this.dateRange[1]).endOf('day').format('YYYY/MM/DD');
        },
        exportCSV(doc_type) {
            let query = {
                doc_type: doc_type,
                search_string: this.search_string,
                payment_status: this.currentOption,
                start_date: this.start_date,
                end_date: this.end_date,
                _wpnonce: window.wpPayFormsAdmin.rest.nonce
            };
            var data = new URLSearchParams(query)
            window.location.href = window.wpPayFormsAdmin.rest.url + `/form/${this.form_id}/export/?` + data;
        },
        formatCreatedAt(date) {
            return moment(date).format('MMM DD, YYYY HH:mm A');
        },
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + path;
        },
        getSvg(payment) {
            if (!this.payment_methods.hasOwnProperty(payment) || undefined == this.payment_methods[payment].svg) {
                return '';
            }
            return this.payment_methods[payment].svg;
        },
        getEntries() {
            this.fetching = true;
            //SubmissionController@index
            let query = {
                payment_status: this.currentOption,
                status: this.entryStatus,
                page_number: this.pagination.current_page,
                per_page: this.pagination.per_page,
                search_string: this.search_string,
                start_date: this.start_date,
                end_date: this.end_date,
            }
            this.$get(`form/${this.localFormId}/entries`, query)
                .then(response => {
                    this.allEntry = response.submissions;
                    this.pagination.total = response.total;
                    this.has_payment_items = response.hasPaymentItem;
                    this.has_subscription = response.hasSubscription;
                    this.entryLoaded = true;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON?.data?.message || 'An error occurred. Please try again.',
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.fetching = false;
                });
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.selectedIds = val.map(entry => entry.id);
        },
        showDeleteConformation(row) {
            this.deleting_row = row;
            this.delete_pop_up = true;
        },
        handleDeleteClose() {
            this.deleting_row = null;
            this.delete_pop_up = false;
        },
        deleteEntryNow() {
            this.deletetingItem = true;
            this.deleteRow([this.deleting_row.id]);
        },
        deleteRow(entries) {
            this.deletetingItem = true;
            // SubmissionController@remove
            this.$del('forms/entries/remove', {
                form_id: this.router_form_id,
                submission_id: entries,
            })
                .then(response => {
                    this.$notify.success({
                        title: 'Success!',
                        offset: 30,
                        message: response.message,
                        position: 'bottom-right'
                    })
                    this.getEntries();
                    this.deletetingItem = false;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON?.data?.message || 'An error occurred. Please try again.',
                        position: 'bottom-right'
                    })
                    this.deletetingItem = false;
                })
                .always(() => {
                    this.deletetingItem = false;
                    this.handleDeleteClose();
                });
        },
        deleteEntries() {
            this.deletetingItem = true;
            const ids = []
            this.multipleSelection.forEach(element => {
                ids.push(element.id)
            });
            this.deleteRow(ids);
        },

        changePage(page) {
            this.pagination.current_page = page;
            this.pagination.page_number = page;
            this.getEntries()
        },
        applyAction(row) {
            if (this.multipleSelection.length > 0 && this.selectOption === 'delete') {
                this.deleteEntries();
            }
        },
        getFormattedMoney(row) {
            let amount = row.payment_total;
            if (amount == 0) {
                return '0'
            } else if (!amount) {
                return 'n/a';
            } else if (row.hasSubscription) {
                return fromatPrice(row.subscription_payment_total, row.currencySettings);
            } else if (row?.submissionEntry?.transactions?.length) {
                const txn = row.submissionEntry.transactions[0];
                if (txn && txn.payment_total) {
                    amount = txn.payment_total;
                }
            }
            return fromatPrice(amount, row.currencySettings);
        },
        goToViewRoute(row) {
            this.$router.push({
                name: 'entry',
                params: { entry_id: row.id, form_id: row.form_id }
            });
        },
        pageSizeChange(pageSize) {
            this.pagination.per_page = pageSize;
            this.getEntries()
        },
        getPaymentStatusIcon(status, method) {
            if (!method) {
                return 'el-icon-close'
            }
            if (status === 'pending') {
                return 'wpf-pending';
            } else if (status === 'paid') {
                return 'wpf-paid';
            } else if (status === 'failed') {
                return 'wpf-fail';
            } else if (status === 'refunded') {
                return 'wpf-refunded';
            } else if (status === 'processing') {
                return 'wpf-processing'
            } else if (status === 'authorized') {
                return 'wpf-authorized';
            } else if (status === 'partially-refunded') {
                return 'el-icon-close';
            }
            return '';
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 == 0) {
                return 'wpf_row_even'
            }
            return 'wpf_row_odd';
        },
        changeStatus(scope, index, status) {
            this.$post(`form/${scope.form_id}/entries/${scope.id}/status`, {
                id: scope.id,
                status: status
            })
                .then(res => {
                    this.allEntry[index].status = res.status;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON?.data?.message || 'An error occurred. Please try again.',
                        position: 'bottom-right'
                    });
                });
        },
        getFormTitles() {
            this.$get('forms/formatted', {
            })
                .then(response => {
                    this.available_forms = response.available_forms;
                });
        }
    },
    mounted() {
        if (this.$route.query) {
            if (this.$route.query.customer_email) {
                this.search_string = this.$route.query.customer_email;
            }
            if (this.$route.query.filter) {
                this.currentOption = this.$route.query.filter;
            }
        }
        this.getEntries();
        this.getFormTitles();
        if (this.filter_data) {
            this.start_date = this.filter_data.startDate;
            this.end_date = this.filter_data.endDate;
            this.currentOption = this.filter_data.status;
        }
        //  window.WPPayFormsBus.$emit('site_title', 'Form Entries');
    }
}
</script>

<style>
/* .tablenav {
    padding-top: 10px !important;
}

.wpf_entries_table .el-table__cell {
    padding: 18px 0 !important;
} */
.custom-font-size {
    font-size: 5px !important;
}
</style>