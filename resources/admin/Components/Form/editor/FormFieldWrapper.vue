<template>
    <div class="payform_builder_header" v-if="element['type'] !== 'step_form'">
        <div :class=" 'handler payform_inline_item wpf_' + element.type " style="display: flex; align-items: center;">
            <!--Form component action button start -->
            <div class="action-button">
                <button @click="deleteItem(element, containerFieldIndex, containerIndex, element_id)" class="action-button-element delete-btn">
                    <i class="el-icon-delete"></i>
                </button>
                <button @click="componentModalShow(elementIndex, containerIndex, containerFieldIndex)" class="action-button-element add-btn">
                    <i class="el-icon-plus"></i>
                </button>
                <button @click="toggleEditing(element.id, containerFieldIndex, containerIndex)" class="action-button-element settings-btn">
                    <i class="el-icon-setting"></i>
                </button>
                <button v-if="hasStepForm()" @click="isDropdownAction = !isDropdownAction"
                    class="action-button-element wpf-step-switcher">
                    <i class="el-icon-d-caret"></i>
                </button>
                <div v-if="isDropdownAction">
                    <ul v-if="step_forms" class="action-dropdown">
                        <span style="font-size: 12px; color: #FF7518; float:left;">Move
                            to:</span>
                        <br />
                        <li v-for="(step, stepIndex) in step_forms['editor_elements']['form_steps']" :key="stepIndex">
                            <button @click="element.active_page = stepIndex" v-if="active !== stepIndex">{{getStepTitle(step, stepIndex) }}
                        </button>
                        </li>
                    </ul>
                </div>
            </div>
            <!--Form component action button end -->

            <!-- label edit start -->
            <div :class="hasStepForm() ? 'component-section step-form-component' : 'component-section'"
                :style="proElementStyle(element)">
                <div v-if="element.type === 'custom_html'" class="component-label"
                    style="background-color:#F8F8F8; min-height: 50px; padding: 2px;">
                    <div v-html="element.field_options.custom_html"></div>
                </div>
                <div v-else>
                    <div
                        v-if="isEnableImage(element) === 'yes' && isPaymentItem(element.field_options.pricing_details)">
                        <div v-for="(item, index) in element.field_options.pricing_details.image_url" :key="index">
                            <photo-widget :product="item" />
                        </div>
                    </div>

                    <label v-if="element.is_pro == 'yes' && '' === has_pro" style="color: #ff9000; font-weight: 300;">
                        <i style="font-weight: 900" class="el-icon-lock"></i>
                        This is a pro-only feature item that is not available on the
                        Preview/public site.
                    </label>
                    <div id="wpf_label_editor" style="display: flex;position: relative; align-items: center;">
                        <LabelEditor v-if="element.type != 'container' && element.type != 'customer_full_name'" style="border: none" v-model="element.field_options.label" :nullable="true"
                            :type="element.type" :required="element.field_options.required === 'yes'" />
                        <span v-if="hasCondition(element.field_options)"
                            style="position: absolute;top: 0;right: 0;transform: rotate(180deg);">
                            <i class="el-icon-key"></i>
                        </span>
                        <p v-if="element.type === 'tax_payment_input'">{{ element.field_options.tax_percent }}%</p>
                        <h4 v-if="isPaymentItem(element.field_options.pricing_details)">
                            {{ currencySettings.currency_sign + '' + element.field_options.pricing_details.payment_amount }}
                        </h4>
                    </div>
                </div>
                <div v-if="element.type === 'container'" class="wp-payment-form-editor__render-container">
                    <splitpanes class="default-theme" @resized="resize($event, element.field_options)">
                        <pane v-for="(column, index) in element.field_options.columns" :key="index" min-size="20"
                            :size="element.field_options.columns[index].width <= 10 ? 10 : element.field_options.columns[index].width">
                            <!-- <draggable style="height: 100%; width: 99%;" class="list-group" :list="column.fields" :group="{ name: 'nested', put: true }"> -->
                            <draggable class="container-layout" v-model="column.fields" :group="{ name: 'nested', put: true }">
                                <div style="background: #fff;" class="list-group-item " v-for="(field, containerFieldIndex) in column.fields" :key="containerFieldIndex">
                                    <div class="field-item">
                                        <FormFieldWrapper
                                            v-if="checkValidField(field)"
                                            :element="field"
                                            :builder_elements="builder_elements"
                                            @componentModalShow="componentModalShow"
                                            :elementIndex="elementIndex"
                                            :containerIndex="index"
                                            @updateSettings="saveSettings"
                                            :containerFieldIndex="containerFieldIndex"
                                            :element_id="element.id"
                                            :currencySettings="currencySettings"
                                            :emit_response="emit_response"
                                        />
                                    </div>
                                </div>
                                <span class="add-field-item" @click="componentModalShow(elementIndex, index )">
                                    <i class="el-icon-plus"></i>
                                </span>
                            </draggable>
                        </pane>
                    </splitpanes>
                </div>
                <RenderComponent
                    v-else
                    :field_options="element.field_options"
                    :all_elements="builder_elements"
                    :element="element" @history_log="log"
                    :currencySettings="currencySettings"
                />
                <ElModal :title="element.field_options.label"
                    :dialog-visible="current_editing == element.id" :dialog-width="dialogWidth"
                    @close="toggleEditing">
                    <div v-if="current_editing == element.id">
                        <element-editor @deleteItem="deleteItem(element)"
                            @updateItem="saveSettings" :element="element"
                            :all_elements="builder_elements" />
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="medium"
                            @click="current_editing = ''">Cancel</el-button>
                        <el-button size="medium" type="primary"
                            @click="saveSettings">Update</el-button>
                    </span>
                </ElModal>
            </div>
            <!-- label edit end -->
        </div>
    </div>
</template>

<script type="text/babel">
import RenderComponent from '../editor/RenderComponent.vue';
import ElModal from '../../Common/Modal.vue';
import LabelEditor from '../editor/Widget/LabelEditor.vue';
import ElementEditor from './_ElementEditor';
import findIndex from 'lodash/findIndex';
import PhotoWidget from '../editor/Widget/PhotoWidget/_photo_widget.vue';
import draggable from 'vuedraggable';
import { Splitpanes, Pane } from 'splitpanes';
import {  hasConditionalLogic } from './editorHelper.js';

export default {
    name: "FormFieldWrapper",
    components: {
       RenderComponent,
        LabelEditor,
        PhotoWidget,
        Splitpanes,
        Pane,
        FormFieldWrapper: this,
        draggable,
        ElModal,
        ElementEditor
    },
    props: {
        emit_response: {
            type: Boolean,
            default: false
        },
        element: {
            type: [Object, String],
            default: () => []
        },
        currencySettings: {
            type: Object,
            default: {}
        },
        containerFieldIndex: {
            type: Number,
            default: 0
        },
        active: {
            type: Number,
            default: 0
        },
        step_forms: {
            type: Array,
            default: () => []
        },
        builder_elements: {
            type: Array,
            default: () => []
        },
        containerFieldIndex: {
            type: Number,
            default: null
        },
        containerIndex: {
            type: Number,
            default: null
        },
        element_id: {
            type: String,
            default: ''
        },
        elementIndex: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            isDropdownAction: false,
            current_editing: '',
            dialogWidth: '70%',
        };
    },
    methods: {
        resize(event, field_options) {
            field_options?.columns?.forEach((item, i) => {
                item.width = this.getNumber(event[i].size);
            })
        },
        getNumber(value) {
            value = value || 0;

            return parseFloat(parseFloat(value).toFixed(2));
        },
        checkValidField(field) {
            if (field?.type && field?.type !== 'container') {
                return true;
            }
            return false;
        },
        isEnableImage(element) {
            return element.field_options?.enable_image;
        },
        saveSettings() {
            this.$emit('updateSettings', (response) => {
                if (response.success) {
                    this.current_editing = '';
                }
            }); 
            if (this.emit_response) {
                this.current_editing = '';
            }
            
        },
        hasStepForm() {
            var count = Object.keys(this.step_forms,).length;
            return count > 0;
        },
        proElementStyle(element, step_form) {
            if (element?.is_pro == 'yes' && !this.has_pro) {
                return {
                    "padding-top": "20px",
                }
            }
            return;
        },
        hasCondition(item) {
            return hasConditionalLogic(item);
        },
        deleteItem(element, containerFieldIndex, containerIndex, element_id) {
            // console.log(element,findIndex(this.builder_elements, element), containerFieldIndex, containerIndex, element_id);
            if (containerIndex != null) {
                this.builder_elements?.map((item, index) => {
                console.log(item, index);
                if (item?.id == element_id) {
                        item?.field_options?.columns?.map((column, columnIndex) => {
                            if (columnIndex == containerIndex) {
                                column.fields.splice(containerFieldIndex, 1);
                            }
                        });
                }
                });
            } else {
                this.builder_elements.splice(findIndex(this.builder_elements, element), 1);
            }
        },

        componentModalShow( elementIndex, containerIndex, containerFieldIndex = null) {
            this.$emit('componentModalShow', elementIndex, containerIndex, containerFieldIndex);
            this.$nextTick(() => {
                this.$root.$emit('modal-opened');
            });
        },
        isPaymentItem(payment_item) {
            return payment_item?.one_time_type === 'single';
        },
        log(data) {
            // it should be emitted to the parent component
            this.$emit('history_log', data);
        },
        toggleEditing(elementId = '') {
            console.log('elementId', elementId);
            if (this.current_editing == elementId) {
                this.current_editing = '';
                // this.settings_modal_visable = false;
            } else {
                this.current_editing = elementId;
                // this.settings_modal_visable = true;
            }
        },
    },
    mounted() {
        jQuery('.splitpanes__splitter').on('mouseover', function() {
            jQuery(this).closest('.handler').removeClass('handler');
        });
        
        jQuery('.splitpanes__splitter').on('mouseout', function() {
            jQuery(this).closest('.payform_inline_item').addClass('handler')
        });
    }
}
</script>