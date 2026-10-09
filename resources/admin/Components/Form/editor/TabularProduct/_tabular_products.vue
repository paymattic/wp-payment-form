<template>
    <div class="tabular_products_wrapper">
        <h3 class="tabular_title">Choose tabular template</h3>
        <el-radio-group class="wpf-choose-tabular-template-cards" v-model="field_options.layout">
            <div :class="getClassName('table')">
                <el-radio-button class="tabular_template_choose" label="table">
                    <img :src="tableIcon" />
                    <img class="active-icon" :src="activeIcon" alt="">
                </el-radio-button>
                <h6 class="template-title">Table template</h6>
            </div>
            <div :class="getClassName('grid')">
                <el-radio-button class="tabular_template_choose" label="grid">
                    <img :src="gridIcon" />
                    <img class="active-icon" :src="activeIcon" alt="">
                </el-radio-button>
                <h6 class="template-title">Grid template</h6>
            </div>
            <div :class="getClassName('row')">
                <el-radio-button class="tabular_template_choose" label="row">
                    <img :src="rowIcon" />
                    <img class="active-icon" :src="activeIcon" alt="">
                </el-radio-button>
                <h6 class="template-title">Single line template</h6>
            </div>
        </el-radio-group>

        <div class="tablular_headings">
            <div>
                <h4 class="tabular_title">{{ item.label }}</h4>
            </div>
            <div class="tabular_actions">
                <el-checkbox  v-if="field_options.layout == 'table'"
                    v-model="field_options.enable_image"
                    true-label="yes" false-value="no"
                    label="yes">Enable Image
                </el-checkbox>
                <el-checkbox v-if="field_options.layout == 'table'" :disabled="field_options.enable_image != 'yes'"
                    v-model="field_options.enable_lightbox"
                    true-label="yes" false-value="no"
                    label="yes">Enable Lightbox
                </el-checkbox>
                <el-checkbox  v-if="checkIsGridOrRow()"
                    v-model="field_options.enable_product_size"
                    true-label="yes" false-value="no"
                    label="yes">Enable Custom Options
                </el-checkbox>
                <el-checkbox v-if="checkIsGridOrRow()"
                    v-model="field_options.enable_search"
                    true-label="yes" false-value="no"
                    label="yes">Enable Product Filter
                </el-checkbox>
                <el-checkbox v-if="checkIsGridOrRow()"
                    v-model="field_options.enable_feature" 
                    true-label="yes" false-value="no"
                    label="yes">Enable Categories
                </el-checkbox>
                <!-- <el-switch class="switch-box" v-if="checkIsGridOrRow()" v-model="field_options.enable_product_size"
                    active-value="yes" inactive-value="no" active-text="Enable Custom Options" /> -->
                <!-- <el-switch v-if="checkIsGridOrRow()" v-model="field_options.enable_search" active-value="yes"
                    inactive-value="no" active-text="Enable Product Filter" class="switch-box" /> -->
                <!-- <el-switch v-if="checkIsGridOrRow()" v-model="field_options.enable_feature" active-value="yes"
                    inactive-value="no" active-text="Enable Categories" class="switch-box" /> -->
                <!-- <el-switch v-if="field_options.layout == 'table'" :disabled="field_options.enable_image != 'yes'"
                    v-model="field_options.enable_lightbox" active-value="yes" inactive-value="no"
                    active-text="Enable Lightbox" class="switch-box" /> -->
            </div>
        </div>

        <div class="product_wrap" v-if="checkIsGridOrRow() && field_options.enable_feature === 'yes'">
            <div class="product_settings_wrapper">
                <h4 class="tabular_title">{{ $t('Manage Product Categories') }}</h4>
                <div class="category-manage-wrapper">
                    <key-pair-options :value.sync="field_options['categories']" :hide_bulk_action="true" />
                </div>
            </div>
        </div>

        <div class="tabular_product_pair_table_wrapper product_wrap_slider"
            v-if="field_options.layout == 'grid' || field_options.layout == 'row'">
            <h3 style="font-size: 18px;" class="tabular_title">{{ $t('Manage Product Settings') }}</h3>
            <div class="tabular-grid-row-products-settings-wrapper">
                <div class="product-list-sidebar">
                    <div class="product-list">
                        <p class="all-product">{{ $t('All Products') }} ({{ countProduct(product_settings) }})</p>
                        <span v-for="(item, index) in product_settings" :key="index" class="product-item">
                            <p @click="active_product = index" :class="index == active_product ? 'active' : ''">{{ item.product_name }}</p>
                        </span>
                    </div>
                    <div class="product-list-actions">
                        <el-button @click="add()" type="primary" size="mini">{{ $t('Add Product') }}</el-button>
                    </div>
                </div>
                <div class="product-list-settings">
                    <div class="product-settings-action">
                        <el-switch v-model="product_settings[active_product].enable_product" active-value="yes" inactive-value="no"
                            active-text="Disable Product" />
                        <div :class="product_settings.length == 1 ? 'delete-action disabled' : 'delete-action'" @click="deleteItem(active_product)">
                            <Icon :icon="'wpf-delete'" />
                            <span>{{ $t('Delete Product') }}</span>
                        </div>
                    </div>

                    <div class="product-details">
                        <h3 class="tabular_title">Product Details</h3>
                        <div class="product-details-body">
                            <h4>{{ $t('Product Name') }}</h4>
                            <el-input placeholder="Item Name" size="medium" v-model="product_settings[active_product].product_name"
                                type="text"></el-input>
                            <div class="product-meta-details">
                                <div class="product-meta">
                                    <h4>{{ $t('Product Price') }}</h4>
                                    <el-input-number size="medium" v-model="product_settings[active_product].product_price" :min="0"></el-input-number>
                                </div>
                                <div class="product-meta">
                                    <h4>{{ $t('Quantity') }}</h4>
                                    <el-input-number size="medium" v-model="product_settings[active_product].default_quantity" :min="0"></el-input-number>
                                </div>
                                <div class="product-meta">
                                    <h4>{{ $t('Minimum Quantity') }}</h4>
                                    <el-input-number size="medium" v-model="product_settings[active_product].min_quantity" :min="0"></el-input-number>
                                </div>
                                <div class="product-meta">
                                    <h4>{{ $t('Maximum Quantity') }}</h4>
                                    <el-input-number size="medium" v-model="product_settings[active_product].max_quantity" :min="0"></el-input-number>
                                </div>
                            </div>
                            <div class="select-box" v-if="field_options.enable_feature == 'yes'">
                                <h4>{{ $t('Choose product category') }}</h4>
                                <el-select size="medium"  v-model="product_settings[active_product].category" placeholder="Select">
                                    <el-option
                                    v-for="item in field_options['categories']"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="description-box">
                                <h4>{{ $t('Description') }}</h4>
                                <el-input placeholder="Product description" rows="4" v-model="product_settings[active_product].product_description"
                                    type="textarea">
                                </el-input>
                            </div>
                            <div class="product_settings_wrapper file-upload-wrapper">
                                <h4>{{ $t('Upload Multiple photo') }}: </h4>
                                <div class="images">
                                    <MultiplePhotoWidget :product="product_settings[active_product]" :is_multiple="true" :layout="field_options.layout" />
                                </div>
                            </div>

                            <div class="product_settings_wrapper custom-options" v-if="field_options.enable_product_size === 'yes'">
                                <h4>{{ $t('Product options') }}</h4>
                    
                                <div v-for="(option, index) in product_settings[active_product]['product_size']" class="product_options" :key="index">
                                    <div>
                                        <key-pair-options :has_price_column="true" :value.sync="option[0]['options']" :hide_bulk_action="true" >
                                            <div class="custom-options-header">
                                                <LabelEditor  v-model="option[0]['label']" :nullable="false" />
                                                <div :class="product_settings[active_product]['product_size'].length == 1 ? 'delete-action disabled' : 'delete-action'"  @click="deleteOption(index, product_settings[active_product]['product_size'])" >
                                                    <Icon :icon="'wpf-delete'"/>
                                                    <span>{{ $t('Delete Option') }}</span>
                                                </div>
                                            </div>
                                        </key-pair-options>
                                        <div class="product_option_btn">
                                            <el-button  @click="addOptions(product_settings[active_product])"
                                                v-show="(index + 1) == product_settings[active_product]['product_size'].length" icon="el-icon-plus" type="default"
                                                size="mini">Add More Options
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="manage-table-product" v-if="field_options.layout == 'table'">
            <h3 style="font-size: 18px;" class="tabular_title">{{ $t('Manage Product Settings') }}</h3>
            <div class="tabular_product_pair_table_wrapper table_wrap">
                <table class="ninja_filter_table">
                    <thead>
                        <tr>
                            <th style="width: 40px;"></th>
                            <th v-if="field_options.enable_image == 'yes'" style="width: 160px; text-align: center">{{ $t('Photo') }}</th>
                            <th style="width: 160px; text-align: center">{{ $t('Minimum Quantity') }}</th>
                            <th style="width: 160px; text-align: center">{{ $t('Maximum Quantity') }}</th>
                            <th style="width: 160px; text-align: center">{{ $t('Quantity') }}</th>
                            <th style="width: 160px; text-align: center">{{ $t('Price') }}</th>
                            <th style="width: 60px;"></th>
                        </tr>
                    </thead>
                    <draggable :options="{ handle: '.handle' }" :list="product_settings" :element="'tbody'">
                        <tr v-for="(item, index) in product_settings" :key="index">
                            <td>
                                <img class="handle" :src="assetsUrl('/images/table/cell-icon.svg')" alt="Not Found">
                            </td>
                            <td v-if="field_options.enable_image == 'yes'">
                                <photo-widget :upload_image="true" :product="item" :is_multiple="true" :layout="field_options.layout" />
                            </td>
                            <td>
                                <el-input-number size="small" v-model="item.min_quantity" :min="0"></el-input-number>
                            </td>
                            <td>
                                <el-input-number size="small" v-model="item.max_quantity" :min="0"></el-input-number>
                            </td>
                            <td>
                                <el-input-number size="small" v-model="item.default_quantity" :min="0"></el-input-number>
                            </td>
                            <td>
                                <el-input-number size="small" v-model="item.product_price" :min="0"></el-input-number>
                            </td>
                            <td>
                                <div :class="product_settings.length == 1 ? 'delete-action disabled' : 'delete-action'"  @click="deleteItem(index)" >
                                    <Icon :icon="'wpf-delete'" @click="deleteItem(active_product)" />
                                </div>
                            </td>
                        </tr>
                    </draggable>
                </table>
            </div>
            <!-- <el-button class="add-table-product-btn"  @click="add({}, product_settings.length - 1)" icon="el-icon-plus" type="default" size="mini">
                {{ $t('Add Product') }}
            </el-button> -->
            <div class="wpf_add_item">
                <a :underline="false" @click="add({}, product_settings.length - 1)">
                    <Icon icon="wpf-black-add" /> <span>Add Product</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import draggable from 'vuedraggable'
import PhotoWidget from '../Widget/PhotoWidget/_photo_widget';
import KeyPairOptions from "../Widget/KeyPairOption/_key_pair_options";
import LabelEditor from '../Widget/LabelEditor.vue';
import MultiplePhotoWidget from '../Widget/PhotoWidget/_multiple_photo_widget.vue';
import Icon from '../../../Icons/Index.vue';
export default {
    name: 'tabular_products',
    components: { draggable, PhotoWidget, KeyPairOptions, LabelEditor, MultiplePhotoWidget, Icon },
    props: ['item', 'product_settings', 'field_options'],
    data() {
        return {
            active_product: 0,
            stepslide: 0,
            tableIcon: window.wpPayFormsAdmin.asset_url + 'images/form/table.png',
            gridIcon: window.wpPayFormsAdmin.asset_url + 'images/form/grid.png',
            rowIcon: window.wpPayFormsAdmin.asset_url + 'images/form/row.png',
            activeIcon: window.wpPayFormsAdmin.asset_url + 'images/form/tabular_choose.svg',
        }
    },
    methods: {
        getClassName(layout) {
            return this.field_options.layout === layout ? 'wpf-choose-tabular-template-card active' : 'wpf-choose-tabular-template-card';
        },
        countProduct(product_settings) {
            return product_settings?.length || 0;
        },
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + path;
        },
        slideStep(e) {
            if (e === 'next') {
                this.stepslide++;
                if (this.stepslide > this.product_settings.length - 1) {
                    this.stepslide = 0;
                }
            } else {
                this.stepslide--;
                if (this.stepslide < 0) {
                    this.stepslide = this.product_settings.length - 1;
                }
            }

        },
        checkIsGridOrRow() {
            return this.field_options?.layout === 'grid' || this.field_options?.layout === 'row';
        },
        deleteItem(index) {
            console.log(this.product_settings?.length, 'length');
            if (this.product_settings?.length == 1) return;
            this.product_settings.splice(index, 1);
            this.active_product = index == 0 ? index : index-1;
        },
        deleteOption(index, item) {
            item?.splice(index, 1);
        },
        addOptions(item) {
            item.product_size.push([{
                label: 'Option Label Text',
                options: [{
                    label: 'Option 1',
                    value: 'Option 1',
                    price: '',
                }]
            }]);
        },
        add(item = {}, index = -1) {
            index = index === -1 ? this.product_settings.length : index + 1;
            this.product_settings.splice(index, 1, {
                product_name: `Product Title - ${this.product_settings.length}`,
                default_quantity: 1,
                min_quantity: 1,
                max_quantity: 100,
                product_price: 10,
                product_description: 'Product description',
                enable_product: 'no',
                product_size: [[{
                    label: 'Option Label Text',
                    options: [{
                        label: 'Option 1',
                        value: 'Option 1',
                        price: '',
                    }]
                }]],
                photo: [
                    {
                        'alt_text': 'default image',
                        'image_full': window.wpPayFormsAdmin.default_image,
                        'image_thumb': window.wpPayFormsAdmin.default_image,
                    }
                ],
            });
        }
    }
}
</script>

<style scoped lang="scss">
ul {
    list-style-type: none;
}

.template-title {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    padding: 0;
    margin-left: 10px;
    margin-bottom: 10px;
}

li {
    display: inline-block;
}

input[type="radio"][id^="cb"] {
    display: none;
}

label {
    border: 1px solid #fff;
    padding: 10px;
    display: block;
    position: relative;
    cursor: pointer;
}

label:before {
    background-color: white;
    color: white;
    content: " ";
    display: block;
    border-radius: 50%;
    border: 1px solid #d98147;
    position: absolute;
    top: -5px;
    left: -5px;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 28px;
    transition-duration: 0.4s;
    transform: scale(0);
}

label img {
    width: 100%;
    transition-duration: 0.2s;
    transform-origin: 50% 50%;
}

:checked+label {
    border-color: #fff;
}

:checked+label:before {
    content: "✓";
    background-color: #ff7518;
    transform: scale(1);
}

:checked+label img {
    transform: scale(0.9);
    box-shadow: 0 0 5px #ff7518;
    z-index: -1;
}

input[type=radio]:checked+label:before {
    color: white;
}


.product_option_del_btn {
    width: 180px;
    align-self: center;
    padding-left: 10px;
}

.switch-box {
    width: 210px !important;
    margin: 0px 10px 10px;
}

.el-input--mini {
    font-size: 12px;
    max-width: 470px;
    margin-left: 10px;
}





// // product slider
// .product-slider {
//     position: relative;
// }
// .product-slider .next,
// .product-slider .prev {
//     position: absolute;
//     left: 0;
//     top: 50%;
//     transform: translateY(-50%);
//     width: 35px;
//     height: 35px;
//     text-align: center;
//     line-height: 35px;
//     background: #ff7518;
//     color: #fff;
//     font-size: 18px;
//     border-radius: 50%;
//     cursor: pointer;
//     opacity: 0;
//     visibility: hidden;
//     transition: .3s;
// }
// .product-slider .next {
//     left: auto;
//     right: 0;
// }
// .product-slider .next i,
// .product-slider .prev i {
//     color: #fff !important;
// }

// .product-slider:hover .next,
// .product-slider:hover .prev {
//     opacity: 1;
//     visibility: visible;
// }
// .slide-footer {
//     width: 100%;
//     margin: 24px;
//     display: flex;
//     flex-wrap: wrap;
//     justify-content: space-between;
// }
</style>
