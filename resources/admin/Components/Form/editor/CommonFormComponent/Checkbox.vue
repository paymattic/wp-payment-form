<template>
    <div :class="dynamicClasses" class="wpf_payment_item_checkbox_vertical">
        <el-checkbox
            v-for="(option_name, option_key) in field_options"
            :label="option_name.key"
            :key="option_name.key"
            :style="{display: 'flex', alignItems: enable_image === 'yes' ? 'flex-start' : 'center'}"
            checked
            :class="['wpf_payment_item_checkbox_div', {'horizontal': horizontal === 'yes'}]"
        >
        <div class="wpf-radio-label">
                <span
                    class="payment-item "
                    @click="radioLabelEdit = option_key"
                    v-if="radioLabelEdit !== option_key">
                    <div class="payment_item_image" v-if="enable_image === 'yes'">
                        <img style="display: block" :src="getImageUrl(option_name.photo.image_full)" :alt="option_name.photo.alt_text" width="70" height="70"></img>
                    </div>
                    <div :class="enable_image === 'yes' ? 'wpf-price-label' : 'wpf-price-label no-image'">
                        <span class="label">{{option_name.label}} </span>
                        <span class="dash" v-if="isPaymentItem"> - </span>
                        <span class="price" v-if="isPaymentItem"> ${{ option_name.value}}</span>
                    </div>
                </span>
                <el-button
                    v-if="radioLabelEdit !== option_key && isDynamic"
                    @click="removeRadioButton(option_key, field_options)"
                    type="text"
                    icon="el-icon-minus"
                >
                </el-button>
                <el-button
                    v-if="radioLabelEdit !== option_key && isDynamic"
                    @click="addRadioButton(field_options, 'Checkbox Item')"
                    type="text"
                    icon="el-icon-plus"
                ></el-button>
                <input 
                    @blur="radioLabelEdited(option_name)"
                    @focus="radioLabelEdited('', option_name.label)"
                    style="max-width: 90%" 
                    v-if="radioLabelEdit === option_key"
                    v-model="option_name.label" :placeholder="option_name.label"
                    >
                </input>
            </div>
        </el-checkbox> 
    </div> 
</template>
<script>
    export default {
        props: ['field_options', 'isDynamic', 'isPaymentItem', 'enable_image', 'horizontal', 'currencySign', 'column_numbers', 'inline'],
        data() {
            return {
                radioLabelEdit: '',
                prevText : '',
            }
        },
        computed: {
            dynamicClasses () {
                return { 
                    [`wpf_payment_item_${this.column_numbers}`]: this.horizontal === 'yes', 
                    'wpf_payment_item_horizontal' : this.horizontal === 'yes',
                    'wpf_inline_items': this.inline === 'yes'
                }
            }
        },
        methods : {
            getImageUrl(image) {
                return image ? image : window.wpPayFormsAdmin.default_image;
            },
            radioLabelEdited(option = {}, prevText = '') {
                if (typeof option === 'string') {
                    this.prevText = prevText;
                    return;
                }
                if (option?.label?.length) {
                    this.radioLabelEdit = '' 
                } else {
                    option.label = this.prevText;
                    this.radioLabelEdit = '' 
                }
            },
            removeRadioButton (key, options) {
                if (options?.length > 1) {
                    options.splice(key, 1);
                } else {
                    this.$message({
                        offset: 39,
                        message: 'You should take atleast one item',
                        type: 'error'
                    });
                }
            },
            addRadioButton (options, prefixString = 'Radio Item') {
                options.push({ label: prefixString + ' ' + (options?.length + 1), value: prefixString + ' ' + (options?.length + 1)  })
            }
        }
    }
</script>
<style scoped lang="scss">
    // .input-component {
    //     display: block;
    //     width: 100% !important;
    //     max-width: 100% !important;
    //     padding: 8px;
    //     min-height: 45px;
    //     border: 1px solid #e4e7ea;
    // }
    .wpf_payment_item_checkbox_vertical {
        display: flex;
        flex-direction: column;
        gap: 10px;
        &.wpf_inline_items {
            flex-direction: row;
            flex-wrap: wrap;
        }
    }

    .wpf_payment_item_checkbox_div {
        display: flex;
        align-items: flex-start;
        &.el-checkbox {
            margin-right: 0;
        }
    }

    .wpf-radio-label {
        display: flex;
        gap: 5px;
        width: 100%;
        white-space: normal;
        word-break: break-word;
        .el-button--text  {
        //    display: none;
            padding: 0;
            width: 0;
            transition: .3s;
            overflow: hidden;
            border: none;
        }
        &:hover {
            .el-button--text  {
                width: 16px;
                margin-right: -16px;
                &:last-child {
                    margin-left: 14px;
                }
            } 
        }
        input {
            border: none;
            background-color: white;
            &:focus {
                border: none;
                outline: none;
                box-shadow: none;
            }
        }
    }
</style>
