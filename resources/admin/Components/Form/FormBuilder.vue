<template>
    <el-container>
        <el-main class="wpf_form_builder wpf_bg_white_shadow">
            <el-dialog
                title="Premium features"
                :visible.sync="isVisible"
                width="50%">
                <div style="text-align: center;">
                    <div style="min-height: 50px" element-loading-spinner="el-icon-loading" v-loading="fetching" class="field_group_body dragArea">
                        <el-button
                            v-for="(component,componentIndex) in disabledMessage"
                            :key="'item_'+componentIndex"
                            size="mini"
                            :data-item_name="component.editor_title"
                            type="plain"
                            v-bind:style="{ 'margin-bottom' : '10px', 'margin-left' : '1px', 'opacity': '0.5' }"
                            class="wpf_element_items wpf_item_payment item_active"
                        >
                            <img :src="renderIcons(component)" width="32" alt="">
                            <span class="field_title">{{ component.editor_title }}</span>
                        </el-button>
                    </div>
                    <div class="payform_upgrade_section">
                        <h4>{{ $t('Customized your form with pro version')}}</h4>
                        <a target="_blank" :href="pro_purchase_url" class="el-button el-button--medium el-button--danger">{{ $t('Upgrade To Pro version')}}</a>
                    </div>
                </div>
            </el-dialog>
            <div class="edit_form_warpper">
                <div class="all_payforms_wrapper payform_section">
                    <div class="payform_section_header wpf_sticky_title" style="top:-17px;">
                        <h3 class="payform_section_title" style="padding-left: 12px;">
                            {{ $t('Custom Form Fields') }}
                        </h3>
                        <div class="payform_section_actions">
                            <el-button @click="saveSettings()" class="payform_action" size="medium" type="primary" style="min-width: 120px">
                                {{ $t( buttonText ) }}
                            </el-button>
                        </div>
                    </div>
                    <div
                        v-loading="fetching"
                        element-loading-background="rgb(255, 255, 255)"
                        element-loading-text="Loading Builder..."
                        id="payform_builder" class="payform_section_body">
                        <div v-if="validationErrors" class="validation_errors_block">
                            <el-alert v-for="(error,error_key) in validationErrors" :key="error_key" type="error" show-icon>
                                {{error}}
                            </el-alert>
                        </div>

                        <div class="payform_builder_items">
                            <draggable
                                :options="{handle:'.handler', animation: 0, ghostClass: 'ghost', group:'components'}"
                                :list="builder_elements"
                                :element="'div'"
                            >
                                <template v-if="builder_elements.length" style="height:100%;">
                                    <div v-for="element in builder_elements" :key="element.id"
                                         class="payform_builder_item builder_wrap">
                                        <div :style="element.field_options.disable ? disableStyle : activeStyle" class="payform_builder_header">
                                            <div :class="current_editing == element.id ? 'editor_is_active payform_head_left' : 'payform_head_left'">
                                                <div class="handler payform_inline_item">
                                                    <span class="dashicons dashicons-menu"></span>
                                                </div>
                                                <div class="element_title payform_inline_item">
                                                    {{ (element.field_options && element.field_options.label) ?
                                                    element.field_options.label : element.editor_title }}
                                                </div>
                                            </div>
                                            <div @click="toggleEditing(element.id)" class="payform_head_right">
                                                <div :style="element.field_options.disable ? disableStyle : activeStyle" class="element_type payform_inline_item">
                                                    {{ element.editor_title }}
                                                </div>
                                                <div class="element_control payform_inline_item">
                                                    <span class="dashicons dashicons-arrow-down-alt2"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <transition name="slide-down">
                                            <div v-if="current_editing == element.id"
                                                 class="payform_builder_item_settings">
                                                <OldElementEditor @deleteItem="deleteItem(element)"
                                                                @updateItem="saveSettings"
                                                                :element="element" :all_elements="builder_elements"
                                                                />
                                            </div>
                                        </transition>
                                    </div>
                                </template>
                                <div v-else class="empty_builder_items">
                                    <img style="max-width: 100%; max-height: 300px;" :src="empty_form_image"/>
                                </div>
                            </draggable>
                            <div v-if="builder_elements.length"
                                 class="payform_submit_button_settings payform_builder_item" style="padding: 0px 30px;">
                                <div class="payform_builder_header">
                                    <div class="payform_head_left">
                                        <div class="payform_inline_item">
                                            <span class="el-icon-setting"></span>
                                        </div>
                                        <div class="element_title payform_inline_item">
                                            {{ $t('Submit Button Settings')}}
                                        </div>
                                    </div>
                                    <div @click="toggleEditing('_submit_button')" class="payform_head_right">
                                        <div class="element_type payform_inline_item">
                                            button
                                        </div>
                                        <div class="element_control payform_inline_item">
                                            <span class="dashicons dashicons-arrow-down-alt2"></span>
                                        </div>
                                    </div>
                                </div>
                                <transition name="slide-down">
                                    <div v-if="current_editing == '_submit_button'"
                                         class="payform_builder_item_settings">
                                        <submit-button-settings @updateSettings="saveSettings"
                                                                :submit_button="submit_button_settings"/>
                                    </div>
                                </transition>
                            </div>
                        </div>

                        <el-alert
                            v-if="form_tips && showNotice"
                            class="payform_builder_notices"
                            @close="hideNotices"
                            type="warning" show-icon>
                            <p v-html="form_tips"></p>
                        </el-alert>
                    </div>
                </div>
            </div>
        </el-main>
        <el-aside class="wpf_editor_fields_wrapper" id="wpf_editor_fields_wrapper">
            <div class="wpf_editor_field_search">
                <el-input size="large"
                    class="wpf_inputs_new_ui"
                    @input="onSearch"
                    placeholder="Search (name, email..)"
                    v-model="search"
                    clearable
                >
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div @click="hideEditorFields()" class="wpf_expand_controller">
                    <span v-if="fieldsContract">
                        <i class="el-icon-arrow-left"></i>
                        <p>Expand</p>
                    </span>
                    <span  v-else>
                        <i class="el-icon-arrow-right"></i>
                        <p>Contract</p>
                    </span>

                </div>
            </div>
            <div class="wpf_scrollable_elem">
                <div v-for="(componentGroup,componentGroupIndex) in fieldGroups"
                    :key="componentGroupIndex"
                    class="wpf_field_group"
                    v-show="fieldGroups[componentGroupIndex].elements.length"
                    :class="isActiveGroup(componentGroupIndex)">
                    <div @click="toggleActiveGroup(componentGroupIndex)" class="field_group_header wpf_sticky_title" style="top: -5px;">
                        <img :src="assetsUrl(componentGroup.icon)" alt=""/> <span class="field_group_header_title">{{componentGroup.title}}</span>
                        <span v-if="isActiveGroup(componentGroupIndex)" class="field_group_icon_nav"><i class="el-icon-caret-top"></i></span>
                        <span v-else class="field_group_icon_nav"><i class="el-icon-caret-bottom"></i></span>
                    </div>
                    <div style="min-height: 50px" element-loading-spinner="el-icon-loading" v-loading="fetching" class="field_group_body">
                        <draggable v-model="fieldGroups[componentGroupIndex].elements"
                                class="dragArea"
                                :clone="cloneItem"
                                :options="{ draggable:'.item_active', group:{ name:'components',  pull:'clone', put:false }, sort: false }">
                            <el-button
                                v-for="(component,componentIndex) in componentGroup.elements"
                                :key="'item_'+componentIndex"
                                size="mini"
                                :data-item_name="component.type"
                                type="plain"
                                class="wpf_element_items"
                                :class="getItemClasses(component)"
                                @click="addComponent(component)"
                            >
                                <img :src="renderIcons(component)" width="32" alt="">
                                <span class="field_title">{{ component.editor_title }}</span>
                            </el-button>

                        </draggable>
                    </div>
                </div>
            </div>
        </el-aside>
    </el-container>
</template>

<script type="text/babel">
    import each from 'lodash/each'
    import findIndex from 'lodash/findIndex'
    import OldElementEditor from './editor/_OldElementEditor.vue';
    import draggable from 'vuedraggable'
    import SubmitButtonSettings from './editor/_SubmitButtonSettings';
    export default {
        name: 'form_builder',
        components: {
            OldElementEditor,
            draggable,
            SubmitButtonSettings
        },
        props: ['form_id'],
        data() {
            return {
                search: '',
                fieldsContract: false,
                allComponents: {},
                current_editing: '',
                builder_elements: [],
                fetching: false,
                components: {},
                adding_component: '',
                submit_button_settings: {},
                empty_form_image: window.wpPayFormsAdmin.assets_url + 'images/form_instruction.png',
                showNotice: true,
                validationErrors: false,
                collapsedGroups: {
                    payment: false,
                    payment_method: false,
                    general: false
                },
                disableStyle: "color:#c8ccc9;",
                activeStyle:"none",
                isVisible: false,
                campaignUrl: 'https://paymattic.com/',
                disabledMessage: 'This item is available on Pro version',
                campaignBtn: 'Upgrade to Pro Now',
                buttonText:  'Save'
            }
        },
        computed: {
            elementIds() {
                let elements = [];
                each(this.builder_elements, (element) => {
                    elements.push(element.id);
                });
               return elements;
            },
            hasPaymentMethodField() {
                let hasField = false;
                each(this.builder_elements, (element) => {
                    if (element.group == 'payment_method_element') {
                        hasField = true;
                        return true;
                    }
                });
                return hasField;
            },
            form_tips() {
                let hasPaymentField = false;
                let hasItemField = false;
                each(this.builder_elements, (element) => {
                    if (element.group == 'payment') {
                        hasPaymentField = true;
                    }
                    if (element.group == 'payment_method_element') {
                        hasItemField = true;
                    }
                });
                if (!hasPaymentField && hasItemField) {
                    return 'You have added payment method field, to accept payments add <b>Product Fields</b>';
                }
                if (hasPaymentField && !hasItemField) {
                    return 'You have added order item field, to accept payments add <b>Payment Method Field</b>';
                }
                if (this.builder_elements.length && !hasPaymentField && !hasItemField) {
                    return 'Add <b>Product Fields</b> and <b>Payment Method Field</b> to accept payment';
                }
                return false;
            },
            fieldGroups() {
                let componentGroups = {
                     general: {
                        title: 'General Fields',
                        icon: 'generals.svg',
                        elements: []
                    },
                    payment: {
                        title: 'Donation & Product Fields',
                        elements: [],
                        icon: 'products.svg'
                    },
                    payment_method: {
                        title: 'Payment Method Fields',
                        elements: [],
                        icon: 'payments.svg'
                    }
                }
                each(this.components, (component, componentName) => {
                    if (componentGroups[component.postion_group]) {
                        componentGroups[component.postion_group].elements.push(component);
                    }
                });
                return componentGroups;
            }
        },
        methods: {
            renderIcons(component) {
                let path = component.postion_group + '/' + component.type + '.svg'
                return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
            },
            assetsUrl(path) {
				return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
			},
            onSearch(str) {
                this.components = this.allComponents;
                let filtered = {};
                if (str.length) {
                     for (let item in this.components) {
                        let editorTitle = this.components[item].editor_title.toLowerCase();
                        if (editorTitle.indexOf(str.toLowerCase()) !== -1) {
                            filtered[item] = this.components[item];
                        }
                    }
                    this.components = filtered;
                }
            },
            isActiveGroup(index) {
                if(this.collapsedGroups[index]) {
                    return 'wpf_collapsed';
                }
                return false;
            },
            toggleActiveGroup(index) {
                this.collapsedGroups[index] = !this.collapsedGroups[index];
            },
            cloneItem(component) {
                if(component.disabled) {
                    this.handlePro(component);
                    return;
                }
                return this.getClonedItem(component);
            },
            getSettings() {
                this.fetching = true;
                // FormController@builderSettings
                this.$get(`form/${this.form_id}/editors`,{
                })
                    .then(response => {
                        this.builder_elements = response.builder_settings;
                        this.components = response.components;
                        this.allComponents = response.components;
                        this.submit_button_settings = response.form_button_settings;
                    })
                    .fail(error => {
                    })
                    .always(() => {
                        this.fetching = false;
                    })
            },
            addComponent(component, newIndex) {
                let componentName = component.type;
                if (!componentName) {
                    this.$message({
                        message: 'Please Select valid Component',
                        type: 'error'
                    });
                    return;
                }
                if(component.disabled) {
                   return this.handlePro(component);
                }
                if (component.migrate) {
                    return this.migrateTable(component);
                }
                // check if it's single only
                if (component.single_only && this.alreadyExistElement(component.group) || this.alreadyExistElement(component.editor_title)) {
                    this.$message({
                        message: 'Element already exists on your form. You can not add more of this type',
                        type: 'error'
                    });
                    return;
                }
                let nonMutableElement = this.getClonedItem(component);
                if (newIndex == undefined) {
                    this.builder_elements.push(nonMutableElement);
                } else {
                    this.builder_elements.splice(newIndex, 0, nonMutableElement);
                }
                this.current_editing = nonMutableElement.id;
                this.adding_component = '';
            },
            handlePro(component) {
                this.isVisible = true;
                if(component.disabled_message) {
                    this.disabledMessage = component.disabled_message;
                }
                return false;
            },
            migrateTable(component) {
                this.isVisible = true;
                this.disabledMessage = component.migrate_message;
                this.campaignBtn = component.btnText;
                this.campaignUrl = component.url;
                return false;
            },
            getClonedItem(component) {
                let componentName = component.type;
                let nonMutableElement = JSON.parse(JSON.stringify(component));
                // Find an unique name for this element
                nonMutableElement.id = this.getComponentUID(componentName);
                if (!nonMutableElement.field_options) {
                    nonMutableElement.field_options = {};
                }
                return nonMutableElement;
            },
            alreadyExistElement(type) {
                let status = false;
                each(this.builder_elements, (element) => {
                    if (element.group == type || element.editor_title == type && type === 'Coupon') {
                        status = true;
                    }
                });
                return status;
            },
            getComponentUID(componentName) {
                let counter = 1;
                let originalName = JSON.parse(JSON.stringify(componentName));
                while (this.elementIds.indexOf(componentName) != -1) {
                    componentName = originalName + '_' + counter;
                    counter = counter + 1;
                }
                return componentName;
            },
            saveSettings() {
                this.saving = true;
                this.validationErrors = false;
                this.buttonText = 'Updating...';
                if (!this.form_tips) {
                    this.deleteStoreData('hide_form_' + this.form_id);
                }
                // FormController@store
                this.$post(`form/${this.form_id}`, {
                    builder_settings: JSON.stringify(this.builder_elements),
                    submit_button_settings: this.submit_button_settings,
                })
                    .then(response => {
                        this.$notify.success({
                            title: 'Success!',
                            offset: 30,
                            message: response.message,
                            position: 'bottom-right',
                        });
                    })
                    .fail(error => {;
                        this.$notify.error({
                            title: 'Oops!',
                            offset: 30,
                            message: error?.responseJSON?.data?.message,
                            position: 'bottom-right',
                        });
                        if (error.responseJSON.data.errors) {
                            this.validationErrors = error.responseJSON.data.errors;
                            jQuery([document.documentElement, document.body]).animate({
                                scrollTop: jQuery('#payform_builder').offset().top - 100
                            }, 200);
                        }
                    })
                    .always(() => {
                        this.saving = false;
                        this.buttonText = 'Save';
                    })
            },
            toggleEditing(elementId) {
                if (this.current_editing == elementId) {
                    this.current_editing = '';
                } else {
                    this.current_editing = elementId;
                }
            },
            deleteItem(element) {
                this.builder_elements.splice(findIndex(this.builder_elements, element), 1);
            },
            getItemClasses(component) {
                let isActive = '';
                if (!this.hasPaymentMethodField || component.group != 'payment_method_element') {
                    isActive = ' item_active';
                }
                let availClass = 'wpf_item_' + component.group + isActive;
                if (component.disabled) {
                    availClass += ' require-pro'
                }
                return availClass;
            },
            hideNotices() {
                this.setStoreData('hide_form_' + this.form_id, 'yes');
            },
            hideEditorFields() {
                this.fieldsContract = !this.fieldsContract;
                jQuery('#wpf_editor_fields_wrapper').toggleClass('wpf_editor_hide');
            },
        },
        mounted() {
            this.getSettings();
            this.showNotice = this.getFromStore('hide_form_' + this.form_id) != 'yes';
            window.WPPayFormsBus.$emit('site_title', 'Form Builder');
        }
    }
</script>

<style lang="scss" scoped>
    .wpf_sticky_title {
        position: sticky;
        background: white;
        z-index: 20;
    }
    // comment thoose code for donation template add more filed issue
    // .wpf_form_builder {
    //     height: calc(100vh - 150px);
    //     overflow-y: scroll;
    //     &::-webkit-scrollbar {
    //         display: none;
    //     }
    // }
    .wpf_scrollable_elem {
        height: calc(100vh - 236px);
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
    }
    .flip-list-move {
        transition: transform 0.5s;
    }
    .no-move {
        transition: transform 0s;
    }
    .field_group_body {
        .require-pro {
            color: #409EFF;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
            text-align: center !important;
            &:hover {
                background: #f56c6b;
                color: white;
            }
            img {
                display: none;
            }
        }
    }
    .ghost {
        opacity: 0.2;
        background: gray;
        color: white;
        width: 100%;
        padding: 15px;
        display: block;
        overflow: hidden;
    }
    .wpf_editor_fields_wrapper {
        transition: all .2s cubic-bezier(0.46, 0.03, 0.52, 0.96);
        transition-duration: 1s;
        width: 430px !important;
        background: white;
        margin-left: 14px;
        .wpf_editor_field_search {
            border-top: 1px solid #e3e8ed;
            border-left: 1px solid #e3e8ed;
            border-right: 1px solid #e3e8ed;
            padding:12px;
            input {
                background: #E8EDF4;
                height: 46px;
                width: 96%;
                margin-left: 14px;
                i {
                    font-weight: bold;
                }
            }
        }
    }
    .wpf_form_builder {
        .editor_is_active {
            color: #5A9CF8;
        }
    }
    .wpf_field_group.wpf_collapsed
    {
        .field_group_header_title, i {
            color: #6B7384;
        }
        img {
            filter: grayscale(100%);
        }
    }
    .builder_wrap {
        margin: 0px auto !important;
        padding: 30px !important;
        border-bottom: 1px solid #ddd;
    }
</style>