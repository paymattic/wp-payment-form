<template>
    <div class="calculation-wrapper">
        <!-- Enable/Disable Calculation Toggle -->
        <el-form-item :label="item.label">
            <el-checkbox v-model="element.field_options.numeric_calculation" true-label="yes" false-label="no">
            </el-checkbox>
        </el-form-item>

        <!-- Calculation Expression Section -->
        <div v-show="element.field_options.numeric_calculation === 'yes'" class="calculation-components"
            style="text-align: end;">

            <div class="wpf_calculation_expression">
                <div class="wpf_calculation_expression_label">
                    <label class="wpf_numeric_field_label" for="">Calculation Expression</label>
                    <el-popover placement="bottom-start" trigger="click"
                        popper-class="numeric-fields-popover">
                        <template #reference>
                            <!-- <i class="el-icon-document numeric-fields-icon"></i> -->
                             <div class="wpf_numeric_field_icon">
                                <span>
                                    {{ $t('Insert Placeholder') }}
                                </span>
                               <Icon icon="wpf-drop-down-icon" />
                             </div>
                        </template>

                        <div class="numeric-fields-container">
                            <ul class="numeric-fields-list">
                                <li v-for="field in numericElements" :key="field.id"
                                    @click="insertFieldIntoExpression(field.id)" class="numeric-field-item">
                                    <div class="field-item-content">
                                        <span class="field-label">{{ field.field_options.label }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </el-popover>
                </div>
                <div class="wpf_calculation_expression_input">
                    <!-- <el-input v-model="element.field_options.calculation_expression" type="textarea" :rows="5"
                        :placeholder="$t('Enter calculation expression')" /> -->
                    <div class="wpf_calculation_expression_textarea">
                        <Textarea  
                        v-model="element.field_options.calculation_expression"  
                        :rows="5"
                        :placeholder="$t('Enter your expression here...')"
                        @change="handleExpressionChange"  
                    />  
                    </div>
                    <div class="expression-helper">
                        <p> You can use these operators: +, -, *, /, % and expression like: 5 + 10, 140 % 50. See <a href="https://paymattic.com/docs/dynamic-payment-item-field/">Documentation</a> for more... </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Textarea from '../../Common/Textarea.vue';
import { getContainersFields } from '../editor/editorHelper';
import Icon from '../../Icons/Index.vue';
export default {
    name: 'NumericCalculation',
    components: {
        Textarea,
        Icon
    },
    props: ["element", "all_elements", "item"],
    computed: {
        numericElements() {
            const numericTypes = [
                'number',
                'payment_item',
                'tabular_products',
                'custom_payment_input',
                'tax_payment_input',
                'recurring_payment_item',
                'coupon',
                'dynamic_payment_item',
                'donation_item'
            ];
            let all_elements = this.all_elements;
            let container_fields = getContainersFields(this.all_elements);
            all_elements = [...container_fields, ...all_elements];
            return all_elements.filter(
                element => element.id !== this.element.id && numericTypes.includes(element.type) && element.field_options.disable !== true
            );
        },
    },
    methods: {
        insertFieldIntoExpression(fieldId) {
            const formattedField = `{input.${fieldId}}`;
            this.element.field_options.calculation_expression += formattedField;
        },
        handleExpressionChange(content) {  
            this.$emit('expression-change', content);  
        }
    },
}  
</script>

<style scoped>
.wpf_calculation_expression_label {
    display: flex;
    justify-content: space-between;
    padding-left: 210px;
}

.el-popover.el-popper.numeric-fields-popover {
    width: fit-content;
}
.wpf_numeric_field_label {
	display: flex;
	align-items: flex-end;
	padding-bottom: 3px;
}
.wpf_numeric_field_icon {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.6%;
    border-radius: 8px;
    border: 1px solid #E1E4EA;
    font-family: 'Inter', sans-serif;
    padding: 5px 10px;
    cursor: pointer;
}

.wpf_calculation_expression_input {
    padding: 5px 0 5px 210px;
}

.expression-helper {
    text-align: start;
}

.numeric-fields-icon {
    cursor: pointer;
    color: #409EFF;
    transition: color 0.3s ease;
}
numeric-fields-icon:hover {
    color: #66b1ff;
}

.select-numeric-field-icon {
    font-size: 16px;
    cursor: pointer;
    color: #409EFF;
    transition: color 0.3s ease;
}

.select-numeric-field-icon:hover {
    color: #66b1ff;
}

.numeric-fields-container {
    max-height: 300px;
    overflow-y: auto;
}

.numeric-fields-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.numeric-field-item {
    padding: 6px;
    cursor: pointer;
    margin-bottom: 0;
    transition: background-color 0.3s ease;
    border-bottom: 1px solid #ebeef5;
}

.numeric-field-item:last-child {
    border-bottom: none;
}

.numeric-field-item:hover {
    background-color: #f5f7fa;
}

.field-item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.field-label {
    font-size: 12px;
    color: #303133;
}

.field-type {
    font-size: 12px;
    color: #909399;
    background-color: #f0f2f5;
    padding: 2px 6px;
    border-radius: 4px;
}

.numeric-field-item:active {
    background-color: #e6f2ff;
}
.expression-helper {
	padding-top: 5px;
}
.expression-helper p {
	margin: 0;
}
</style>