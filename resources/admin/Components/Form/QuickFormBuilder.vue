<template>
    <div>
        <NewIndex />
    <el-container>
        <el-main class="wpf_form_builder wpf_bg_white_shadow">
            <el-dialog title="Premium features" :visible.sync="isVisible" width="50%">
                <div style="text-align: center;">
                    <div style="min-height: 50px" element-loading-spinner="el-icon-loading" v-loading="fetching"
                        class="field_group_body dragArea">
                        <el-button v-for="(component, componentIndex) in disabledMessage"
                            :key="'item_' + componentIndex" size="medium" :data-item_name="component.editor_title"
                            type="plain"
                            v-bind:style="{ 'margin-bottom': '10px', 'margin-left': '1px', 'opacity': '0.5' }"
                            class="wpf_element_items wpf_item_payment item_active">
                            <img :src="renderIcons(component)" width="32" alt="">
                            <span class="field_title">{{ component.editor_title }}</span>
                        </el-button>
                    </div>
                    <div class="payform_upgrade_section">
                        <h4>Customized your form with pro version</h4>
                        <a target="_blank" :href="pro_purchase_url"
                            class="el-button el-button--medium el-button--danger">Upgrade To Pro version</a>
                    </div>
                </div>
            </el-dialog>
            <div style="width:78%; padding: 10%; padding-top: 0%; margin: 0 auto;">
                <div class="edit_form_warpper" style="padding: 10px">
                    <div class="all_payforms_wrapper payform_section">
                        <FormTitle
                                @edit-form="editForm"
                                @form-title-modal-toggle="editFormModalShow = !editFormModalShow"
                                :form="form"
                                :editFormModalShow="editFormModalShow"
                                style="margin: 0"
                            />
                        <div class="payform_section_header" style="top:-17px;">
                            <el-tooltip effect="dark" content="Click to copy shortcode" title="Click to copy shortcode"
                                placement="top">
                                <code class="copy" style="padding: 4px;"
                                    :data-clipboard-text='`[wppayform id="${form.ID}"]`'>
                                    [wppayform id="{{ form.ID }}"] <i class="el-icon-document"></i>
                                </code>
                            </el-tooltip>
                            <div class="payform_section_actions">
                                <el-badge :is-dot="hasChange ? true : false" class="badge-color">
                                    <el-button
                                        @click="saveSettings()"
                                        class="payform_action wpf_new_ui_button" size="small"
                                        type="primary"
                                        style="min-width: 120px"
                                    >
                                        {{ $t('Save') }}
                                    </el-button>
                                </el-badge>
                            </div>
                        </div>
                        <div v-if="validationErrors" class="validation_errors_block">
                            <el-alert v-for="(error, error_key) in validationErrors" :key="error_key" type="error" show-icon>
                                {{ error }}
                            </el-alert>
                        </div>
                        <QuickFormComponents v-loading="fetching" @deleteComponent="deleteComponent(element)"
                            @updateItem="saveSettings" :allComponents="allComponents"  :all_elements="builder_elements" />
                    </div>
                </div>
                <el-dialog
                    :visible.sync="outerVisible"
                    width="320px"
                    :show-close="false"
                >
                    <div style="text-align:center">
                        <i style="font-size: 96px; color: #FF7518" class="el-icon-warning-outline"></i>
                        <h3>{{ $t('Leave page') }} ?</h3>
                        <span>{{ $t('Changes that you made may not be saved') }}</span>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="medium" @click="outerVisible = false">Cancel</el-button>
                        <el-button @click="leaveRoute()" type="info" size="medium">Leave</el-button>
                    </div>
                </el-dialog>
                <!-- <div style="position:relative; width:30%; padding: 10px; border-left: 2px solid #E9EEF3" class="wppayform_editor">
                    <h1 class="payform_section_title">
                        {{ $t('Form settings and preview') }}
                    </h1>
                    <div class="settings_header">
                        <div class="settings_left">
                            <el-tooltip effect="dark" content="Click to copy shortcode" title="Click to copy shortcode"
                                placement="top">
                                <code class="copy" style="padding: 4px;"
                                    :data-clipboard-text='`[wppayform id="${form.ID}"]`'>
                                [wppayform id="{{ form.ID }}"] <i class="el-icon-document"></i>
                            </code>
                            </el-tooltip>
                        </div>
                        <div class="settings_right" style="margin-bottom: 10px">
                            <a :href="form.preview_url" target="_blank">
                                <el-button style="background: #fff; color: black;" size="mini">{{ $t('Preview') }}
                                </el-button>
                            </a>
                            <a @click.prevent="gotoAllForms()"
                                class="el-button payform_action el-button--mini el-button--info">
                                All Forms
                            </a>
                            <a v-if="!has_pro" target="_blank"
                                class="el-button payform_action el-button--danger el-button--mini"
                                :href="pro_purchase_url">
                                Upgrade To Pro
                            </a>
                        </div>
                    </div>
                    <div>
                        <el-button @click="saveSettings()" class="payform_action" size="small" type="primary">
                            {{ $t('Update Form') }}
                        </el-button>
                        <el-input style="font-size: 16px; font-weight: 600; margin-top: 20px"
                            placeholder="Enter form title" v-model="form.post_title"></el-input>
                    </div>
                    <div style="bottom:0; left: 1;position:absolute;">
                    <el-popover
                        placement="top"
                        width="190"
                        padding="10"
                        v-model="visible"
                    >
                        <p>Do you want to more settings?</p>
                        <div style="text-align: right; margin: 0">
                            <router-link class="el-button el-link el-button--default" :to="{ name: 'edit_form', params: { form_id } }">
                                {{ $t('Edit') }}
                            </router-link>
                        </div>
                        <p style="cursor: pointer; color: #02C103" slot="reference">Advanced settings</p>
                    </el-popover>
                    </div>
                </div> -->
            </div>
        </el-main>
    </el-container>
    </div>
</template>

<script type="text/babel">
import each from 'lodash/each'
import findIndex from 'lodash/findIndex'
import FormTitle from './FormTitle.vue';
import ElementEditor from './editor/_ElementEditor.vue';
import draggable from 'vuedraggable'
import NewIndex from './NewIndex.vue'
import SubmitButtonSettings from './editor/_SubmitButtonSettings.vue';
import QuickFormComponents from './QuickFormEditor/QuickFormComponents.vue';

export default {
    name: 'quick_form_builder',
    components: {
        ElementEditor,
        draggable,
        SubmitButtonSettings,
        QuickFormComponents,
        FormTitle,
        NewIndex
    },
    // props: ['form_id'],
    data() {
        return {
            search: '',
            visible: false,
            form_title: '',
            firstLoad: 0,
            outerVisible: false,
            hasChange: false,
            fieldsContract: false,
            allComponents: {},
            current_editing: '',
            builder_elements: [],
            form_id: this.$route.params.form_id,
            form: {},
            editFormModalShow: false,
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
            activeStyle: "none",
            isVisible: false,
            campaignUrl: 'https://paymattic.com/',
            disabledMessage: 'This item is available on Pro version',
            campaignBtn: 'Upgrade to Pro Now',
            redirectRouteName:'',
            firstLoadForm: true
        }
    },
    watch: {
        builder_elements: {
            handler() {
                this.firstLoad = this.firstLoad + 1;
                if (this.firstLoad > 2) {
                    this.hasChange = true;
                }
            },
            deep: true
        },
        form: {
            handler() {
                this.firstLoadForm ? this.firstLoadForm = false : this.hasChange = true;
            },
            deep: true
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
        leaveRoute() {
            this.outerVisible = false;
            this.hasChange = false;
            this.$router.push({ name: this.redirectRouteName });
        },
        getForm() {
            this.fetching = true;
            // FormController@getForm
            this.$get(`form/${this.form_id}`, {
            })
                .then(response => {
                    this.form = response;
                })
                .fail(error => {

                })
                .always(() => {
                    this.fetching = false;
                })
        },
        editForm() {
            // validate first
            if (!this.form.post_title) {
                this.$message.error('Please provide form title');
                return;
            }
            this.saving = true;
            // FormController@update
            this.$put(`form/${this.form.ID}`, {
                post_title: this.form.post_title,
                post_content: this.form.post_content,
                show_title_description: this.form.show_title_description
            })
                .then(response => {
                    this.$notify.success({
                        title: 'Success',
                        offset: 30,
                        message: response.message,
                        position: 'bottom-right'
                    });
                    this.editFormModalShow = false;
                    this.hasChange = false;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON.data.message,
                        position: 'bottom-right',
                    })
                })
                .always(() => {
                    this.saving = false;
                });
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
            if (this.collapsedGroups[index]) {
                return 'wpf_collapsed';
            }
            return false;
        },
        toggleActiveGroup(index) {
            this.collapsedGroups[index] = !this.collapsedGroups[index];
        },
        cloneItem(component) {
            if (component.disabled) {
                this.handlePro(component);
                return;
            }
            return this.getClonedItem(component);
        },
        getSettings() {
            this.fetching = true;
            // FormController@builderSettings
            this.$get(`form/${this.form_id}/editors`, {
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

            if (component.disabled) {
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
            if (component.disabled_message) {
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
            if (!this.form_tips) {
                this.deleteStoreData('hide_form_' + this.form_id);
            }
            let validDonation = this.maybecheckForDonationGoals(this.builder_elements);
            if (!validDonation) {
                this.$notify.info({
                    title: "Oops!",
                    offset: 30,
                    message: 'Please set valid donation goals to show progress bar or statistic',
                    position: 'bottom-right'
                });
                return;
            }

            // FormController@store
            this.$post(`form/${this.form_id}`, {
                builder_settings: JSON.stringify(this.builder_elements),
                submit_button_settings: this.submit_button_settings,
            })
                .then(response => {
                    this.$notify({
                        title: 'Success',
                        offset: 30,
                        message: response.message,
                        type: 'success',
                        position: 'bottom-right'
                    });
                    this.hasChange = false;
                })
                .fail(error => {
                    this.$notify.error({
                        title: "Oops!",
                        offset: 30,
                        message: error?.responseJSON?.data?.message,
                        position: 'bottom-right'
                    });
                    if (error.responseJSON.data.errors) {
                        this.validationErrors = error?.responseJSON?.data?.errors;
                        jQuery([document.documentElement, document.body]).animate({
                            scrollTop: jQuery('#payform_builder').offset().top - 100
                        }, 200);
                    }
                })
                .always(() => {
                    this.saving = false;
                })
        },
        maybecheckForDonationGoals(builder_elements){
            if (builder_elements.length > 0){
                let donation_goals = builder_elements[0].field_options.pricing_details.donation_goals;
                if (builder_elements[0].editor_title == 'Donation Progress Item'){
                    if (builder_elements[0].type == 'donation_item'){
                        if ('yes' === builder_elements[0].field_options.pricing_details.progress_bar || 'yes' === builder_elements[0].field_options.pricing_details.show_statistic){
                            if (undefined != donation_goals && donation_goals > 0 && typeof(donation_goals) == 'number'){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        },
        toggleEditing(elementId) {
            if (this.current_editing == elementId) {
                this.current_editing = '';
            } else {
                this.current_editing = elementId;
            }
        },
        deleteComponent(element) {
            // this.builder_elements.splice(findIndex(this.builder_elements, element), 1);
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
    beforeRouteLeave(to, from, next) {
        this.redirectRouteName = to.name;
        this.hasChange ? this.outerVisible = true : next();
    },
    mounted() {
        this.getForm();
        this.getSettings();
        this.showNotice = this.getFromStore('hide_form_' + this.form_id) != 'yes';
        window.WPPayFormsBus.$emit('site_title', 'Form Builder');
        window.onbeforeunload = () => {
            if (this.hasChange) {
                return "Data will be lost if you leave the page, are you sure?";
            }
        };
    }
}
</script>

<style lang="scss" scoped>
.wpf_sticky_title {
    position: sticky;
    z-index: 20;
}
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
        color: #F57372;
        border-color: #FFB380;
        background-color: #F8F8F8;
        text-align: center!important;
        font-weight: 500;
        font-size: 14px;
        &:hover {
            background: #f56c6b !important;
            color: white !important;
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
    background: white;
    margin-left: 14px;

    .wpf_editor_field_search {
        border-top: 1px solid #e3e8ed;
        border-left: 1px solid #e3e8ed;
        border-right: 1px solid #e3e8ed;
        padding: 12px;

        input {
            background: #E8EDF4;
            height: 46px;
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

.wpf_field_group.wpf_collapsed {

    .field_group_header_title,
    i {
        color: #6B7384;
    }

    img {
        filter: grayscale(100%);
    }
}
.wpf_bg_white_shadow::-webkit-scrollbar {
  display: none;
}
.wpf_form_menu {
    padding-left: 12%;
}
</style>