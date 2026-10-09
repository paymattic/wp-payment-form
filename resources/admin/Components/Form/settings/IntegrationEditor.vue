<template>
    <div v-if="!titleLoading" class="edit_integration">
        <div class="payform_section_header"> 
            <div :class="titleLoading ? 'payform_breadcrumb_title hidden' : 'payform_breadcrumb_title show'"> 
                <a :href="formBuilderRoute">{{ form_title }}</a>
                <Icon icon="wpf-arrow-right"/>
                <a :href="integrationsRoute">Integrations</a>
                <Icon icon="wpf-arrow-right"/>
                <a style="color: #2F3448;">{{ title }}</a>
            </div>
        </div>
        <div class="integration_feed_wrapper"> 
            <div class="payform_section_header_2">
                <el-col :md="12"><h2 style="line-height: 0;">{{title}}</h2></el-col>
                <el-col :md="12" class="action-buttons mb15 clearfix">
                    <!-- <video-doc class="pull-right ff-left-spaced" :route_id="integration_name" btn_text="View Video Instruction" /> -->
                    <router-link
                        class="pull-right el-button el-button--default el-button--small wpf_view_all_btn"
                        :to="{name: 'integration'}"
                    >View All</router-link>
                </el-col>
            </div>

            <div v-loading="loading_app" element-loading-text="Loading Settings..." class="integration_feed">
                <el-form v-if="!loading_app"  label-position="left" style="display: flex; flex-direction: column; align-items: stretch; gap: 8px">
                    <template v-for="(field,i) in settings_fields.fields">
                        <el-form-item :key="i"
                            v-if="firstFormItemType(field) && shouldShowField(field)"
                            :required="field.required"
                            class="wpf_integration_feed-form_item"
                        >
                            <template slot="label">
                                {{field.label}}
                                <el-tooltip
                                    v-if="field.tips"
                                    class="item"
                                    effect="light"
                                    placement="bottom-start"
                                >
                                    <div slot="content">
                                        <p v-html="field.tips"></p>
                                    </div>
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </template>

                            <template v-if="field.key == 'list_id' && supportsConditionalLists">
                                <div class="wpf_conditional_list_switch">
                                    <el-switch
                                        v-model="settings.list_conditional.status"
                                        :active-text="fluentCrmConditionalConfig.statusLabel"
                                        @change="onListConditionalToggle">
                                    </el-switch>
                                    
                                    <el-tooltip
                                        class="item"
                                        effect="light"
                                        placement="bottom-start"
                                    >
                                        <div slot="content">
                                            <p v-html="fluentCrmConditionalConfig.tooltipText"></p>
                                        </div>
                                        <i class="el-icon-info wpf_tooltip_icon"></i>
                                    </el-tooltip>
                                </div>

                                <FluentcrmFilterField
                                    v-if="fluentCrmConditionalConfig.isEnabled"
                                    :all_elements="all_elements"
                                    :fluentCrmLists="fluentCrmLists"
                                    :settings="settings"
                                />
                            </template>

                            <template v-if="field.component == 'text'" >
                                <el-input
                                    size="medium"
                                    :placeholder="field.placeholder"
                                    v-model="settings[field.key]"
                                ></el-input>
                                <p v-if="field.inline_tip" v-html="field.inline_tip"></p>
                                <error-view :field="field.key" :errors="errors"></error-view>
                            </template>
                            <template v-else-if="field.component == 'verify_button'">
                                <el-button
                                    :loading="verifying"
                                    @click="verifyEndpoint"
                                    size="medium"
                                    type="default"
                                >
                                    {{ field.button_text }}
                                </el-button>
                            </template>
                            <template v-else-if="field.component == 'list_ajax_options'">
                                <el-select size="medium"
                                    v-loading="loading_list"
                                    @change="loadMergeFields()"
                                    v-model="settings.list_id"
                                    :placeholder="field.placeholder">
                                    <el-option
                                        v-for="(list_name, list_key) in field.options"
                                        :key="list_key"
                                        :value="list_key"
                                        :label="list_name"
                                    ></el-option>
                                </el-select>
                                <error-view :field="field.key" :errors="errors"></error-view>
                            </template>

                            <template v-else-if="field.component == 'select' && !fluentCrmConditionalConfig.isEnabled">
                                <el-select size="medium"
                                        filterable
                                        clearable
                                        :multiple="field.is_multiple"
                                        v-model="settings[field.key]"
                                        :placeholder="field.placeholder">
                                    <el-option
                                            v-for="(list_name, list_key) in field.options"
                                            :key="list_key"
                                            :value="list_key"
                                            :label="list_name"
                                    ></el-option>
                                </el-select>
                                <error-view :field="field.key" :errors="errors"></error-view>
                            </template>

                            <template v-else-if="field.component == 'map_fields'">
                                <merge-field-mapper
                                    @setMergeModelObj="setMergeModel(field)"
                                    :errors="errors"
                                    :inputs="inputs"
                                    :field="field"
                                    :settings="settings"
                                    :required="field.required"
                                    :editorShortcodes="editorShortcodes"
                                    :merge_model="settings[field.key]"
                                    :merge_fields="merge_fields" />
                            </template>

                            <template v-else-if="field.component == 'checkbox-single'">
                                <el-checkbox v-model="settings[field.key]">
                                    {{field.checkbox_label}}
                                </el-checkbox>
                                <p v-if="field.inline_tip" v-html="field.inline_tip"></p>
                            </template>

                            <template v-else-if="field.component == 'checkbox-multiple'">
                                <el-checkbox-group v-model="settings[field.key]">
                                    <el-checkbox
                                        v-for="(fieldValue, i) in field.options"
                                        :key="i"
                                        :label="Number(i)"
                                    >{{fieldValue}}</el-checkbox>
                                </el-checkbox-group>
                            </template>

                            <template v-else-if="field.component == 'checkbox-multiple-text'">
                                <el-checkbox-group v-model="settings[field.key]">
                                    <el-checkbox
                                        v-for="(fieldValue, i) in field.options"
                                        :key="i"
                                        :label="i"
                                    >{{fieldValue}}</el-checkbox>
                                </el-checkbox-group>
                            </template>

                            <template v-else-if="field.component == 'conditional_block'">
                                <filter-fields
                                    :fields="inputs"
                                    :conditionals="settings[field.key]"
                                    :editorShortcodes="editorShortcodes"
                                    :disabled="!has_pro" />
                            </template>

                            <template v-else-if="field.component == 'value_text'">
                                <filed-general
                                    :editorShortcodes="editorShortcodes"
                                    v-model="settings[field.key]"
                                />
                                <p v-if="field.inline_tip" v-html="field.inline_tip"></p>
                            </template>

                            <template v-else-if="field.component == 'value_textarea'">
                                <filed-general
                                    field_type="textarea"
                                    :editorShortcodes="editorShortcodes"
                                    v-model="settings[field.key]"
                                />
                                <p v-if="field.inline_tip" v-html="field.inline_tip"></p>
                            </template>

                            <template v-else-if="field.component == 'list_select_filter'">
                                <list-select-filter :settings="settings" :field="field"  />
                            </template>

                            <template v-else-if="field.component == 'dropdown_label_repeater'">
                                <drop-down-label-repeater
                                    :errors="errors"
                                    :inputs="inputs"
                                    :field="field"
                                    :settings="settings"
                                    :editorShortcodes="editorShortcodes"
                                />
                            </template>

                            <template v-else-if="field.component == 'dropdown_many_fields'">
                                <drop-down-many-fields
                                    :errors="errors"
                                    :inputs="inputs"
                                    :field="field"
                                    :settings="settings"
                                    :editorShortcodes="editorShortcodes"
                                />
                            </template>
                            <template v-else-if="field.component == 'radio_choice'">
                                <el-radio-group v-model="settings[field.key]">
                                    <el-radio
                                        v-for="(fieldLabel, fieldValue) in field.options"
                                        :key="fieldValue"
                                        :label="fieldValue"
                                    >{{fieldLabel}}</el-radio>
                                </el-radio-group>
                            </template>

                            <template v-else-if="field.component == 'number'">
                                <el-input-number size="medium" v-model="settings[field.key]"></el-input-number>
                            </template>

                            <template v-else-if="field.component == 'chained_fields'">
                                <chained-fields
                                    v-if="has_pro"
                                    :settings="settings"
                                    v-model="settings[field.key]"
                                    :field="field"
                                ></chained-fields>
                                <p style="color: red;" v-else>
                                    This field only available on pro version.
                                    Please install Paymattic Pro.
                                </p>
                            </template>

                            <template v-else-if="field.component == 'chained_select'">
                                <chained-selects
                                    v-if="has_pro"
                                    :settings="settings"
                                    v-model="settings[field.key]"
                                    :field="field"
                                ></chained-selects>
                                <p style="color: red;" v-else>
                                    This field only available on pro version.
                                    Please install Paymattic Pro.
                                </p>
                            </template>

                            <template v-else-if="field.component == 'html_info'">
                                <div v-html="field.html_info"></div>
                            </template>

                            <template v-else-if="field.component == 'selection_routing'">
                                <selection-routing
                                    :inputs="inputs"
                                    :field="field"
                                    :editorShortcodes="editorShortcodes"
                                    :settings="settings" />
                            </template>

                            <template v-else>
                                <div v-if="field.key != 'list_id'">
                                    <p>No Template found. Please make sure you are using latest version of  WPPayForms</p>
                                    <pre>{{field.component}}</pre>
                                    <pre>{{field}}</pre>
                                </div>
                                
                            </template>
                        </el-form-item>
                        <el-form-item v-if="field.key == 'userRole'" :key="field.key" class="wpf_integration_feed-user_role"> 
                            <template slot="label">
                                {{field.label}}
                                <el-tooltip
                                    v-if="field.tips"
                                    class="item"
                                    effect="light"
                                    placement="bottom-start"
                                >
                                    <div slot="content">
                                        <p v-html="field.tips"></p>
                                    </div>
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </template>
                            <el-radio-group v-model="settings[field.key]">
                                <el-radio
                                    v-for="(fieldLabel, fieldValue) in field.options"
                                    :key="fieldValue"
                                    :label="fieldValue"
                                >{{fieldLabel}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item  v-if="field.key=='request_headers' && settings['with_header'] == 'yup'" :key="field.key" class="wpf_integration_feed-form_item">
                            <request-key-value
                                :settings="settings"
                                :field="field"
                                :inputs="inputs"
                                :form_id="form_id"
                                :request_headers="field.options"
                                :editor_shortcodes="shortcodes"
                            ></request-key-value>
                        
                        </el-form-item>
                        <el-form-item  v-if="field.key=='selected_request_fields' && settings['with_selected_fields'] == 'yup'" :key="field.key" class="wpf_integration_feed-form_item">
                            <request-key-value
                                :settings="settings"
                                :field="field"
                                :inputs="inputs"
                                :form_id="form_id"
                                :request_headers="field.options"
                                :editor_shortcodes="shortcodes"
                            ></request-key-value>
                        
                        </el-form-item>
                        <el-form-item v-if="(field.component =='checkbox-single' && field.checkbox_label) && ((field.require_list && merge_fields) || (!field.require_list)) && shouldShowField(field)" :key="field.key" class="wpf_integration_feed-form_item_checkbox-singular">
                            <el-checkbox v-model="settings[field.key]">
                                    {{field.checkbox_label}}
                                    <el-tooltip
                                        v-if="field.tips"
                                        class="item"
                                        effect="light"
                                        placement="bottom-start"
                                    >
                                        <div slot="content">
                                            <p v-html="field.tips"></p>
                                        </div>
                                        <i class="el-icon-info"></i>
                                    </el-tooltip>
                            </el-checkbox>
                            <p v-if="field.inline_tip" v-html="field.inline_tip"></p>
                        </el-form-item>
                    </template>
                    <div class="wpf_warning">
                        <Icon icon="wpf-warning" />
                        <p > {{ $t( 'Please be cautious selecting transaction related fields (ex: Transaction ID), because integrations are mostly asynchronous process and transaction might not happened yet at the time of integration. As a result you might not get the selected field value!') }} </p>
                    </div>
                    <template v-if="maybeShowSaveButton">
                        <hr>
                        <el-button
                            type="primary"
                            class="pull-right wpf_new_ui_button"
                            size="medium"
                            :loading="saving"
                            @click="saveNotification"
                        >
                            <span v-if="integration_id">
                                Update {{settings_fields.integration_title}} Feed
                            </span>
                            <span v-else>Create {{settings_fields.integration_title}} Feed</span>
                        </el-button>
                    </template>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import Errors from "../../../../common/Errors";
    import inputPopover from '../Templates/input-popover.vue';
    import ErrorView from '../Templates/errorView';
    import FilterFields from '../Templates/FilterFields';
    import MergeFieldMapper from '../Templates/_field_maps';
    import FiledGeneral from '../Templates/_FieldGeneral';
    import ListSelectFilter from '../Templates/_ListSelectFilter';
    import DropDownLabelRepeater from '../Templates/_DropdownLabelRepeater';
    import DropDownManyFields from '../Templates/_DropdownManyFields';
    import ChainedFields from '../Templates/_ChainedFields';
    import ChainedSelects from '../Templates/_ChainedSelects';
    import RequestKeyValue from '../Templates/_RequestKeyValue';
    // import VideoDoc from '@/common/VideoInstruction.vue';
    import SelectionRouting from '../Templates/_SelectionRouting';
    import Icon from '../../Icons/Index.vue';
    import FluentcrmFilterField from "./_FluentcrmFilterField.vue";
    
    export default {
        name: 'general_notification_edit',
        components: {
            SelectionRouting,
            ErrorView,
            inputPopover,
            FilterFields,
            MergeFieldMapper,
            FiledGeneral,
            ListSelectFilter,
            DropDownLabelRepeater,
            DropDownManyFields,
            ChainedFields,
            ChainedSelects,
            RequestKeyValue,
            Icon,
            FluentcrmFilterField
            // VideoDoc
        },
        props: ['form_id'],
        data() {
            return {
                loading_app: false,
                loading_list: false,
                errors: new Errors(),
                integration_id: parseInt(this.$route.params.integration_id),
                integration_name: this.$route.params.integration_name,
                saving: false,
                merge_fields: false,
                settings: {},
                settings_fields: {},
                attachedForms: [],
                has_pro: window.wpPayFormsAdmin.has_pro,
                inputs: [],
                editorShortcodes: [],
                // array 
                shortcodes: [],
                verifying: false,
                form_title: '',
                titleLoading: true,
                all_elements: [],
                fluentCrmLists: []
            }
        },
        computed: {
            title() {
                let integrationName = this.settings_fields.integration_title || '';
                if(this.integration_id) {
                    return `Update ${integrationName} Integration Feed`;
                } else {
                    return `Add New ${integrationName} Integration Feed`;
                }
            },
            maybeShowSaveButton() {
                let fields = this.settings_fields;
                let mergeFields = this.merge_fields;
                return (fields.button_require_list && mergeFields) || !fields.button_require_list;
            },
            formBuilderRoute() {
                return `#/edit-form/${this.form_id}/form-builder`;
            },
            integrationsRoute() {
                return `#/edit-form/${this.form_id}/integrations`;
            },
            fluentCrmConditionalConfig() {
                return {
                    statusLabel: this.$t('Conditional List Selection'),
                    tooltipText: this.$t('Allow FluentCRM list conditionally based on your submission values'),
                    isEnabled: this.settings?.list_conditional?.status || false
                };
            },
            supportsConditionalLists() {
                return this.settings_fields.integration_title === 'FluentCRM';
            }
        },
        methods: {
            shouldShowField(field) {
                // If field doesn't have conditional logic, show it
                if (!field.conditional) {
                    return true;
                }

                const conditional = field.conditional;
                
                // Handle field_value type conditional
                if (conditional.type === 'equal') {
                    const targetValue = this.settings[conditional.target];
                    return targetValue === conditional.value;
                }
                if (conditional.type === 'not_equal') {
                    const targetValue = this.settings[conditional.target];
                    return targetValue !== conditional.value;
                }

                // Add more conditional types here if needed
                // For example: conditional.type === 'field_exists', etc.
                
                return true; // Default to showing field if conditional type is not recognized
            },
            loadIntegrationSettings() {
                this.loading_app = true;
                this.$get(`form/${this.form_id}/integration/settings`, {
                    integration_id: this.integration_id,
                    integration_name: this.integration_name,
                })
                    .then(response => {
                        this.settings_fields = response.settings_fields;
                        this.settings = response.settings;

                        this.editorShortcodes = Object.values(response.shortcodes);
                        this.inputs = response.inputs;
                        this.all_elements = response.all_elements;
                        if(!this.settings.name) {
                            this.settings.name = response.settings_fields.integration_title + ' Integration Feed' || '';
                        }
                        if (this.settings_fields.integration_title === 'FluentCRM') {
                            const fields = response.settings_fields?.fields || [];
                            const listIdField = fields.find(field => field.key === 'list_id');
                            this.fluentCrmLists = listIdField ? listIdField?.options : [];
                        }

                        this.merge_fields = response.merge_fields;
                    })
                    .fail(error => {
                        this.$notify({
                            title: 'Please check global settings!',
                            message: error.responseJSON.data.message,
                            type: 'warning',
                            position: 'bottom-right',
                        });
                    })
                    .always(() => {
                        this.loading_app = false;
                    });
                // get all editor shortcodes for this format if needed
                this.$get(`form/${this.form_id}/settings`, {})
                    .then(response => {
                        this.shortcodes[0] = response.editor_shortcodes.other;
                        this.shortcodes[1] = response.editor_shortcodes.submission;
                        this.shortcodes[2] = response.editor_shortcodes.wp
                    })
                    .fail(e => console.log(e))
                    .always(_ => this.loading = false);
            },
            loadMergeFields() {
                this.loading_list = true;
                this.$get(`form/${this.form_id}/integration/lists`, {
                    integration_id: this.integration_id,
                    list_id: this.settings.list_id,
                    integration_name: this.integration_name
                })
                    .then(response => {
                        this.merge_fields = response.merge_fields;
                    })
                    .fail(error => {
                        console.log(error);
                    })
                    .always(() => {
                        this.loading_list = false;
                    });
            },
            firstFormItemType(field) {
                return (field.require_list && this.merge_fields && !field.checkbox_label) || (!field.require_list && field.key !== 'request_headers' && field.key !== 'selected_request_fields' && field.key !== 'userRole' && field.key !== 'note' && !field.checkbox_label)
            },
            saveNotification() {
                this.saving = true;
                let data = {
                    integration_id: this.integration_id,
                    integration_name: this.integration_name,
                    integration: JSON.stringify(this.settings),
                    data_type: 'stringify',
                };
                this.$post(`form/${this.form_id}/integration/settings`, data)
                    .then(response => {
                        if(response.created) {
                            this.$router.push({
                                name: 'integration'
                            });
                        }
                        this.$notify.success({
                            offset: 30,
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {
                        this.errors.record(error.responseJSON.data.errors);
                        this.$notify.error({
                            offset: 30,
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => this.saving = false);
            },
            setMergeModel(field) {
                this.settings[field.key] = {}
            },
            verifyEndpoint() {
                this.verifying = true;
                this.$post(`form/${this.form_id}/integration/verify`,{
                    form_id: this.form_id,
                    integration_name: this.integration_name,
                }).then(response => {
                    this.$notify.success({
                        offset: 30,
                        title: 'Success!',
                        message: response.data.message,
                        position: 'bottom-right'
                    });
                }).fail(error => {
                    this.$notify.error({
                        offset: 30,
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                }).always(r => {
                    this.verifying = false;
                });
            },
            getFormTitle() {
                this.$get(`form/${this.form_id}`, {
                })
                .then(response => {
                    this.form_title = response.post_title;
                    this.titleLoading = false;
                })
                .fail(error => {

                })
                .always(() => {
                    this.titleLoading = false;
                });
            },
            onListConditionalToggle(isEnabled) {
                this.$set(this.settings, 'list_id', '');
                if (!isEnabled) {
                    this.$set(this.settings, 'list_conditional', {
                        status: false,
                        conditions: []
                    });
                } else {
                    if (!this.settings.list_conditional.conditions) {
                        this.$set(this.settings.list_conditional, 'conditions', []);
                    }
                }
            }
        },
        mounted() {
            this.getFormTitle();
            this.loadIntegrationSettings();
        }
    }
</script>
<style scoped>
     .edit_integration {
        max-width: 915px;
        margin: 0 auto;
        min-height: 300px;
        padding: 0px 16px 16px 16px;
        /* box-shadow: 0 7px 14px 0 rgb(60 66 87 / 10%), 0 3px 6px 0 rgb(0 0 0 / 7%); */
    }
    .element-loading-text{
      color: #FF7518 !important;
    }
    .wpf_conditional_list_switch {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-top: 4px;
    }
</style>
