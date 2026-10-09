<template>
    <el-radio-group :class="dynamicClasses" class="wpf_payment_item_radio_vertical">
        <el-radio
            v-for="(option_name, option_key) in field_options"
            :label="option_name.key"
            :key="option_name.key"
            :class="['wpf_payment_item_radio_div', {'horizontal': horizontal === 'yes'}]"
            :style="{display: 'flex', alignItems: enable_image === 'yes' ? 'flex-start' : 'center'}"
        >
            <div class="wpf_payment_item_radio_label">
                <div class="payment-item" @click="radioLabelEdit = option_key"
                    v-if="radioLabelEdit !== option_key">
                    <div class="payment_item_image" v-if="enable_image === 'yes'">
                        <img style="display: block; padding: 5px 0;" 
                        :src="getImageUrl(option_name?.photo?.image_full)"   
                        :alt="option_name?.photo?.alt_text" width="70" height="70"/>
                    </div>
                    <div :class="enable_image === 'yes' ? 'wpf-price-label' : 'wpf-price-label no-image'">
                        <span class="label">{{option_name[`${key_value}`]}} </span>
                        <span class="dash" v-if="isPaymentItem"> - </span>
                        <span class="price" v-if="isPaymentItem"> $ {{ option_name.value }} </span>
                    </div>
                </div>
                <el-button
                    @click="removeRadioButton(option_key, field_options)"
                    type="text"
                    v-if="radioLabelEdit !== option_key && isDynamic"
                    icon="el-icon-minus"
                >
                </el-button>
                <el-button
                    @click="addRadioButton(field_options)"
                    type="text"
                    v-if="radioLabelEdit !== option_key && isDynamic"
                    icon="el-icon-plus"
                ></el-button>
                <input
                    @blur="radioLabelEdited(option_name)"
                    @focus="radioLabelEdited('', option_name[`${key_value}`])"
                    style="max-width: 90%"
                    v-if="radioLabelEdit === option_key"
                    v-model="option_name[`${key_value}`]" :placeholder="option_name[`${key_value}`]"
                    >
                </input>
            </div>
        </el-radio>
    </el-radio-group>
</template>
<script>
    export default {
        props: ['field_options', 'isDynamic', 'isPaymentItem', 'enable_image', 'option_key', 'horizontal', 'column_numbers', 'currencySign', 'inline'],
        data() {
            return {
                radioLabelEdit: '',
                prevText : '',
                key_value: 'label',
                default_image: window.wpPayFormsAdmin.default_image
            }
        },
        computed: {
            dynamicClasses () {
                return { 
                    [`wpf_payment_item_${this.column_numbers}`]: this.horizontal === 'yes',
                    'wpf_payment_item_horizontal': this.horizontal === 'yes',
                    'wpf_inline_items': this.inline === 'yes',
                }
            },
            getImageUrl() {
                return (image) => {
                    return image ? image : this.default_image;
                }
            }
        },
        methods : {
            radioLabelEdited(option = {}, prevText = '') {
                if (typeof option === 'string') {
                    this.prevText = prevText;
                    return;
                }
                if (option[`${this.key_value}`]?.length) {
                    this.radioLabelEdit = ''
                } else {
                    option[`${this.key_value}`] = this.prevText;
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
        },
        mounted() {
            if (this.option_key) {
                this.key_value = this.option_key;
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

    .wpf_payment_item_radio_vertical {
        display: flex;
        flex-direction: column;
        gap: 10px;

        &.wpf_inline_items {
            flex-direction: row;
            flex-wrap: wrap;
        }

        .wpf_payment_item_radio_div {
            // display: flex;
            // align-items: flex-start;
            // margin: 10px;

            .wpf_payment_item_radio_label {
                display: flex;
                align-items: center;
                gap: 5px;
                .el-button--text  {
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
        }
    }
    

    .wpf_payment_item_radio_vertical.horizontal {
        .wpf_payment_item_radio_div {
            margin: 0;
            display: block;
            width: 100%;
            white-space: normal;
            word-break: break-word;
            border-radius: 8px;

            .wpf_payment_item_image {
                text-align: center;
                padding: 10px 0;
                img {
                    width: 100%;
                    aspect-ratio: 3/2;
                    border-radius: 8px;
                }
            }

            .el-button--text  {
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
                background-color: #fff;
                padding: 2px 5px;
                border-radius: 6px;
                margin-top: 4px;
                &:focus {
                    border: none;
                    outline: none;
                    box-shadow: none;
                }
            }

            .wpf_payment_item_components{
                font-size: 13px;
            }
            .wpf_payment_item_text, .wpf_payment_item_price {
                display: block;
                width: 100%;
                white-space: normal;
                word-wrap: break-word;
            }

            .wpf_payment_item_price {
                padding-top: 6px;
            }
        }
    }

    // .wpf_payment_item_2.horizontal{
    //   display: grid;
    //   grid-template-columns: repeat(2, 1fr);
    //   gap: 20px;
    //   grid-auto-flow: column;
    //   .overflow-ellipsis {
    //         max-width: 365px;
    //         width: 94%;
    //         white-space: nowrap;
    //         overflow: hidden;
    //         text-overflow: ellipsis;
    //         display: block;
    //     }
    // }

    @mixin payment-item($count) {
        &.horizontal {
            display: grid;
            grid-template-columns: repeat(#{$count}, 1fr);
            gap: 20px;
        }
    }

    .wpf_payment_item_2 {
    @include payment-item(2);
    }

    .wpf_payment_item_3 {
    @include payment-item(3);
    }

    .wpf_payment_item_4 {
    @include payment-item(4);
    }

    .wpf_payment_item_5 {
    @include payment-item(5);
    }
</style>