<template>
    <div v-loading="loading" class="wppayforms">
        <welcome v-if="!forms_count && !hasForms" @create="createFormModal = true" />
        <!--We Have forms Now-->
        <div class="all_payforms_wrapper payform_section" v-else>
            <!-- show notice -->
            <DashboardNotices v-if="displayNotice" :displayNotice="displayNotice" />

            <div class="payform_section_header all_payment_form_wrapper" style="background:inherit;">
                <h1 class="payform_section_title">
                    {{ $t('All Forms') }}
                </h1>
                <div class="payform_section_actions">

                    <!-- <div class="payform_action search_action">
                        <p class="wpf_searching_notice" v-if="isSearching" style="color: #FFB380">searching...</p>
                        <div class="wpf_modules_search">
                            <el-input size="medium" :placeholder="$t('Search')" v-model="search_string"
                                class="wpf_search_input" @keyup.native="searchForm()">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </div>
                    </div> -->
                    <router-link class="payform_action" to="/new-form">
                        <el-button type="primary" size="medium">
                            <Icon icon="wpf-add" />
                            {{ $t('Add New Form') }}
                        </el-button>
                    </router-link>
                </div>
            </div>
            <div class="wpf_form_content">
                <div class="wpf_form_action_element">
                    <div class="wpf_sorting_element">
                        <!-- Start bulk action -->
                        <div class="wpf_bulk_action">
                            <!-- <label for="bulk-action-selector-top" class="screen-reader-text">
                                {{ $t('Select bulk action') }}
                            </label> -->
                            <!-- <select name="action" v-model="selectOption" class="custom-select">
                                <option :disabled="true" value="-1">{{ $t('Bulk Actions') }}</option>
                                <option value="delete">{{ $t('Delete Entries') }}</option>
                            </select>
                            <remove v-show="(multipleSelection.length > 0 && selectOption == 'delete')"
                                @on-confirm="applyAction" class="button action">
                                <p slot="info" style="font-size: 12px;">
                                    {{ $t('Selected forms will be deleted permanently?') }}
                                </p>

                                <template>
                                    {{ $t('Apply') }}
                                </template>
</remove> -->

                            <template>
                                <el-select v-model="selectOption" placeholder="Select action" class="custom_select">
                                    <el-option value="" :disabled="true">{{ $t('Bulk Actions') }}</el-option>
                                    <el-option :value="item.value" v-for="item in bulkOptions" :key="item.value">
                                        {{ $t(item.label) }}
                                    </el-option>
                                </el-select>
                            </template>

                            <Remove v-show="showActionButton" @on-confirm="applyAction" class="button_action">
                                <p slot="info">
                                    {{ $t('Selected forms will be deleted permanently?') }}
                                </p>
                                <template>
                                    {{ $t('Apply') }}
                                </template>
                            </Remove>
                        </div>
                        <!-- End bulk action -->
                        <!-- Start Search -->
                        <!-- <div class="payform_action search_action">
                            <p class="wpf_searching_notice" v-if="isSearching" style="color: #FFB380">searching...</p>
                            <div class="wpf_modules_search">
                                <el-input size="medium" :placeholder="$t('Search')" v-model="search_string"
                                    class="wpf_search_input" @keyup.native="searchForm()" prefix-icon="el-icon-search">
                                </el-input>
                            </div>
                        </div> -->

                        <div class="wpf_module_search">
                            <el-input size="medium" :placeholder="$t('Search')" v-model="search_string"
                                @keyup.native="searchForm()" prefix-icon="el-icon-search">
                            </el-input>
                        </div>

                        <!-- <div class="payform_action search_action">
                        <p class="wpf_searching_notice" v-if="isSearching" style="color: #FFB380">searching...</p>
                        <div class="wpf_modules_search">
                            <el-input placeholder="Type something" prefix-icon="el-icon-search" v-model="search_string">
                            </el-input>
                        </div>

                    </div> -->


                        <!-- End Search -->
                        <!-- Start date time picker -->
                        <div class="wpf_modules_date">
                            <el-date-picker v-model="filterDateRange" type="daterange" start-placeholder="Start Date"
                                end-placeholder="End Date">
                            </el-date-picker>
                        </div>
                        <!-- End date time picker -->

                        <!-- Start Order By -->
                        <!-- <el-select @change="fetchForms" v-model="order_by" placeholder="Select">
                        <el-option v-for="item in order_by_options" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select> -->
                        <!-- End Order By -->
                    </div>
                    <div class="wpf_form_filter">
                        <ul>
                            <li v-for="(option, key) in viewOptions" :key="key" @click="filterForms(key)"
                                :class="{ active: currentOption === key }">
                                {{ option.label }}
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-loading.fullscreen.lock="duplicatingForm"
                    element-loading-text="Duplicating the form.. Please wait..." class="payform_section_body">
                    <el-table class="payform_tables" :data="paymentForms" :default-sort="defaultSort"
                        :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" border>
                        <el-table-column type="selection" width="50">
                        </el-table-column>
                        <el-table-column  prop="ID" :label="$t('ID')" width="100" :sort-by="['ID']" sortable>

                            <template #default="scope">
                                <router-link :to="{ name: 'edit_form', params: { form_id: scope.row.ID } }">
                                    {{ scope.row.ID }}
                                </router-link>
                            </template>
                        </el-table-column>

                        <el-table-column  prop="post_title" :label="$t('Title')" :sort-by="['post_title']" sortable>

                            <template slot-scope="scope">

                                <!-- {{ scope.row.post_title }} -->
                                <!-- <router-link :to="{ name: 'edit_form', params: { form_id: scope.row.ID } }">
                                    {{ scope.row.post_title }}
                                </router-link> -->
                                <el-tooltip content="Form Editor" placement="top">
                                    <router-link v-if="scope.row.category === 'quick_form'" :to="{ name: 'quick_edit_form', params: { form_id: scope.row.ID } }">
                                        {{ scope.row.post_title }}
                                    </router-link>
                                    <router-link v-else :to="{ name: 'edit_form', params: { form_id: scope.row.ID } }">
                                        {{ scope.row.post_title }}
                                    </router-link>
                                </el-tooltip>
                                <!-- <div class="row-actions">
                                    <router-link v-if="scope.row.category === 'quick_form'"
                                        :to="{ name: 'quick_edit_form', params: { form_id: scope.row.ID } }">
                                        {{ $t('Edit') }}
                                    </router-link>
                                    <router-link v-else :to="{ name: 'edit_form', params: { form_id: scope.row.ID } }">
                                        {{ $t('Edit') }}
                                    </router-link>
                                    |
                                    <router-link :to="{ name: 'confirmation_settings', params: { form_id: scope.row.ID } }">
                                        {{ $t('Settings') }}
                                    </router-link>
                                    |
                                    <router-link :to="{ name: 'form_entries', params: { form_id: scope.row.ID } }">
                                        {{ $t('Entries') }}
                                    </router-link>
                                    |
                                    <a :href="scope.row.preview_url" target="_blank">{{ $t('Preview') }}</a>
                                    |
                                    <a style="color:#c71313" @click.prevent="confirmDeleteForm(scope.row)" href="#">{{
                                        $t('Delete') }}</a>
                                    |
                                    <a href="#" @click.prevent="duplicateForm(scope.row.ID)">{{ $t('Duplicate Form') }}</a>
                                </div> -->
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('Submissions')" width="130">

                            <template #default="scope">
                                <el-tooltip content="Entries" placement="top">
                                <router-link :to="{ name: 'form_entries', params: { form_id: scope.row.ID } }">
                                    {{ scope.row.entries_count }}
                                </router-link>
                            </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="post_date_gmt" :label="$t('Create Date')" width="145" :sort-by="['post_date_gmt']" sortable>

                            <template slot-scope="scope">
                                {{ scope.row.post_date_gmt | dateFormat }}
                            </template>
                        </el-table-column>
                        <el-table-column width="250" :label="$t('ShortCode')">

                            <template slot-scope="scope">
                                <el-tooltip effect="dark" content="Click to copy shortcode"
                                    title="Click to copy shortcode" placement="top">
                                    <code class="copy" :data-clipboard-text='`[wppayform id="${scope.row.ID}"]`'>
                                        <Icon icon="wpf-copy" /> [wppayform id="{{ scope.row.ID }}"]
                                    </code>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('Status')" width="120">
                            <template slot-scope="scope">
                                <el-tooltip placement="top" effect="dark"> 
                                    <div slot="content">{{$t('To Toggle: Settings > Scheduling > Form Status')}} </div>
                                    <label :class="scope.row.post_status ? 'wpf_form_status_' + scope.row.post_status : 'wpf_form_status_draft'">
                                        <Icon :icon="getFormStatusIcon(scope.row.post_status)" />
                                        {{ scope.row.post_status === 'publish' ? 'Active' : 'Inactive' }}
                                    </label>
                                </el-tooltip>
                            </template>
                        </el-table-column>

                        <el-table-column width="170">

                            <template slot-scope="scope">
                                <div class="wpf_action_button_group">
                                    <el-tooltip class="item" effect="dark" :content="$t('View')" placement="top-start">
                                        <a :href="scope.row.preview_url" target="_blank">
                                            <Icon icon="wpf-eye" />
                                        </a>
                                    </el-tooltip>

                                    <el-tooltip class="item" effect="dark" :content="$t('Edit')" placement="top-start">
                                        <router-link v-if="scope.row.category === 'quick_form'"
                                            :to="{ name: 'quick_edit_form', params: { form_id: scope.row.ID } }">
                                            <Icon icon="wpf-edit" />
                                        </router-link>
                                        <router-link v-else
                                            :to="{ name: 'edit_form', params: { form_id: scope.row.ID } }">
                                            <Icon icon="wpf-edit" />
                                        </router-link>
                                    </el-tooltip>

                                    <el-tooltip class="item" effect="dark" :content="$t('Delete')" placement="top-start">
                                        <a style="color:#565865" @click.prevent="confirmDeleteForm(scope.row)" href="#">
                                            <Icon icon="wpf-delete" />
                                        </a>
                                    </el-tooltip>
                                    <el-dropdown :show-timeout="500">
                                        <el-button class="el-dropdown-link" size="small">
                                            <Icon icon="wpf-tools" />
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item>
                                                <router-link
                                                    :to="{ name: 'confirmation_settings', params: { form_id: scope.row.ID } }">
                                                    <Icon icon="wpf-settings" />
                                                    <span>{{ $t('Settings') }}</span>
                                                </router-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <router-link
                                                    :to="{ name: 'form_entries', params: { form_id: scope.row.ID } }">
                                                    <Icon icon="wpf-entries" />
                                                    <span>{{ $t('Entries') }}</span>
                                                </router-link>
                                            </el-dropdown-item>
                                            <el-dropdown-item class="last-item">
                                                <a href="#" @click.prevent="duplicateForm(scope.row.ID)">
                                                    <Icon icon="wpf-duplicate" />
                                                    <span>{{ $t('Duplicate Form') }}</span>
                                                </a>       
                                            </el-dropdown-item>

                                            <el-dropdown-item class="last-item">
                                                <a href="#" @click.prevent="exportForm(scope.row.ID)">
                                                    <Icon icon="wpf-export" />
                                                    <span>{{ $t('Export Form') }}</span>
                                                </a>
                                            </el-dropdown-item>

                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- Display message when data is empty -->

                        <template #empty>
                            <Empty v-if="paymentForms.length === 0" src="images/empty-cart.svg"
                                :text="'There is no available data!!'" :image-size="120" />
                        </template>

                    </el-table>
                    <div class="wpf_pagination">
                        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="page_number" :page-size="per_page" :page-sizes="pageSizes"
                            layout="total, sizes, prev, pager, next" :total="total">
                        </el-pagination> -->
                        <div class="pager-wrap">
                            <span class="text">Page 1 to {{ per_page }} of {{ total }}</span>
                            <el-select v-model="per_page" placeholder="Select">
                                <el-option v-for="item in pageSizes" :key="item" :label="item + ' Per page'"
                                    :value="item" />
                            </el-select>
                        </div>

                        <div class="pagination_page_list">
                            <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
                                :total="total" :current-page="page_number" :page-size="per_page" :page-sizes="pageSizes"
                                @size-change="handleSizeChange">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Load Modals-->
        <create-form v-if="createFormModal" :demo_forms="demo_forms" :categories="categories"
            :modalVisible.sync="createFormModal" />

        <!--Delete form Confimation Modal-->
        <el-dialog :title="$t('Are You Sure, You want to delete this form?')" :visible.sync="deleteDialogVisible"
            :before-close="handleDeleteClose">
            <div class="wpf_confirmation_modal">
                <div class="modal_body wpf_confirmation_modal_body">
                    <p class="warning_text">{{ $t('All the data assoscilate with this form will be deleted, including payment information and other associate information')}}</p>
                    <p class="form_info">{{ $t('You are deleting form id')}}: <span>{{ deleteingForm.ID }}</span></p>
                    <p class="form_info">{{ $t('Form Title')}}: <span>{{ deleteingForm.post_title }}</span></p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="deleteDialogVisible = false">Cancel</el-button>
                    <el-button size="medium" type="primary" @click="deleteFormNow()">Confirm</el-button>
                </span>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
import { formatDate } from '../../Helper.js';
import Welcome from '../Common/Welcome';
import Remove from '../pieces/confirmation';
import CreateForm from './CreateForm';
import Clipboard from 'clipboard';
import DashboardNotices from '../pieces/DashboardNotices.vue';
import Empty from '../Common/Empty.vue';
import Icon from '../Icons/Index.vue';

export default {
    name: 'AllForms',
    components: {
        CreateForm,
        Welcome,
        DashboardNotices,
        Empty,
        Remove,
        Icon,
    },
    
    data() {
        return {
            //bulk action
            selectOption: 'Select Action',
            multipleSelection: [],
            selectedIds: [],
            //end bulk action
            //srtat filter section 
            filterDateRange: null,
            order_by: 'id',
            order: 'DESC',
            order_by_options: [{ label: 'ID', value: 'id' }, { label: 'Title', value: 'post_title' }, { label: 'Create Date', value: 'post_date' }],
            //end filter section
            hash: '',
            isSearching: false,
            createFormModal: false,
            paymentForms: [],
            hasForms: false,
            per_page: 20,
            page_number: 1,
            search_string: '',
            total: 0,
            loading: false,
            deleteDialogVisible: false,
            deleteingForm: {},
            pageSizes: [10, 20, 30, 40, 50, 100, 200],
            forms_count: parseInt(window.wpPayFormsAdmin.forms_count),
            duplicatingForm: false,
            loadingDemoForms: false,
            categories: [],
            demo_forms: {},
            timeout: null,
            displayNotice: false,
            currentOption: 'all',
            viewOptions: {
                all: {
                    label: this.$t('All Form'),
                },
                donation: {
                    label: this.$t('Advanced Donation'),
                },
            },
            bulkOptions: [
                { value: 'Delete Entries', label: 'Delete Entries' }
            ],
            defaultSort: { prop: 'ID', order: 'descending' },
            export_id: '',
        }
    },
    watch: {
        filterDateRange() {
            if (this.filterDateRange != null) {
                this.filterDateRange[0] = formatDate(this.filterDateRange[0]);
                this.filterDateRange[1] = formatDate(this.filterDateRange[1], true);
            }
            this.fetchForms();
        },
        per_page(newVal, oldVal) {
            if(newVal !== oldVal){
                this.handleSizeChange(newVal);
            }
        }
    },
    computed: {
        showActionButton() {
            return this.multipleSelection.length > 0 && this.selectOption === 'Delete Entries';
        }
    },
    methods: {
        // start bulk action
        applyAction() {
            if (this.multipleSelection.length > 0 && this.selectOption === 'Delete Entries') {
                this.$del('forms/remove', {
                    forms_ids: this.selectedIds,
                }).then(response => {
                    this.$notify.success({
                        title: 'Success!',
                        offset: 39,
                        message: response.message,
                        position: 'bottom-right',
                    });
                    this.fetchForms();
                }).fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 39,
                        message: error.responseJSON.message,
                        position: 'bottom-right',
                    });
                });
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.selectedIds = val.map(form => form.ID);
        },

        fetchForms() {

            this.loading = true;
            let params = {
                per_page: this.per_page,
                page_number: this.page_number,
                search_string: this.search_string,
                filter_by_date: this.filterDateRange,
                order_by: this.order_by,
                order: this.order
            };

            // FormsController@index
            this.$get('forms', params)
                .then(response => {
                    this.paymentForms = response.forms;
                    this.hasForms = !!response.total;
                    this.total = response.total;
                })
                .fail(error => {
                    this.$showAjaxError(error);
                })
                .always(() => {
                    this.loading = false;
                });
        },
        handleSortChange({ prop, order }) {
            this.order_by = prop;
            this.order = order === 'ascending' ? 'asc' : 'desc';
            this.fetchForms();
        },
        searchForm() {
            this.isSearching = true;
            clearTimeout(this.timeout);
            const self = this;
            this.timeout = setTimeout(function () {
                self.fetchForms();
                self.isSearching = false;
            }, 1000);

        },
        confirmDeleteForm(form) {
            this.deleteingForm = form;
            this.deleteDialogVisible = true;
        },
        deleteFormNow() {
            //FormController@remove
            this.$del(`form/${this.deleteingForm.ID}`, {
            })
                .then(response => {
                    this.$notify.success({
                        title: 'Success!',
                        offset: 39,
                        message: response.message,
                        position: 'bottom-right',
                    });
                    this.fetchForms();
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 39,
                        message: error.responseJSON.message,
                        position: 'bottom-right',
                    });
                })
                .always(() => {
                    this.deleteDialogVisible = false;
                    this.deleteingForm = {};
                });
        },
        handleDeleteClose() {
            this.deleteingForm = {};
        },
        handleCurrentChange(val) {
            this.page_number = val;
            this.fetchForms();
        },
        handleSizeChange(val) {
            this.per_page = val;
            this.fetchForms();
        },
        duplicateForm(formId) {
            this.duplicatingForm = true;
            // FormController@duplicateForm
            this.$post(`form/${formId}/duplicate`, {})
                .then(response => {
                    if (response.form.ID) {
                        this.$notify.success({
                            offset: 30,
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                        this.$router.push({
                            name: 'edit_form',
                            params: {
                                form_id: response.form.ID
                            }
                        });
                    } else {
                        this.$notify.error({
                            offset: 30,
                            title: 'Oops!',
                            message: 'Something is wrong! Please try again',
                            position: 'bottom-right'
                        });
                    }
                })
                .fail((error) => {
                    this.$notify.error({
                        offset: 30,
                        title: 'Oops!',
                        message: error.responseJSON.message,
                        position: 'bottom-right'
                    });
                    this.$showAjaxError(error);
                })
                .always(() => {
                    this.duplicatingForm = false;
                });
        },
        getDemoForms() {
            this.loadingDemoForms = true;
            this.$get('forms/demo', {})
                .then(response => {
                    this.demo_forms = response.demo_forms;
                    this.categories = response.categories;
                })
                .fail(error => {
                    this.$showAjaxError(error);
                })
                .always(() => {
                    this.loadingDemoForms = false;
                });
        },
        checkStatus() {
            this.$get('forms/settings/check-status', {})
                .then(response => {
                    this.displayNotice = response.displayNotice;
                })
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 == 0) {
                return 'wpf_row_even'
            }
            return 'wpf_row_odd';
        },

        filterForms(optionKey) {
            this.currentOption = optionKey;
            if (this.currentOption === 'donation') {
                const filteredForms = this.paymentForms.filter(obj => obj.category === 'quick_form');
                this.paymentForms = filteredForms;
            } else {
                this.fetchForms();
            }
        },
        exportForm(export_id) {
            this.export_id = export_id;
            const baseUrl = window.wpPayFormsAdmin.rest.url + '/tools/form/' + this.export_id + '/export';
            let url = new URL(baseUrl);
            url.searchParams.append('_wpnonce', window.wpPayFormsAdmin.rest.nonce);
            window.location.href = url.href;
            this.$notify.success('Form Exported Sccessfully!!');
            this.export_id = '';
    },
    getFormStatusIcon(status) {
        switch(status) {
            case 'publish':
                return 'wpf-active';
            case 'draft':
                return 'wpf-inactive';
            default:
                return '';
        }
    }

    },
    created() {
        this.hash = window.location.hash;
        if (this.hash.indexOf('new-form=1') != -1) {
            this.createFormModal = true;
        }
    },
    beforeRouteUpdate(to) {
        if (to.hash.indexOf('new-form=1') != -1) {
            this.createFormModal = true;
        }
    },
    mounted() {
        jQuery('body').removeClass('folded');
        this.fetchForms();
        this.getDemoForms();
        this.checkStatus();
        if (!window.wpf_clip_inited) {
            var clipboard = new Clipboard('.copy');
            clipboard.on('success', (e) => {
                this.$message({
                    offset: 39,
                    message: 'Copied to Clipboard!',
                    type: 'success'
                });
            });
            window.wpf_clip_inited = true;
        }

        window.WPPayFormsBus.$emit('site_title', 'Forms');
    }
}
</script>