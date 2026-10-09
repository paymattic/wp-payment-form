<template>
    <el-container>
        <el-main class="wpf_form_builder wpf_bg_white_shadow wpf-form-editor-wrapper">
            <!-- Pro require alert -->
            <ProUpgradeModal v-if="!migrate" :isVisible="isVisible" :disabledMessage="disabledMessage"
                :fetching="fetching" @close-pro-modal="closeProModal" />
            <!-- Temporary solution for upcoming release, will make el-dialog reusable component in future -->
            <el-dialog v-if="migrate" :title="disabledMessage" :visible.sync="isVisible" width="50%">
                <div style="text-align: center;">
                    <div class="payform_upgrade_section">
                        <a style="background-color: #67C23A; border-color: #67C23A;" :href="campaignUrl"
                            class="el-button el-button--medium el-button--danger">{{ campaignBtn }}
                        </a>
                    </div>
                </div>
            </el-dialog>
            <!-- Editor wrapper start -->
            <div class="edit_form_warpper" style="margin-top: 20px;">
                <div class="all_payforms_wrapper payform_section">
                    <!-- Undo redo button  -->
                    <div class="payform_section_header wpf_sticky_title" style="padding: 0px; background: inherit;">
                        <div class="payform_section_actions">
                            <div style="float: right; display: none">
                                <el-button @click="undo()" :disabled="!canUndo" size="medium">Undo</el-button>
                                <el-button @click="redo()" :disabled="!canRedo" size="medium">Redo</el-button>
                            </div>
                        </div>
                    </div>

                    <!-- Builder section -->
                    <div v-loading="fetching" style="min-height: 200px" element-loading-background="rgb(255, 255, 255)"
                        element-loading-text="Loading Builder..." id="payform_builder" class="payform_section_body">
                        <!-- Validation error start -->
                        <div v-if="validationErrors" class="validation_errors_block"
                            style="max-width: 800px; margin: 0 auto;">
                            <el-alert v-for="(error, error_key) in validationErrors" :key="error_key" type="error" show-icon>
                                {{ error }}
                            </el-alert>
                        </div>

                        <!-- Form component wrappers -->
                        <div class="payform_builder_items">
                            <!-- Table title saction -->
                            <FormTitle @edit-form="editForm"
                                @form-title-modal-toggle="editFormModalShow = !editFormModalShow" :form="form"
                                :editFormModalShow="editFormModalShow" :hasStepForm="hasStepForm()" />
                            <!-- Step form header -->
                            <div :class="getStepLength(step_forms) > 4 ? 'payform_step_form_header justify-start' : 'payform_step_form_header'"
                                v-if="step_forms">
                                <div class="el-steps el-steps--horizontal" style="padding-bottom: 0"
                                    v-if="hasStepForm()">
                                    <div v-for="(step, stepIndex) in getSteps(step_forms)" class="el-step is-horizontal"
                                        :key="stepIndex">
                                        <div @click="active = stepIndex"
                                            :class="`el-step__head ${getHeadClass(stepIndex)}`">
                                            <div class="el-step__line">
                                                <i class="el-step__line-inner"></i>

                                            </div>
                                            <div class="el-step__icon is-text">
                                                <div class="el-step__icon-inner">{{ stepIndex + 1 }}</div>
                                            </div>
                                        </div>
                                        <div class="el-step__main">
                                            <div :class="`el-step__title ${getHeadClass(stepIndex)}`">
                                                <LabelEditor :wrapperClass="'step-form-label'" :editLabel="''"
                                                    style="margin-right: 4px; border: none; font-size: 16px;"
                                                    v-model="step.title" :nullable="true" />
                                            </div>
                                            <!-- <div :class="`el-step__description ${getHeadClass(stepIndex)} `">
                                                <LabelEditor :placeholder="'Description'" style="margin-right: 4px; border: none;"
                                                    v-model="step.description" :nullable="true" />
                                            </div> -->
                                        </div>
                                    </div>
                                    <div class="add_step" v-if="Object.keys(step_forms).length != 0">
                                        <i class="el-icon-plus"
                                            @click="chooseMethodForStep('add_step', step_forms['editor_elements']['form_steps'])" />
                                    </div>
                                </div>
                                <!-- <div class="add_step" v-if="Object.keys(step_forms).length != 0"> 
                                    <i class="el-icon-plus" @click="chooseMethodForStep('add_step', step_forms['editor_elements']['form_steps'])"/>
                                </div> -->
                                <!-- <el-steps :active="active" finish-status="success">
                                        <el-step v-for="(step, stepIndex) in getSteps(step_forms)" :title="step.title" :key="stepIndex">
                                        </el-step>
                                    </el-steps> -->
                            </div>
                            <!-- Step form header end -->
                            <draggable
                                :options="{ handle: '.handler', animation: 0, ghostClass: 'ghost' }"
                                :list="builder_elements" :element="'div'" :move="onMove"
                                :group="{ name: 'nested', put: true }"
                            >
                                <!-- Form render component -->
                                <template v-if="builder_elements.length" style="height:100%">
                                    <!-- Start single form component rendering -->
                                    <div v-for="(element, index) in builder_elements" :key="element.id"
                                        class="payform_builder_item" v-if="active === element.active_page">
                                        <!-- {{ currencySettings }} -->
                                        <FormFieldWrapper
                                            :element="element"
                                            @componentModalShow="componentModalShow"
                                            :builder_elements="builder_elements"
                                            :elementIndex="index"
                                            :currencySettings="currencySettings"
                                            @updateSettings="saveSettings"
                                            :emit_response="emit_response"
                                        />
                                    </div>
                                    <!-- End single form component rendering -->
                                </template>
                                <div>
                                    <div class="payform_builder_item slash">
                                        <div class="payform_inline_item" style="display: flex">
                                            <div style="padding: 16px 10px;"
                                                :class="hasStepForm() ? 'component-section step-form-component' : 'component-section'">
                                                <input @keyup.enter="addTextField" @blur="clickOutside()" size="large"
                                                    class="wpf_inputs_new_search" @input="onSearchItem"
                                                    placeholder="Type '/' to insert fields" v-model="search"
                                                    clearable />
                                            </div>
                                        </div>
                                        <!-- :style="{ 'margin-left': hasStepForm() ? '180px !important' : '140px !important', display: componentsDisplay }"> -->
                                        <el-aside class="wpf_editor_fields_wrapper"
                                            :style="{ display: componentsDisplay, width: '100%' }">
                                            <SearchFormComponent :search="search" ref="searchModal" :fetching="fetching"
                                                :toggleActiveGroup="toggleActiveGroup" :isActiveGroup="isActiveGroup"
                                                :getItemClasses="getItemClasses" :addComponent="addComponent"
                                                :hideEditorFields="hideEditorFields" :fieldsContract="fieldsContract"
                                                :assetsUrl="assetsUrl" :renderIcons="renderIcons" :cloneItem="cloneItem"
                                                :hideSearchBar="true" :componentsProp="components" />
                                        </el-aside>
                                    </div>
                                </div>
                            </draggable>
                            <div v-if="builder_elements.length"
                                class="payform_submit_button_settings payform_builder_item payform_inline_item"
                                style="display: flex;">
                                <div style="width: 100%;" v-if="checkHasStepFormAndRenderButton()">
                                    <div :class="hasStepForm() ? 'component-section step-form-component' : 'component-section'"
                                        style="border-radius: 5px; margin-bottom: 10px; position: relative;">
                                        <el-button v-if="!buttonSettings" @click="buttonSettings = true"
                                            :type="submit_button_settings.button_style"
                                            slot="reference" class="submit-btn"
                                            :style="{ width: submit_button_settings.button_style === 'wpf_full_block_btn' ? '100%' : 'auto' }">
                                            {{ submit_button_settings.button_text }}</el-button>
                                        <div class="button_settings_wrapper">
                                            <button @click="buttonSettingModal = true" class="button_settings">
                                                <i class="el-icon-setting"></i>
                                            </button>
                                        </div>
                                        <div v-if="buttonSettings">
                                            <input @blur="buttonSettings = false" @change="saveSettings"
                                                v-model="submit_button_settings.button_text"
                                                class="wpf_inputs_new_search" style="display: block; width: 100%;" />
                                            <label> {{ $t('Use Shortcode {payment_total} to show payment total amount')}}</label>
                                        </div>
                                        <el-dialog title="Submit Button Settings" :visible.sync="buttonSettingModal"
                                            width="50%">
                                            <transition name="slide-down">
                                                <submit-button-settings @updateSettings="saveSettings"
                                                    :submit_button="submit_button_settings" />
                                            </transition>
                                            <span slot="footer" class="dialog-footer"><span></span></span>
                                        </el-dialog>
                                    </div>
                                </div>
                            </div>

                            <!-- Step Forms Button  -->
                            <div class="payform_builder_item">
                                <div v-if="Object.keys(step_forms).length > 0"
                                    style="position: relative; margin-bottom: 10px;">
                                    <el-popover ref="popover" placement="top" width="270" v-model="stetDeleteModalShow">
                                        <p>The selected step will be removed! And respective fields will be reorganized in
                                            chronological order.</p>
                                        <el-checkbox style="margin-bottom: 10px" v-model="is_delete_step_item">Also delete
                                            the step fields</el-checkbox>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="medium" type="text" @click="stetDeleteModalShow = false">{{
                                                $t('cancel') }}</el-button>

                                            <el-button type="link" size="medium" @click="deleteStep()">{{ $t('confirm')
                                            }}</el-button>
                                        </div>
                                    </el-popover>
                                    <el-button size="small"
                                        v-for="(btn_setting, btn_ind) in getStepFormButtonSettings(step_forms)"
                                        :class="getButtonClass(btn_setting.method)"
                                        
                                        @click="chooseMethodForStep(btn_setting['method'], step_forms['editor_elements']['form_steps'])"
                                        :disabled="checkIsStepButtonEnable(btn_ind, step_forms['editor_elements']['form_steps'])"
                                        :type="btn_setting.type" :key="btn_ind">
                                        <el-tooltip :content="getTooltipText(btn_setting.icon)" placement="top" effect="dark">
                                            <template #default>
                                            <i :class="btn_setting.icon"></i>
                                            </template>
                                        </el-tooltip>
                                        <el-tooltip :content="'Edit the button label here'" placement="top" effect="dark">
                                            <template #default>
                                            <LabelEditor
                                                v-model="btn_setting.text"
                                                :nullable="false"
                                                :placeholder="btn_setting.text || 'Edit Button Label'"
                                            />
                                            </template>
                                        </el-tooltip>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                         
                        <!-- Form component wrappers end -->

                        <el-alert v-if="form_tips && showNotice" class="payform_builder_notices" @close="hideNotices"
                            type="warning" show-icon>
                            <p v-html="form_tips"></p>
                        </el-alert>
                        <div style="position: relative; padding: 20px">
                            <div @click="addComponentsModal" class="add-component-btn">
                                <Icon icon="wpf-plus" />
                            </div>
                        </div>
                        <el-dialog title="Choose form field" :visible.sync="addComponentVisible" width="50%"
                            :before-close="handleClose">
                            <SearchFormComponent :search="search" :fetching="fetching"
                                :toggleActiveGroup="toggleActiveGroup" :isActiveGroup="isActiveGroup"
                                :getItemClasses="getItemClasses" :addComponent="addComponent"
                                :hideEditorFields="hideEditorFields" :fieldsContract="fieldsContract"
                                :assetsUrl="assetsUrl" :renderIcons="renderIcons" :cloneItem="cloneItem"
                                :hideSearchBar="false" :allComponents="allComponents" :componentsProp="components" />
                            <span slot="footer" class="dialog-footer"><span></span></span>
                        </el-dialog>
                        <el-dialog :visible.sync="outerVisible" width="320px" :show-close="false">
                            <div style="text-align:center">
                                <i style="font-size: 96px; color: #FF7518" class="el-icon-warning-outline"></i>
                                <h3>{{ $t('Leave page') }} ?</h3>
                                <span>{{ $t('Changes that you made may not be saved') }}</span>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button size="medium" @click="cancelPageLeave">{{ $t('Cancel')}}</el-button>
                                <el-button @click="leaveRoute()" type="info" size="medium">{{ $t('Leave')}}</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script type="text/babel">
import FormFieldWrapper from './editor/FormFieldWrapper.vue';
import each from 'lodash/each'
import Icon from '../Icons/Index.vue'
import findIndex from 'lodash/findIndex'
import ElementEditor from './editor/_ElementEditor';
import RenderComponent from './editor/RenderComponent';
import draggable from 'vuedraggable'
import WpEditor from '../Common/_wp_editor';
import SubmitButtonSettings from './editor/_SubmitButtonSettings';
import SearchFormComponent from './SearchFormComponent.vue';
import PhotoWidget from './editor/Widget/PhotoWidget/_photo_widget.vue';
import LabelEditor from './editor/Widget/LabelEditor.vue';
import FormTitle from './FormTitle.vue';
import ProUpgradeModal from './ProUpgradeModal.vue';
import { formTipsMethod, hasPaymentField, textComponentData, preparedAllComponents } from './editor/editorHelper.js';
import ElModal from '../Common/Modal.vue';

export default {
    name: 'form_builder',
    components: {
        ElementEditor,
        draggable,
        SubmitButtonSettings,
        RenderComponent,
        FormFieldWrapper,
        WpEditor,
        SearchFormComponent,
        PhotoWidget,
        LabelEditor,
        FormTitle,
        ProUpgradeModal,
        Icon,
        ElModal,
    },
    props: ['form_id'],
    data() {
        return {
            is_delete_step_item: false,
            history: [],
            stetDeleteModalShow: false,
            active: 0,
            historyIndex: 0,
            hasChange: false,
            firstLoad: true,
            firstLoadForm: true,
            redirectRouteName: '',
            outerVisible: false,
            currentIndex: 0,
            //! containerIndex  define for add field in container
            containerIndex: null,
            buttonSettingModal: false,
            buttonSettings: false,
            addComponentVisible: false,
            componentsDisplay: 'none',
            editFormModalShow: false,
            search: '',
            form: {},
            fieldsContract: false,
            allComponents: {},
            current_editing: '',
            builder_elements: [],
            fetching: false,
            components: {},
            submit_button_settings: {},
            showNotice: true,
            validationErrors: false,
            collapsedGroups: {
                payment: false,
                payment_method: false,
                general: false
            },
            isVisible: false,
            disabledMessage: 'This item is available on Pro version',
            settings_modal_visable: false,
            buttonText: 'Save',
            campaignUrl: 'https://paymattic.com/',
            campaignBtn: 'Upgrade to Pro Now',
            migrate: false,
            step_forms: {},
            currencySettings: {},
            has_pro: window.wpPayFormsAdmin?.has_pro,
            title: 'Form field settings',
            emit_response: false
        }
    },
    watch: {
        builder_elements: {
            handler() {
                if (this.firstLoad || this.settings_modal_visable) {
                    this.firstLoad = false
                } else {
                    this.hasChange = true;
                    this.$emit('get-some-data');
                }
            },
            deep: true
        },
        form: {
            handler() {
                this.firstLoadForm ? this.firstLoadForm = false : this.hasChange = true;
                this.$emit('get-some-data');
            },
            deep: true
        }
    },
    computed: {
        canUndo() {
            this.$emit('undo-redo-toggole');
            return this.historyIndex > 0
        },
        canRedo() {
            this.$emit('undo-redo-toggole');
            return this.history.length - 1 - this.historyIndex > 0
        },
        elementIds() {
            let elements = [];
            each(this.builder_elements, (element) => {
                if(element.type == "container") {
                    each(element?.field_options?.columns, (column) => {
                        each(column?.fields, (field) => {
                            elements.push(field.id);
                        })
                    })
                }
                elements.push(element.id);
            });

            return elements;
        },
        hasPaymentMethodField() {
            return hasPaymentField(this.builder_elements);
        },
        form_tips() {
            return formTipsMethod(this.builder_elements);
        }
    },
    beforeRouteLeave(to, from, next) {
        this.redirectRouteName = to.name;
        this.hasChange ? this.outerVisible = true : next();
    },
    methods: {
        getTooltipText(text) {
            if(text === 'el-icon-back') {
                return this.$t('Click to Back');
            }
            if(text === 'el-icon-right') {
                return this.$t('Click to Forward');
            }
        },
        getButtonClass(method) {
            if (method === 'del_step') {
                return 'float_right';
            }
            if(method === 'next') {
                return 'wpf_next';
            }
            if(method === 'prev') {
                return 'wpf_prev';
            }
        },
        getLeftValue() {
            if (this.hasStepForm()) {
                return {
                    "margin-left": "114px",
                }
            } else {
                return {
                    "left": "88px",
                }
            }
        },
        getSteps(steps) {
            return steps?.editor_elements?.form_steps;
        },
        getStepTitle(step, index) {
            return step?.title || 'Step ' + (index + 1);
        },
        getStepLength(steps) {
            return steps?.editor_elements?.form_steps?.length;
        },
        checkHasStepFormAndRenderButton() {
            if (this.hasStepForm()) {
                return this.active + 1 === this.step_forms['editor_elements']['form_steps']?.length
            }
            return true;
        },
        getHeadClass(stepIndex) {
            if (stepIndex === this.active) {
                return 'is-process';
            } else if (stepIndex < this.active) {
                return 'is-success';
            }
            return 'is-wait';
        },
        getStepFormButtonSettings(steps) {
            return steps?.editor_elements?.settings;
        },
        addComponentsModal() {
            this.addComponentVisible = true;
            // Emit an event to focus the search input
            this.$nextTick(() => {
                this.$root.$emit('modal-opened');
            });
        },
        next() {
            this.active = this.active + 1;
        },
        prev() {
            if (this.active > 0) this.active = this.active - 1;
        },
        checkIsStepButtonEnable(index, steps) {
            if (index === 'prev_btn' && this.active > 0) {
                return false;
            } else if (index === 'next_btn' && this.active < steps.length - 1) {
                return false;
            } else if (index === 'add_step' || index === 'del_step') {
                return false;
            }
            return true;
        },
        deleteStep() {
            let steps = this.step_forms?.editor_elements?.form_steps;
            if (steps?.length > 2) {
                steps.splice(this.active, 1);
                if (this.is_delete_step_item) {
                    this.builder_elements = this.builder_elements?.filter(data => data?.active_page !== this.active);
                    this.is_delete_step_item = false;
                }
                this.builder_elements?.map(item => {
                    if (item?.active_page >= this.active) {
                        item.active_page = this.active > 0 ? item.active_page - 1 : item.active_page;
                    }
                })
                this.active = this.active > 0 ? this.active - 1 : this.active;
            } else {
                let newBuilder = this.builder_elements?.filter(item => item?.type !== "step_form");
                this.builder_elements?.map((item, index) => {
                    item.active_page = 0;
                })
                this.builder_elements = newBuilder;
                this.step_forms = {};
                this.active = 0;
            }
            this.stetDeleteModalShow = false;
        },
        chooseMethodForStep(step, steps) {
            if (step === 'next') {
                this.next();
            } else if (step === 'prev') {
                this.prev();
            } else if (step === 'add_step') {
                steps.push({
                    title: 'Step ' + (steps.length + 1),
                    description: '',
                    fields: []
                });
            } else if (step === 'del_step') {
                this.stetDeleteModalShow = true;
            }
        },
        undoRedoToggole() {
            return {
                canUndo: this.historyIndex > 0,
                canRedo: this.history.length - 1 - this.historyIndex > 0
            }
        },
        getSomeData() {
            const data = {
                hasChange: this.hasChange,
                buttonText: this.buttonText,
                canUndo: this.historyIndex > 0,
                canRedo: this.history.length - 1 - this.historyIndex > 0,
            }
            return data;
        },
        cancelPageLeave() {
            this.outerVisible = false;
            let current_route = this.$route.name;
            let next_route = this.redirectRouteName;
            jQuery('li[ route_name=' + current_route + ' ]').addClass('is-active');
            jQuery('li[ route_name=' + next_route + ' ]').removeClass('is-active');
        },
        leaveRoute() {
            this.outerVisible = false;
            this.hasChange = false;
            let current_route = this.$route.name;
            jQuery('li[ route_name=' + this.redirectRouteName + ' ]').addClass('is-active');
            jQuery('li[ route_name=' + current_route + ' ]').removeClass('is-active');
            this.$router.push({ name: this.redirectRouteName });
        },
        //!index means elementIndex
        componentModalShow(index, containerIndex) {
            if (this.builder_elements[index]?.type === 'container') {
                this.containerIndex = containerIndex;
            }
            this.addComponentVisible = true;
            this.currentIndex = index + 1;
        },
        getImageLink(image) {
            return image?.image_url[0]?.photo?.image_full;
        },
        getImageAlt(image) {
            return image?.image_url[0]?.photo?.alt_text;
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
                        message: response.message,
                        type: 'success',
                        position: 'bottom-right'
                    });
                    this.editFormModalShow = false;
                    this.hasChange = false;
                })
                .fail(error => {
                    this.$notify.error({
                        offset: 30,
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    })
                })
                .always(() => {
                    this.saving = false;
                });
        },
        addTextField() {
            let str = this.search;
            let componentArray = [];
            if (str.charAt(0) === '/') {
                let search_string = str.split('/');
                str = search_string[1]
                let compon = this.$refs.searchModal.searchComponent(str, this.allComponents);
                for (const property in compon) {
                    componentArray.push(compon[property]);
                }
                this.addComponent(componentArray[0]);
            } else {
                this.addComponent(textComponentData(this.search));
            }
            this.search = '';
            this.componentsDisplay = 'none';
            this.addComponentVisible = false;
        },
        handleClose() {
            this.addComponentVisible = false;
            this.current_editing == '';
        },
        closeProModal() {
            this.isVisible = false;
        },
        renderIcons(component) {
            let path = component.postion_group + '/' + component.type + '.svg'
            return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
        },
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
        },
        onSearchItem() {
            let str = this.search;
            if (str.charAt(0) === '/') {
                let search_string = str.split('/');
                str = search_string[1]
                this.componentsDisplay = 'block';
                this.$refs.searchModal.searchComponent(str, this.allComponents)
            } else {
                this.componentsDisplay = 'none';
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
        hasStepForm() {
            var count = Object.keys(this.step_forms,).length;
            return count > 0;
        },
        setStepForm(steps) {
            if (!this.hasStepForm()) {
                for (const step of steps || []) {
                    if (step?.type === 'step_form') {
                        this.step_forms = step;
                        break; // Exit the loop as soon as the condition is met
                    }
                }
            } else {
                this.$message({
                    message: 'You can only add one step form in a form',
                    type: 'warning'
                });
            }
        },
        getSettings() {
            this.fetching = true;
            // FormController@builderSettings
            this.$get(`form/${this.form_id}/editors`, {
            })
                .then(response => {
                    this.builder_elements = response.builder_settings;
                    this.setStepForm(response.builder_settings);
                    this.history = [Object.assign([], response.builder_settings)];
                    this.historyIndex = this.history.length - 1;
                    this.components = response.components;
                    this.allComponents = preparedAllComponents(response.components);
                    this.submit_button_settings = response.form_button_settings;
                    this.currencySettings = response.currency_settings;
                })
                .fail(error => {

                })
                .always(() => {
                    this.fetching = false;
                })
        },
        componentAdd(component, newIndex) {
            newIndex = this.currentIndex > 0 ? this.currentIndex : undefined;
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
                this.migrate = true;
                return this.migrateTable(component);
            }

            // check if it's single only
            if (component.single_only && this.alreadyExistElement(component.group) || this.alreadyExistElement(component.editor_title)) {
                this.$message({
                    message: 'Element already exists on your form. You can not add more of this type',
                    type: 'warning'
                });
                return;
            }
            let nonMutableElement = this.getClonedItem(component);
            nonMutableElement['active_page'] = this.active;
            if (newIndex == undefined) {
                this.builder_elements.push(nonMutableElement);
            } else {
                if (this.containerIndex != null) {
                    this.addComponentInContainer(nonMutableElement);
                } else {
                    this.builder_elements.splice(newIndex, 0, nonMutableElement);
                }
            }
            // // this.current_editing = nonMutableElement.id;
            this.search = '';
            this.addComponentVisible = false;
            this.currentIndex = 0;

            this.hasChange = true;
            if (nonMutableElement['type'] === "step_form") {
                this.setStepForm(this.builder_elements)
            }
            this.componentsDisplay = 'none';
        },
        addComponentInContainer(component) {
            if (component?.type == 'container' || this.containerIndex == null || component?.type == 'step_form') {
                this.$notify.error({
                    title: 'Error',
                    message: 'You can not add this component in container',
                    position: 'bottom-right'
                });
                return;
            }

            let column = this.builder_elements[this.currentIndex - 1]?.field_options?.columns[this.containerIndex];
            if (column?.fields) {
                column.fields.push(component);
            } else {
                column.fields = [component];
            }
            this.containerIndex = null;
        },
        async addComponent(component, newIndex) {
            if (component?.is_pro == 'yes' && window.wpPayFormsAdmin?.has_pro == "") {
                try {
                    let message = component?.disable == 'yes' ? 'This is a pro version feature, please install and activate Paymattic pro.' : 'This is a Pro-only feature! You can try it by clicking the try button and use it by clicking the buy now button.';
                    await new Promise((resolve, reject) => {
                        this.$confirm(message, 'Pro version required', {
                            confirmButtonText: component?.disable == 'yes' ? 'Cancel' : 'Try It',
                            distinguishCancelAndClose: true,
                            cancelButtonText: 'Buy Now',
                            type: 'warning'
                        }).then(() => {
                            if (component?.disable == 'yes') {
                                reject();
                                return;
                            }
                            resolve(
                                this.componentAdd(component, newIndex)
                            );
                        }).catch((action) => {
                            if (action === 'cancel') {
                                reject(
                                    window.open("https://paymattic.com/pricing/")
                                );
                            }
                            reject();
                        });
                    });
                } catch {
                    return;
                }
            } else {
                this.componentAdd(component, newIndex)
            }
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
            // return false;
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
                    // get all fields from containers
            let container_fields = [];
            let containers = this.builder_elements.filter(element => element?.type === 'container');
            for (const container of containers) {
                let container_columns = container?.field_options?.columns;
                for (const column of container_columns) {
                    let column_fields = column?.fields;
                    for (const field of column_fields) {
                        container_fields.push(field);
                    }
                }
            }
            let builder_elements = [...this.builder_elements, ...container_fields];
            each(builder_elements, (element) => {
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
        checkIsStepEmpty() {
            let stepForms = this.step_forms?.editor_elements?.form_steps;
            if (stepForms?.length > 0) {
                for (let i = 0; i < stepForms?.length; i++) {
                    let count = 0;
                    this.builder_elements?.map(element => {
                        if (element?.active_page === i) {
                            count++;
                        }
                    })
                    if (count === 0) {
                        this.$message({
                            message: 'Step ' + (i + 1) + ' is empty',
                            type: 'warning'
                        });
                        return true;
                    }
                }
            }
            return false;
        },
        migrateOptionTable() {
            this.builder_elements?.map(element => {
                if (element?.type === "tabular_products") {
                    this.$post(`forms/migrate_order_items/`, {})
                        .then(res => {
                        }).fail(error => {
                            console.log(error);
                        })
                    return;
                }
            })
        },
        saveSettings(callback) {
            this.checkForEmptyOptions();
            let isEmptyStep = this.checkIsStepEmpty();
            if (isEmptyStep) {
                return;
            }
            this.saving = true;
            this.validationErrors = false;
            this.buttonText = 'Saving...';
            if (!this.form_tips) {
                this.deleteStoreData('hide_form_' + this.form_id);
            }
            this.migrateOptionTable();
            // FormController@store
            this.$post(`form/${this.form_id}`, {
                builder_settings: JSON.stringify(this.builder_elements),
                submit_button_settings: this.submit_button_settings,
            })
                .then(response => {
                    this.$notify.success({
                        title: 'Success',
                        message: response.message,
                        position: 'bottom-right'
                    });
                    this.current_editing = '';
                    this.hasChange = false;
                    this.emit_response = true;
                    this.buttonSettingModal = false;
                    if (typeof callback === 'function') {
                        callback({ success: true });
                    }
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Error',
                        message: error?.responseJSON?.data?.message,
                        position: 'bottom-right'
                    });
                    if (error.responseJSON.data.errors) {
                        this.validationErrors = error?.responseJSON?.data?.errors;
                        jQuery([document.documentElement, document.body]).animate({
                            scrollTop: jQuery('#payform_builder').offset().top - 100
                        }, 200);
                    }
                    this.emit_response = false;
                    this.buttonSettingModal = false;
                    if (typeof callback === 'function') {
                        callback({ success: false });
                    }

                })
                .always(() => {
                    this.saving = false;
                    this.buttonText = 'Save';
                })
        },
        checkForEmptyOptions() {
            for (let index in this.builder_elements) {
                if (this.builder_elements[index].type == "currency_switcher") {
                    this.builder_elements[index].field_options.switch_options = this.builder_elements[index].field_options.switch_options.filter(option => option.value != '');
                }
            }
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
        },
        clickOutside() {
            // setTimeout(() => {
            //     this.componentsDisplay = 'none';
            // }, 300)
        },
        log() {
            let todos = [...this.builder_elements];
            this.historyIndex += 1
            this.history.splice(this.historyIndex, 0, todos);
        },
        undo() {
            if (this.canUndo) {
                this.historyIndex -= 1
                this.builder_elements = [...this.history[this.historyIndex]];
                this.$notify({
                    title: "Shortcut",
                    iconClass: 'el-icon-info',
                    offset: 30,
                    duration: 2000,
                    dangerouslyUseHTMLString: true,
                    message: `Undo 1 step, you can redo by <br/> cmd + shift + z or ctrl + shift + z`,
                    position: 'bottom-right'
                });
            }
        },
        redo() {
            if (this.canRedo) {
                this.historyIndex += 1
                this.builder_elements = [...this.history[this.historyIndex]];
                this.$notify({
                    title: "Shortcut",
                    iconClass: 'el-icon-info',
                    offset: 30,
                    duration: 2000,
                    dangerouslyUseHTMLString: true,
                    message: `Redo 1 step, you can undo by <br/> cmd + z or ctrl + z`,
                    position: 'bottom-right'
                });
            }
        },
        onMove() {
            setTimeout(() => {
                this.$emit('get-some-data');
                this.log(this.builder_elements);
            }, 1000)
        },
        keyupHandler(evt) {
            if (evt.key === 'z' && (evt.ctrlKey || evt.metaKey) && evt.shiftKey) {
                this.redo();
            } else if (evt.key === 'z' && (evt.ctrlKey || evt.metaKey)) {
                this.undo();
            }
        },
    },
    mounted() {
        this.getSettings();
        this.getForm();
        this.showNotice = this.getFromStore('hide_form_' + this.form_id) != 'yes';
        window.WPPayFormsBus.$emit('site_title', 'Form Builder');
        document.addEventListener('keydown', this.keyupHandler);
        window.onbeforeunload = () => {
            if (this.hasChange) {
                return "Data will be lost if you leave the page, are you sure?";
            }
        };
    }
}
</script>

<style lang="scss" scoped>
.wpf-step-switcher i {
    transform: rotate(90deg);
}
.el-input__inner {
    height: 35px;
}

.el-dialog__wrapper.el-dialog__body {
    padding: 30px 20px;
    background: white;
    border-radius: 0;
}

.el-dialog__footer {
    padding: 5px 5px 5px !important;
}

.el-badge__content.is-dot {
    background-color: rgb(36, 136, 11);
}

.wpf_sticky_title {
    position: sticky;
    z-index: 20;
}

.wpf_scrollable_elem {
    height: calc(100vh - 236px);
    overflow-y: scroll;
    padding: 5px 23px;

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
        text-align: center;
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
    margin-left: 0px !important;
    margin-right: 14px !important;
    position: relative;

    .wpf_editor_field_search {
        border-top: 1px solid #e3e8ed;
        border-left: 1px solid #e3e8ed;
        border-right: 1px solid #e3e8ed;
        padding: 12px;

        input {
            background: #F8F8F8;
            height: 46px;

            //width: 96%;
            //margin-left: 14px;
            i {
                font-weight: bold;
            }
        }
    }
}

.wpf_form_builder {
    .editor_is_active {
        color: #FF7518;
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

.submit_panel_active {
    color: #FF7518 !important;
}

.el-button.is-circle {
    max-height: 20px;
}

.payform_inline_item {

    .component-section {
        box-sizing: border-box;
        background: #fff;

    }

    .step-form-component {
        // margin-left: 180px;
    }

    // .action-button {
    //     display: none;
    //     position: absolute;
    //     border-radius: 2px;

    //     .action-button-element {
    //         border: none !important;
    //     }

    //     // .settings-btn {
    //     //     color: #ff9000;
    //     //     border: 1px solid #ff9000;
    //     // }

    //     // .add-btn {
    //     //     color: #67c23ae6;
    //     //     border: 1px solid #67c23ae6;
    //     // }

    //     // .delete-btn {
    //     //     color: rgb(213, 57, 57);
    //     //     border: 1px solid rgb(213, 57, 57);
    //     // }

    //     // &::after {
    //     //     content: "";
    //     //     position: absolute;
    //     //     top: 12px;
    //     //     right: -5px;
    //     //     width: 20px;
    //     //     height: 20px;
    //     //     transform: rotate(45deg);
    //     //     background: #fff;
    //     //     z-index: -9;
    //     // }

    //     i {
    //         font-size: 16px;
    //     }
    // }

    // &:hover {
    //     .action-button {
    //         display: block
    //     }
    // }
}

.wpf_inputs_new_search {
    height: 40px;
    padding: 10px;
    width: 100%;
    min-width: 250px;
    border-radius: var(--radius-6, 6px);
    border: 1px solid var(--Gray-Outline, #D6DAE1);
    background: var(--Gray-50, #F5F6F7);

    &:focus {
        // border: none;
        outline: none;
        // box-shadow: 1px 1px 2px #ccc !important;
    }
    &:hover {
        background-color: #fff !important;
    }
}

.slash {
    border: none !important;

    &:hover {
        border: nonne !important;
    }
}

.payform_inline_item {
    .action-dropdown {
        margin: 0;
        position: absolute;
        right: 0;
        max-width: 100%;
        min-width: 110px;
        text-align: right;
        padding: 10px;
        font-size: 15px;
        background: #fff;
        top: calc(100% + 10px);
        border-radius: 4px;
        box-sizing: border-box;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);

        &:before {
            content: '';
            position: absolute;
            right: 10px;
            top: -4px;
            background: #fff;
            width: 10px;
            height: 10px;
            transform: rotate(45deg);
        }

        li {
            &:last-child {
                margin-bottom: 0;
            }

            button {
                display: block;
                color: #3c434a;
                padding: 2px 0;
                transition: .3s;
                border: none;
                background: none;
                cursor: pointer;

                &:focus {
                    box-shadow: none;
                    outline: none;
                }

                &:hover {
                    color: #F98435;
                }
            }
        }
    }
}

.el-step__head {
    cursor: pointer;
}

.add_step {
    background: #f0f0f1;
    right: 0px;
    border-radius: 20px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    height: 19px;
    margin-top: 0px;

    i {
        font-size: 16px;
        font-weight: 900;
        color: #ff7518;
        cursor: pointer;
    }

    &:hover {
        background: #fbfbf8;
    }
}

.el-step__title.is-success {
    color: #ff7518;
}

// .el-step__head.is-success {
//     color: #ff7518;
//     border-color: #ff7518;

//     .el-step__line-inner {
//         background: #ff7518 !important;
//     }
// }

.float_right {
    float: right;
}

.el-popover {
    position: absolute;
    top: -147px;
    right: 0px;
}

.wpf_pro_modal {
    .el-message-box {
        border: none !important;

        .el-message-box__header {
            background-color: #e6a23c;
            padding: 15px;

            .el-message-box__title,
            .el-message-box__close {
                color: #fff;
                font-size: 20px;
                font-weight: 500;
            }
        }

        .el-message-box__content {
            .el-message-box__container {
                .el-message-box__status {
                    left: 169px;
                    transform: translateY(-111%);
                    font-size: 50px !important;
                }

                .el-message-box__status+.el-message-box__message {
                    padding: 111px 16px 16px 16px !important;

                    p {
                        font-size: 15px;
                        font-weight: 500;
                        color: #303133a3;
                        text-align: center;
                    }
                }
            }
        }
    }

    .el-button--default {
        &:hover {
            background-color: #fff !important;
            border-color: #e6a23c !important;
            color: #e6a23c !important;
        }

        font-size: 16px;
        width: 100px;
        height: 40px;
    }

    .el-button--primary,
    .el-button--primary:focus,
    .el-button--primary:hover {
        background-color: #e6a23c !important;
        border-color: #e6a23c !important;
        color: #fff !important;
        font-size: 16px;
        width: 100px;
        height: 40px;
    }
}
// .el-icon-back,
// .el-icon-right {
//     font-size: 20px;
//     margin: 0 10px;
//     }

</style>
