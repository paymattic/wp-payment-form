<template>
    <div class="wpf_inputs_new_ui">
        <el-form label-width="210px">

            <el-form-item label="Rate Mode">
                <el-radio-group v-model="fieldOptions.rate_type">
                    <el-radio label="global_rate">Global Rate</el-radio>
                    <el-radio label="per_gateway">Per Gateway</el-radio>
                </el-radio-group>
            </el-form-item>

            <template v-if="fieldOptions.rate_type === 'global_rate'">
                <el-form-item label="Fee Percentage (%)">
                    <el-input-number
                        v-model="fieldOptions.global_rate.percent"
                        :step="0.1"
                        :min="0"
                        :max="99"
                        size="mini"
                    />
                </el-form-item>
                <el-form-item label="Additional Fee Amount">
                    <el-input-number
                        v-model="fieldOptions.global_rate.fixed"
                        :precision="0"
                        :min="0"
                        :step="1"
                        size="mini"
                    />
                    <p class="wpf-fee-help-text" style="padding-left: 0;">Enter in cents. e.g. 30 = 0.30</p>
                </el-form-item>
            </template>

            <template v-if="fieldOptions.rate_type === 'per_gateway'">
                <el-form-item label="Gateway Rates">
                    <div class="wpf-fee-gateway-table">
                        <el-row class="wpf-fee-gateway-header">
                            <el-col :span="10">Gateway</el-col>
                            <el-col :span="6">Fee Percentage (%)</el-col>
                            <el-col :span="6">
                                Additional Fee (cents)
                                <el-tooltip content="Enter in cents. e.g. 30 = 0.30" placement="top">
                                    <i class="el-icon-question" />
                                </el-tooltip>
                            </el-col>
                            <el-col :span="2" />
                        </el-row>
                        <el-row
                            v-for="(row, index) in fieldOptions.gateway_rates"
                            :key="index"
                            class="wpf-fee-gateway-row"
                        >
                            <el-col :span="10" style="padding-right: 15px">
                                <el-select
                                    v-model="row.gateway"
                                    size="small"
                                    placeholder="Select gateway"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="gw in selectableGateways(index)"
                                        :key="gw.value"
                                        :value="gw.value"
                                        :label="gw.label"
                                    />
                                </el-select>
                            </el-col>
                            <el-col :span="6" style="padding-right: 15px">
                                <el-input-number
                                    v-model="row.percent"
                                    :step="0.1"
                                    :min="0"
                                    :max="99"
                                    size="mini"
                                    style="width: 100%"
                                />
                            </el-col>
                            <el-col :span="6" style="padding-right: 15px">
                                <el-input-number
                                    v-model="row.fixed"
                                    :precision="0"
                                    :min="0"
                                    :step="1"
                                    size="mini"
                                    style="width: 100%"
                                />
                            </el-col>
                            <el-col :span="2" class="wpf_el_action">
                                <el-button @click="deleteGatewayRow(index)">
                                    <el-tooltip effect="dark" content="Delete" placement="top-start">
                                        <Icon icon="wpf-delete" />
                                    </el-tooltip>
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="wpf_add_item">
                        <a :class="{ 'wpf-disabled': !hasMoreGateways }" @click="addGatewayRow">
                            <Icon icon="wpf-black-add" /> <span>Add More</span>
                        </a>
                    </div>
                </el-form-item>
            </template>

            <el-form-item label="Fee Mode">
                <el-checkbox v-model="fieldOptions.donor_opt_in">Allow Donor Opt-in</el-checkbox>
            </el-form-item>

            <el-form-item v-if="fieldOptions.donor_opt_in" label="Opt-in Label">
                <el-input
                    v-model="fieldOptions.label"
                    placeholder="I'd like to cover the {fee_amount} transaction fee."
                    size="mini"
                />
                <p class="wpf-fee-help-text" style="padding-left: 0;">
                    Use <code>{fee_amount}</code> as placeholder for the calculated fee.
                </p>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import Icon from '../../../Icons/Index.vue';
export default {
    name: 'FeeRecoveryComponent',
    components: { Icon },
    props: {
        element: {
            type: Object,
            required: true
        },
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        fieldOptions() {
            return this.element.field_options;
        },
        availableGateways() {
            var methods = (window.wpPayFormsAdmin && window.wpPayFormsAdmin.active_payment_gateways) || {};
            return Object.keys(methods).map(function (key) {
                return { value: key, label: methods[key].title || key };
            });
        },
        hasMoreGateways() {
            var added = (this.fieldOptions.gateway_rates || []).map(function (r) { return r.gateway; });
            return this.availableGateways.some(function (gw) {
                return added.indexOf(gw.value) === -1;
            });
        }
    },
    created() {
        if (!this.fieldOptions.gateway_rates) {
            this.$set(this.fieldOptions, 'gateway_rates', []);
        }
        if (this.fieldOptions.gateway_rates.length === 0) {
            var firstGw = this.availableGateways[0];
            this.fieldOptions.gateway_rates.push({ gateway: firstGw ? firstGw.value : '', percent: 2.9, fixed: 30 });
        }
    },
    methods: {
        selectableGateways(rowIndex) {
            var rows = this.fieldOptions.gateway_rates || [];
            var currentGateway = rows[rowIndex] ? rows[rowIndex].gateway : '';
            var added = rows.map(function (r) { return r.gateway; });
            return this.availableGateways.filter(function (gw) {
                return gw.value === currentGateway || added.indexOf(gw.value) === -1;
            });
        },
        addGatewayRow() {
            if (!this.hasMoreGateways) return;
            if (!this.fieldOptions.gateway_rates) {
                this.$set(this.fieldOptions, 'gateway_rates', []);
            }
            var added = (this.fieldOptions.gateway_rates || []).map(function (r) { return r.gateway; });
            var firstAvailable = this.availableGateways.find(function (gw) {
                return added.indexOf(gw.value) === -1;
            });
            this.fieldOptions.gateway_rates.push({ gateway: firstAvailable ? firstAvailable.value : '', percent: 2.9, fixed: 30 });
        },
        deleteGatewayRow(index) {
            this.fieldOptions.gateway_rates.splice(index, 1);
        }
    }
};
</script>

<style lang="scss" scoped>
.wpf-fee-help-text {
    font-size: 12px;
    color: #909399;
    margin: 4px 0 0;

    code {
        background: #f5f5f5;
        padding: 1px 4px;
        border-radius: 2px;
    }
}

.wpf-fee-gateway-table {
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 10px;
}

.wpf-fee-gateway-header {
    background: #f5f7fa;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #606266;
    border-bottom: 1px solid #dcdfe6;

    .el-icon-question {
        margin-left: 3px;
        cursor: pointer;
    }
}

.wpf-fee-gateway-row {
    padding: 15px;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
        border-bottom: none;
    }
}

.wpf_el_action {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 3px;

    ::v-deep .el-button {
        box-shadow: none;
        margin-top: 2px;
        padding: 8px 10px;

        &:hover,
        &:focus {
            background: transparent;
            border: none;
            color: #f56c6c;
        }
    }
}

.el-button {
    padding: 6px 12px;
}

.el-col {
    padding: 4px 0;
}
</style>
