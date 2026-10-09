<template>
    <div v-if="this.app_ready">
        <el-form-item :label="$t('Select payment method')">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">{{ $t('Check all') }}</el-checkbox>
            <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="(payMethod, methodKey) in item.available_methods" :key="methodKey" :label="methodKey"
                    @change="handleCheckChange(methodKey)">{{ payMethod.label }}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('Payment method settings')">
            <el-tabs v-model="activeName">
                <el-tab-pane v-for="(payMethod, methodKey) in item.available_methods" :key="methodKey"
                    :label="payMethod.label" :name="payMethod.label"
                    v-if="method_settings.payment_settings[methodKey].enabled == 'yes'">
                    <div class="method_header">
                        <div v-if="payMethod.message" v-html="payMethod.message" class="method_header_info"></div>
                    </div>
                    <div v-if="method_settings.payment_settings[methodKey].enabled == 'yes'" class="payment_method_body">
                        <payment-method-settings :pay_method="payMethod"
                            :settings="method_settings.payment_settings[methodKey]"></payment-method-settings>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-form-item>
        <el-form-item :label="$t('Default payment method')">
            <el-select v-model="field_options.default_value" clearable placeholder="Select">
                <el-option v-for="item in checkList.filter(e => e)" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item>
    </div>
</template>

<script type="text/babel">
import each from 'lodash/each';
import PaymentMethodSettings from './_PaymentMethodSettings'
export default {
    name: 'choose_payment_method',
    props: ['item', 'method_settings', 'field_options'],
    components: { PaymentMethodSettings },
    data() {
        return {
            app_ready: false,
            activeName: '',
            checkList: [''],
            checkAll: false,

        }
    },
    watch: {
        checkList: {
            handler(newCheckList) {
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
    mounted() {
        if (!this.method_settings.payment_settings) {
            this.$set(this.method_settings, 'payment_settings', {});
        }
        each(this.item.available_methods, (methodName, methodKey) => {
            if (this.method_settings?.payment_settings[methodKey]?.enabled === 'yes') {
                this.method_settings.payment_settings[methodKey].checkKey = methodName.label;
                this.method_settings.payment_settings[methodKey].logo = methodName.logo;
                this.checkList.push(methodKey);
            }
            if (!this.method_settings.payment_settings[methodKey]) {
                this.$set(this.method_settings.payment_settings, methodKey, {
                    enabled: 'no',
                    checkKey: methodName.label,
                    logo: methodName.logo
                });
            }

            // Check if the methodKey is 'enable' and then render settings
            if (this.method_settings?.payment_settings[methodKey]?.enabled === 'yes') {
                this.activeName = this.item.available_methods[methodKey].label;
            }
        });
        this.app_ready = true;

        // If CheckAll is checked, checkAll is true
        this.checkAll = this.checkList.length - 1 === Object.keys(this.item.available_methods).length ? true : false;

        if (!this.field_options.default_value) {
            this.setDefaultPaymentMethod();
        }
        
    },

    methods: {
        handleCheckAllChange() {
            if (this.checkAll) {
                this.checkList = Object.keys(this.item.available_methods);
            } else {
                this.checkList = [];
            }
        },

        handleCheckChange(methodKey) {
            // Update selected payment method and open settings
            this.activeName = this.item.available_methods[methodKey].label;
        },

        setDefaultPaymentMethod() {
            const enabledPaymentMethod = Object.keys(this.method_settings.payment_settings).find(
                methodKey => this.method_settings.payment_settings[methodKey]?.enabled === 'yes'
            );

            if (enabledPaymentMethod) {
                this.field_options.default_value = enabledPaymentMethod;
            }
        }
    }
}
</script>