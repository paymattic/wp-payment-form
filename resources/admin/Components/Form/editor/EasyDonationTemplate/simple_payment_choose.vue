<template>
    <div class="wpf-donation-choose-payment-method">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Select all</el-checkbox>
        <el-checkbox-group v-model="checkList" v-if="item && item.available_methods">
            <el-checkbox v-for="(payMethod, methodKey) in item.available_methods" :key="methodKey"
                :label="methodKey">{{ payMethod.label }}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>

<script type="text/babel">
import each from 'lodash/each';
import PaymentMethodSettings from '../ChoosePaymentMethod/_PaymentMethodSettings'
export default {
    name: 'choose_payment_method',
    props: ['item', 'method_settings', 'field_options'],
    components: { PaymentMethodSettings },
    data() {
        return {
            app_ready: false,
            activeName: '',
            checkList: [],
            isIndeterminate: false,
            checkAll: false,
            available_methods: [],
            available_methods_list: []
        }
    },
    watch: {
        checkList: {
            handler(newCheckList) {
                this.checkAll = this.available_methods_list.length === newCheckList.length;
                this.isIndeterminate = newCheckList.length > 0 &&
                    newCheckList.length < this.available_methods_list.length;
                each(this.method_settings.payment_settings, (payment_method, payment_method_key) => {
                    if (payment_method_key, newCheckList.includes(payment_method_key)) {
                        this.method_settings.payment_settings[payment_method_key].enabled = 'yes';
                        this.method_settings.payment_settings[payment_method_key].logo = payment_method.logo
                    } else {
                        this.method_settings.payment_settings[payment_method_key].enabled = 'no';
                        this.method_settings.payment_settings[payment_method_key].logo = payment_method.logo
                    }
                })

            }, deep: true
        }
    },
    methods: {
      handleCheckAllChange(val) {
        this.checkList = val ? this.available_methods_list : [];
        this.isIndeterminate = false;
      }
    },
    mounted() {
        if (this.method_settings && !this.method_settings.payment_settings) {
            this.$set(this.method_settings, 'payment_settings', {});
        }
        if (this.method_settings) {
            each(this.item?.available_methods, (methodName, methodKey) => {
                this.available_methods_list.push(methodKey)
                if (!this.method_settings?.payment_settings[methodKey]) {
                    this.$set(this.method_settings?.payment_settings, methodKey, {
                        enabled: 'no',
                        logo: '',
                    });
                }
                if (this.method_settings?.payment_settings[methodKey]?.enabled === 'yes') {
                    this.method_settings.payment_settings[methodKey].checkKey = methodName.label;
                    this.checkList.push(methodKey);
                }
                this.method_settings.payment_settings[methodKey].logo = methodName.logo ? methodName.logo : this.item?.available_methods[methodKey].logo;
            });
            this.checkAll = Object.keys(this.item?.available_methods).length === this.checkList.length;
            this.isIndeterminate = Object.keys(this.item?.available_methods).length !== this.checkList.length;
            this.app_ready = true;
        }
    }
}
</script>
<style scoped>
el-radio__input.is-checked .el-radio__inner, .el-checkbox__input.is-checked .el-checkbox__inner{
  /* border-color: #FFB380 !important;
  background-color: #FF7518 !important; */
}
.el-radio.is-bordered.is-checked {
  border-color: #FFB380;
}
.el-radio__inner:hover, .el-checkbox__inner:hover {
  border-color: #FFB380;
}
.el-radio__input.is-checked+.el-radio__label, .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #504f4f !important;
}
.el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #FFB380;
}
</style>