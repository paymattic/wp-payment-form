<template>
  <div v-loading="loading" class="wpf_coupon_wrapper">
    <div class="all_payforms_wrapper payform_section">
      <AppCard v-if="!coupon_status">
        <template slot="header">
          <h2 style="display: flex; gap: 10px;">{{ $t('Coupon Settings') }} <Icon icon="wpf-upgrade" /> </h2>
        </template>
        <template slot="body">
          <UpgradeNotice v-if="!has_pro" :title="$t('Coupon is a pro version feature.')" style="width: 97%;"/>
          <div class="wpf_pre_settings_wrapper" :class="{ 'disabled_content': !has_pro }">
            <h2>{{ $t('Paymattic Coupon Module')}}</h2>
            <p>
              {{ $t('Enable your users to apply coupon/discount code while purchasing something using Paymattic Payment Module. Just activate this module and setup your your coupons.')}}
            </p>
            <el-button @click="enableCouponModule()" type="primary" size="large">
              {{ $t('Enable Paymattic Coupon Module')}}
            </el-button>
          </div>
        </template>
      </AppCard>
      <div v-else>
        <!-- <AppCard v-if="!has_pro">
          <template slot="header">
            <h2>{{ $t('Coupon Settings') }}</h2>
          </template>
          <template slot="body">
            <UpgradeNotice :title="$t('Coupon is a pro version feature.')"/>
          </template>
        </AppCard> -->
        <div class="payform_section_header wpf_coupon_payform_section_header">
          <h2 class="payform_section_title">{{ $t('Available Coupons') }} <Icon icon="wpf-upgrade" /></h2>
          <div class="payform_section_actions wpf_coupon_payform_section_actions" :class="{ 'disabled_content': !has_pro }">
            <el-button
              @click="showAddCoupon()"
              type="primary"
              size="medium"
              class="wpf_new_ui_button">
              <Icon icon="wpf-add"/> {{ $t('Add New Coupon') }}
            </el-button>
          </div>
        </div>
        <div class="payform_section_body wpf_coupon_payform_section_body">
          <div v-if="!has_pro" style="display: flex; justify-content: center;">
            <UpgradeNotice :title="$t('Coupon is a pro version feature.')" :type="'cart'"/>
          </div>
          <el-table :class="{ 'disabled_content': !has_pro }" :data="coupons" :row-class-name="activeCoupon" stripe>
            <el-table-column width="60" :label="$t('ID')" prop="id" />
            <el-table-column :label="$t('Title')" prop="title" />
            <el-table-column :label="$t('Code')" prop="code" />
            <el-table-column :label="$t('Use Limit')">
              <template slot-scope="scope">
                <span v-if="scope.row.max_use == 0">{{ $t('No Limit')}}</span>
                <span v-else>{{ scope.row.max_use }}</span>
              </template>
            </el-table-column>
            <el-table-column width="110" :label="$t('Amount')">
              <template slot-scope="scope">
                {{ scope.row.amount}}
                <span v-if="scope.row.coupon_type == 'percent'">%</span>
              </template>
            </el-table-column>
            <el-table-column width="140" :label="$t('Expire Date')">
              <template slot-scope="scope">
                <span v-if="!scope.row.expire_date">{{ $t('No Expire Date')}}</span>
                <span v-else>{{ scope.row.expire_date }}</span>
              </template>
            </el-table-column>
            <el-table-column width="115" :label="$t('Status')">
              <template slot-scope="scope">
                <span v-if="isExpired(scope.row.expire_date)" class="wpf_coupon_status_expired">
                  <Icon icon="wpf-expired" />
                  {{ $t('Expired')}}
                </span>
                <span v-else="" :class="scope.row.status ? 'wpf_coupon_status_' + scope.row.status : 'wpf_counpon_status_none'">
                  <Icon :icon="getCouponStatusIcon(scope.row.status)" />
                  {{ scope.row.status }}
                </span>
              </template>
            </el-table-column>
            <el-table-column width="130" :label="$t('Actions')">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button
                    @click="editCoupon(scope.row)"
                    icon="el-icon-edit"
                  ></el-button>
                  <el-button
                    @click="deleteCoupon(scope.row)"
                    icon="el-icon-delete"
                  ></el-button>
                </el-button-group>
                <!-- <div class="wpf_action_button_group">
                  <el-tooltip class="item" effect="dark" content="Edit" placement="top-start">
                      <a  @click="editCoupon(scope.row)" href="#" >
                          <Icon icon="wpf-edit" />
                      </a>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="Edit" placement="top-start">
                      <a  @click="deleteCoupon(scope.row)" href="#" >
                          <Icon icon="wpf-delete" />
                      </a>
                  </el-tooltip>
                </div> -->
              </template>
            </el-table-column>
            <!-- Display message when data is empty -->

            <template #empty>
                <Empty v-if="coupons.length === 0" src="images/empty-cart.svg"
                    :text="'There is no available data!!'" :image-size="120" />
            </template>
          </el-table>
          <div v-if="has_pro">
            <pagination :pagination="pagination" @fetch="getCoupons" />
          </div>
        </div>
      </div>
      <!-- <el-dialog
        top="40px"
        :title="editing_coupon.id ? 'Edit Coupon' : 'Add a new Coupon'"
        :visible.sync="show_modal"
        :append-to-body="true"
        width="60%"
      > -->
      <Modal v-if="has_pro" :title="editing_coupon.id ? $t('Edit Coupon') : $t('Add a new Coupon')" :dialogVisible.sync="show_modal" :dialogWidth="width" @close="closeModal">
        <div v-if="show_modal" class="wpf_coupon_form wpf_inputs_new_ui">
          <el-form :data="editing_coupon" label-position="top">
            <div class="wpf_coupon_header">
              <!-- <h4>{{ $t('Basic Informations')}}</h4> -->
              <el-row class="wpf_coupon_header_components" :gutter="20">
                <el-col style="padding-left: 0 !important; padding-right: 10px !important;" :span="12">
                  <el-form-item :label="$t('Coupon Title')">
                  <el-input
                    type="text"
                    v-model="editing_coupon.title"
                    :placeholder="$t('Coupon Title')"
                  />
                <p>{{ $t('The name of this discount')}}</p>
                </el-form-item>
                </el-col>
                <el-col style="padding-left: 10px !important; padding-right: 10px;" :span="12">
                  <el-form-item :label="$t('Coupon Code')">
                    <el-input
                      type="text"
                      v-model="editing_coupon.code"
                      :placeholder="$t('Coupon Code')"
                    />
                    <p>
                      {{ $t('Enter your discount code (e.g. 10PERCENT) using only letters and numbers.')}}
                    </p>
                </el-form-item>
                </el-col>
              </el-row>
            </div>
            
            <div class="wpf_coupon_amount_header">
              <h4>{{ $t('Amount')}}</h4>
              <el-row class="wpf_coupon_amount_components" :gutter="20">
                <el-col style="padding-left: 0 !important;" :span="8">
                  <el-form-item :label="$t('Discount Type')">
                    <el-select v-model="editing_coupon.coupon_type" :placeholder="$t('Select')">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <p>{{ $t('Select the discount type to apply for this discount.')}}</p>
                  </el-form-item>
                </el-col>
                <el-col style="padding-left: 10px !important; padding-right: 10px;" :span="8">
                  <el-form-item :label="$t('Discount Amount / Percent')">
                    <el-input
                      :placeholder="$t('Discount Amount / Percent')"
                      type="number"
                      v-model="editing_coupon.amount"
                      :min="0"
                    />
                    <p v-if="editing_coupon.coupon_type == 'percent'">
                      {{ $t('Enter the discount percentage. 10 = 10%')}}
                    </p>
                  </el-form-item>
                </el-col>

                <el-col style="padding-left: 10px !important; padding-right: 10px;" :span="8">
                <el-form-item :label="$t('Min Purchase Amount')">
                  <el-input
                    :placeholder="$t('Min Purchase Amount')"
                    type="number"
                    v-model="editing_coupon.min_amount"
                    :min="0"
                  />
                  <p>
                    {{ $t('Enter minimum amount (leave blank if none).')}}
                  </p>
                </el-form-item>
              </el-col>
              </el-row>
            </div>
            <!-- <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="Discount Amount / Percent">
                  <el-input
                    placeholder="Discount Amount / Percent"
                    type="number"
                    v-model="editing_coupon.amount"
                    :min="0"
                  />
                  <p v-if="editing_coupon.coupon_type == 'percent'">
                    Enter the discount percentage. 10 = 10%
                  </p>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Discount Type">
                  <el-radio-group v-model="editing_coupon.coupon_type">
                    <el-radio label="percent">Percent Based Discount</el-radio>
                    <el-radio label="fixed">Fixed Discount</el-radio>
                  </el-radio-group>
                  <p>The kind of discount to apply for this discount.</p>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="Min Purchase Amount">
                  <el-input
                    placeholder="Min Purchase Amount"
                    type="number"
                    v-model="editing_coupon.min_amount"
                    :min="0"
                  />
                  <p>
                    The minimum amount that must be purchased before this
                    discount can be used. Leave blank for no minimum.
                  </p>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Stackable">
                  <el-radio-group v-model="editing_coupon.stackable">
                    <el-radio label="yes">Yes</el-radio>
                    <el-radio label="no">No</el-radio>
                  </el-radio-group>
                  <p>Can this coupon code can be used with other coupon code</p>
                </el-form-item>
              </el-col>
            </el-row> -->
            
            <div class="wpf_coupon_expiration_header">
              <h4>{{ $t('Expiration')}}</h4>
              <el-row class="wpf_coupon_expiration_components":gutter="30">
                <el-col style="padding-left: 0 !important; padding-right: 10px;" :span="8">
                  <el-form-item :label="$t('Limit Per User(Email Based)')">
                    <el-input
                      :placeholder="$t('Use limit')"
                      type="number"
                      v-model="editing_coupon.max_use"
                      :min="0"
                    />
                    <p>
                      {{ $t("Usage limit per user (0 for unlimited).")}}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col style="padding-left: 10px !important; padding-right: 10px;" :span="8">
                  <el-form-item :label="$t('Start Date')">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :placeholder="$t('Start Date')"
                      v-model="editing_coupon.start_date"
                    />
                    <p>
                      {{ $t('Start date (yyyy-mm-dd) or leave blank if none.')}}
                    </p>
                  </el-form-item>
                </el-col>
                <el-col style="padding-left: 10px !important; padding-right: 10px;" :span="8">
                  <el-form-item :label="$t('End Date')">
                    <el-date-picker
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :placeholder="$t('End Date')"
                      v-model="editing_coupon.expire_date"
                    />
                    <p>
                      {{ $t('Expiration date (yyyy-mm-dd) or leave blank if none.')}}
                    </p>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            
            <!-- <el-form-item label="Limit Per User(Email Based)">
              <el-input
                placeholder="Use limit"
                type="number"
                v-model="editing_coupon.max_use"
                :min="0"
              />
              <p>
                Enter the usage limit for a single user / Leave '0' for no
                limitation.
              </p>
            </el-form-item> -->
            
            <div class="wpf_coupon_additional_header">
              <h4>{{ $t('Additional Informations')}}</h4>
              <el-row class="wpf_coupon_additional_components" :gutter="20">
                <el-col style="padding-left: 0 !important; padding-right: 10px;" :span="12">
                  <el-form-item :label="$t('Applicable Forms')">
                    <el-select
                      :placeholer="$t('Select Forms')"
                      style="width: 100%"
                      multiple
                      v-model="editing_coupon.settings.allowed_form_ids"
                    >
                      <el-option
                        v-for="(formName, formId) in available_forms"
                        :key="formId"
                        :label="formName"
                        :value="formId"
                      ></el-option>
                    </el-select>
                    <p>{{ $t('Optional for all payment forms.')}}</p>
                  </el-form-item>
                </el-col>
                <el-col style="padding-left: 10px !important; padding-right: 10px;" :span="12">
                  <el-form-item :label="$t('Status')">
                    <el-select
                        :placeholer="$t('Status')"
                        style="width: 100%"
                        v-model="editing_coupon.status"
                    >
                      <el-option value="active">{{ $t('Active')}}</el-option>
                      <el-option value="inactive">{{ $t('Inactive')}}</el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col style="padding-top: 20px !important; padding-left: 0px !important;" :span="24">
                  <el-form-item :label="$t('Stackable')">
                    <el-checkbox true-label="yes" false-label="no" v-model="editing_coupon.stackable">{{ $t('Yes')}}</el-checkbox>
                      <p>{{ $t('Can this coupon code be combined with other codes')}}</p>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <div v-if="errors">
            <ul style="color: red">
              <li v-for="(error, i) in errors" :key="i">
                {{ Object.values(error).join(", ") }}
              </li>
            </ul>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeModal">{{ $t('Cancel')}}</el-button>
          <el-button type="primary" v-loading="saving" @click="saveCoupon()">{{ $t('Save Coupon')}}</el-button>
        </span>
      </Modal>
    </div>
  </div>
</template>

<script type="text/babel">
import Pagination from "../_Pagination.vue";
import UpgradeNotice from "../../Common/UpgradeNotice.vue";
import Icon from '../../Icons/Index.vue';
import Modal from '../../Common/Modal.vue';
import AppCard from "../../Common/AppCard.vue";
import Empty from '../../Common/Empty.vue';
export default {
  name: "Coupons",
  components: {
    Pagination,
    UpgradeNotice,
    Icon,
    Modal,
    AppCard,
    Empty
  },
  data() {
    return {
      loading: false,
      saving: false,
      coupons: [],
      coupon_status: true,
      pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
      },
      editing_coupon: {},
      show_modal: false,
      available_forms: {},
      errors: false,
      width: '70%',
      options: [{
          value: 'percent',
          label: 'Percent'
        }, 
        {
          value: 'fixed',
          label: 'Fixed'
        }],
      has_pro:window.wpPayFormsAdmin.has_pro,
    };
  },
  methods: {
    activeCoupon({ row, index }) {
      if (row.status == "active") {
        return "active-coupon-color";
      } else {
        return "inactive-coupon-color";
      }
    },
    getCoupons(pagination = false) {
      if (pagination) {
        this.pagination.current_page = pagination.current_page;
        this.pagination.per_page = pagination.per_page;
      }
      this.loading = true;
      this.$get("settings/coupon", { pagination: this.pagination })
        .then((response) => {
          this.coupon_status = response.coupon_status;
          if (response.coupon_status) {
            this.coupons = response.coupons;
            this.pagination.total = response.total;
            if (response.available_forms) {
              this.available_forms = response.available_forms;
            }
          }
        })
        .fail((error) => {
          this.$notify.error({
            title: "Oops!",
            message: error.responseJSON.message,
            position: 'bottom-right'
          });
        })
        .always(() => {
          this.loading = false;
        });
    },
    enableCouponModule() {
      if(!this.has_pro){
        return;
      }
      this.loading = true;
      this.$post("settings/coupon/activate", {})
        .then((response) => {
          this.coupon_status = response.coupon_status;
          this.getCoupons();
        })
        .fail((error) => {
           this.$notify.error({
            title: "Oops!",
            message: error.responseJSON.message,
            position: 'bottom-right'
          });
        })
        .always(() => {
          this.loading = false;
        });
    },
    showAddCoupon() {
      this.editing_coupon = {
        title: "",
        code: "",
        amount: "",
        coupon_type: "percent",
        status: "active",
        stackable: "no",
        settings: {
          allowed_form_ids: [],
          user_ids: [],
        },
        min_amount: "",
        max_use: 0,
        start_date: "",
        expire_date: "",
      };
      this.show_modal = true;
    },
    saveCoupon() {
      if(!this.has_pro) {
        return;
      }
      this.saving = true;
      this.errors = false;
      this.$post("settings/coupon", {
        coupon: this.editing_coupon,
      })
        .then((response) => {
          this.getCoupons();
          this.show_modal = false;
          this.editing_coupon = {};
          this.$notify.success({
            title: 'Success!',
            message: response.message,
            position: 'bottom-right',
          });
        })
        .fail((error) => {
          this.$notify.error({
            title: "Oops!",
            message: error.responseJSON.message,
            position: 'bottom-right'
          });
          this.errors = error.responseJSON.errors;
        })
        .always(() => {
          this.saving = false;
        });
    },
    editCoupon(coupon) {
      const editing_coupon = JSON.parse(JSON.stringify(coupon));
      if (
        !editing_coupon.settings &&
        !editing_coupon.settings.allowed_form_ids
      ) {
        if (!editing_coupon.settings) {
          editing_coupon.settings = {};
        }
        editing_coupon.settings.allowed_form_ids = [];
      }
      this.$set(this, "editing_coupon", editing_coupon);
      this.$nextTick(() => {
        this.show_modal = true;
      });
    },
    deleteCoupon(coupon) {
      this.loading = true;
      this.$del("settings/coupon", {
        coupon_id: coupon.id,
      })
        .then((response) => {
          this.getCoupons();
          this.$notify.success({
            title: 'Success!',
            message: response.message,
            position: 'bottom-right',
          });
        })
        .fail((error) => {})
        .always(() => {
          this.loading = false;
        });
    },
    getCouponStatusIcon(status) {
            if (status == 'active') {
                return 'wpf-active';
            } else if (status == 'inactive') {
                return 'wpf-inactive';
            }
            return '';
        },
        isExpired(expiryDate) {
        const today = new Date();
        const expirationDate = new Date(expiryDate);
        return expirationDate < today;
    },
    closeModal() {
      this.show_modal = false;
    }
  },
  mounted() {
    if (this.has_pro) {
      this.getCoupons();
    }
  },
};
</script>

<style lang="scss">
.wpf_coupon_form {
  .el-form-item {
    > label {
      font-weight: 500;
      line-height: 100%;
    }
    p {
      margin-top: 5px;
      color: gray;
      font-size: 12px;
    }
  }
}
.wpf_coupon_wrapper {
  //   padding: 16px;
  .active-coupon-color {
    color: #f0a370;
  }
  .inactive-coupon-color {
    color: #909394;
  }
}
.el-table th.el-table__cell {
	background-color: #F5F6F7 !important;
	padding-left: 10px;
}
.el-table td.el-table__cell {
	padding-left: 10px;
}
.el-pagination {
	padding: 0;
}
</style>
