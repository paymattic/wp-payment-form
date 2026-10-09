<template>
	<div>
    <div>
      <div class="wpf_content_wrapper_parent_v2 wpf_customer_header">
        <div class="payform_customers_title">
          <h2>{{ $t('Customers') }} ({{total}})</h2>
        </div>
        <UpgradeNotice v-if="!has_pro" title="Customers module is a pro version feature" type="cart" style="top: 50% !important;"/>
        <div class="wpf_customer_modules_search" :class="{'disabled_content': !has_pro}">
          <el-date-picker
              v-model="date_picker"
              type="daterange"
              range-separator="-"
              start-placeholder="Start date"
              style="width: 250px"
              end-placeholder="End date">
          </el-date-picker>
          <el-input size="medium" :placeholder="$t('Search')" v-model="query_info.search"
              class="wpf_search_input" @keyup.native="searchCustomers()" prefix-icon="el-icon-search">
          </el-input>
        </div>
      </div>
      <div class="customer_table" :class="{'disabled_content': !has_pro}">
        <el-table
        v-loading="fetchingCustomer"
        element-loading-text="Loading..."
        element-loading-spinner="el-icon-loading"
        class="wpf_customers_table"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%; margin-bottom: 12px"
        @sort-change="handleSortable"
        :row-class-name="tableRowClassName"
      >
        <el-table-column show-overflow-tooltip :label="$t('Name')" width="380">
          <template slot-scope="scope">
            <div class="user-section">
              <div class="user-avatar" v-html="scope.row.avatar">
              </div>
              <div class="user-info">
                <div class="user-name">
                  {{scope.row.customer_name}}
                  <el-tooltip
                    v-if="scope.row.is_givewp_migrated"
                    effect="dark"
                    :content="$t('Migrated')"
                    placement="top"
                  >
                    <span class="wpf_migrated_badge" aria-label="Migrated">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </span>
                  </el-tooltip>
                </div>
                <div class="user-email">
                  <a style="cursor: pointer;" @click="preview(scope.row)">{{scope.row.customer_email}}</a>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
    
        <el-table-column :label="$t('Submissions')" prop="submissions" width="220" sortable="custom" align="center">
          <template slot-scope="scope">{{
            scope.row.submissions
          }}</template>
        </el-table-column>
        <el-table-column
          :label="$t('First Submission')"
          width="240"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
          <i class="el-icon-date"></i> {{scope.row.time_ago }}
          </template>
        </el-table-column>
        <el-table-column
            :label="$t('Created At')"
            width="240"
            sortable="custom"
            show-overflow-tooltip
            prop="created_at"
          >
          <template slot-scope="scope">
            {{scope.row.created }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="180">
          <template slot-scope="scope">
            <!-- <el-button size="mini" plain type="primary" icon="el-icon-view" @click="preview(scope.row)" class="wpf_plain_button">
            </el-button> -->
            <el-tooltip class="item" effect="dark" content="View Customer Subscription And Entries Details" placement="top-start">
              <el-button size="mini" plain  @click="preview(scope.row)">
                  {{  $t('View Detail') }}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

            <!-- Display message when customer is empty -->
          <template #empty>
                  <Empty v-if="tableData.length === 0" src="images/empty-cart.svg" :text="'There is no available data!!'" :image-size="120" />
          </template>
        </el-table>
        <!-- <el-pagination
          class="wpf_inputs_new_ui"
          style="float: right;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page.sync="query_info.currentPage"
          :page-sizes="[10, 20, 40, 50, 100, 200]"
          :page-size="query_info.pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
        </el-pagination> -->

        <div class="wpf_pagination">
          <div class="pager-wrap">
              <span class="text">Page 1 to {{ query_info.pageSize }} of {{ total }}</span>
              <el-select v-model="query_info.pageSize" placeholder="Select">
                  <el-option v-for="item in query_info.page_sizes" :key="item" :label="item + ' Per page'" :value="item" />
              </el-select>
          </div>

          <div class="pagination_page_list">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :current-page.sync="query_info.currentPage" :page-sizes="query_info.page_sizes"
                  :page-size="query_info.pageSize" layout="prev, pager, next" :total="total">
              </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-else>
        <UpgradeNotice title="Customers module is a pro version feature"/>
        <img style="width:100%" :src="assetsUrl('/images/promotions/customer.png')" />
    </div> -->
	</div>
</template>

<script>
import UpgradeNotice from '../Common/UpgradeNotice.vue';
import moment from 'moment';
import Empty from '../Common/Empty.vue';
import Icon from '../Icons/Index.vue';
	export default {
		name: 'Customers',
    components: {
      UpgradeNotice,
      Empty,
      Icon
    },
		data() {
			return {
				has_pro: window.wpPayFormsAdmin.has_pro,
        date_picker: '',
        filter_date: '',
        isSearching: false,
        fetchingCustomer:  false,
        selected_payment_status: '',
        selected_entry_status: '',
				total: null,
        query_info: {
          sort_by : "created_at",
          sort_type: 'desc',
          currentPage: 1,
          pageSize: 20,
          page_sizes: [10, 20, 40, 50, 100, 200]
        },
        search: '',
				tableData: [],
			};
		},
    props: {
      filter_data: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
    'query_info.pageSize'(newVal, oldVal) {
        if (newVal !== oldVal) {
            this.handleSizeChange(newVal);
        }
    },
    date_picker: {
        handler: function (val) {
          if (!this.has_pro) {
              return;
            }
            this.filterCustomers();
        },
        deep: true
    }
},
		methods: {
      tableRowClassName({row, rowIndex}) {
        if(rowIndex%2==0)
        {
          return 'wpf_row_even'
        }
        return 'wpf_row_odd';
      },
      assetsUrl(path) {
          return window.wpPayFormsAdmin.assets_url + path;
      },
      filterCustomers() {
        let date = this.date_picker;
        if(date) {
          let start_date = moment(date[0]).format('YYYY-MM-DD');
          let end_date = moment(date[1]).format('YYYY-MM-DD');

          this.filter_date = {
              startDate: start_date,
              endDate: end_date
          };
        } else {
          this.filter_date = '';
        }
        this.getCustomers();
      },
      getCustomers() {
        this.fetchingCustomer = true;
        this.$get('reports/customers', {
          queries: this.query_info,
          filter_date: this.filter_date,
          search: this.search
        }).then(response => {
          this.fetchingCustomer = false;
          this.prepareCustomerData(response);
        }).always(() => {
          this.fetchingCustomer = false;
        });
      },
      prepareCustomerData(response) {
        const { customers, total } = response;
        // item.created_at is in iso format not item.created, moment can parse iso format
        customers?.map(item => item.date = moment(item.created_at).startOf('day').fromNow())
        this.tableData = customers;
        this.total = total;
      },
      preview(val) {
        if(!this.has_pro){
          return;
        }
        this.$router.push({path: '/customers/' + val.customer_email});
      },
      filter() {
        this.getCustomers();
      },
      searchCustomers() {
        if(!this.has_pro){
          return;
        }
        this.isSearching = true;
        clearTimeout(this.timeout);
        const self = this;
        this.timeout = setTimeout(function () {
            // enter this block of code after 1 second
            // handle stuff, call search API etc.
            self.getCustomers();
            self.isSearching = false;
        }, 1000);
      },
			handleCurrentChange(val) {
				this.query_info.currentPage = val;
        this.getCustomers();
			},
			handleSizeChange(val) {
				this.query_info.pageSize = val;
        this.getCustomers();
			},
      handleSortable(sorting) {
        if (sorting.order === 'descending') {
          this.query_info.sort_by = sorting.prop;
          this.query_info.sort_type = 'desc';
        } else {
          this.query_info.sort_by = sorting.prop;
          this.query_info.sort_type = 'asc';
        }

        this.getCustomers();
      },
      filterByDate() {
        this.getCustomers();
      }
		},
    mounted() {
      if (this.filter_data && this.has_pro) {
            this.filter_date = {
                startDate: this.filter_data.startDate,
                endDate: this.filter_data.endDate
            };
            this.date_picker = [this.filter_data.startDate, this.filter_data.endDate];
      }
      this.has_pro && this.getCustomers();
      window.WPPayFormsBus.$emit('site_title', 'Customers');
    }
	};
</script>

<style>
	.wpf_customers_table .el-table__cell {
		padding: 12px !important;
	}
	.wpf_customers_table .user-name {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.wpf_customers_table .wpf_migrated_badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #ecf5ff;
		color: #409eff;
		cursor: help;
	}
	.wpf_customers_table .wpf_migrated_badge svg {
		display: block;
	}
  /* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
