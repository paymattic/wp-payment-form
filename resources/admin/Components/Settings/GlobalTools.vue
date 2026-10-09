<template>
    <div>
        <div class="all_payforms_wrapper payform_section wpf_min_width">
            <div class="payform_section_header">
                <h3 class="payform_section_title">
                    {{ $t('Tools') }}
                </h3>
            </div>
            <div class="payform_section_body">
                <div class="wpf_settings_section">
                    <div class="sub_section_header">
                        <p class="wpf_settings_section_inner_label">
                            {{$t('Export Form')}}
                        </p>
                        <p>{{ $t('You can export any form as .json format that you have and then you can import the form in Paymattic')}}</p>
                    </div>
                    <hr/>
                    <div v-loading="fetching_forms" class="sub_section_body">
                        <br/>
                        <el-form label-position="top">
                            <el-form-item :label="$t('Select the form to export')">
                                <el-select filterable size="mini" v-model="export_id" :placeholder="$t('Select Form')">
                                    <el-option
                                        v-for="item in forms"
                                        :key="item.ID"
                                        :label="'#'+item.ID+' - '+item.post_title"
                                        :value="item.ID">
                                    </el-option>
                                </el-select>
                                <el-button @click="exportForm" :disabled="!export_id" type="primary" size="mini" class="wpf_new_ui_button">
                                    {{ $t('Export')}}
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="wpf_settings_section">
                    <div class="sub_section_header">
                        <p class="wpf_settings_section_inner_label">
                            {{$t('Import Form')}}
                        </p>
                        <p>{{ $t('You can import any form that is exported from paymattic')}}</p>
                    </div>
                    <hr/>
                    <div class="sub_section_body">
                        <br/>
                        <form enctype="multipart/form-data" id="upload_json_form">
                            <input type="hidden" name="action" value="wppayform_global_tools"/>
                            <input type="hidden" name="route" value="upload_form"/>
                            <label>
                                {{ $t('Upload .json file')}}
                                <input required type="file" name="import_file"/>
                            </label>
                            <el-button v-loading="uploadingForm" @click="importForm" type="primary" size="mini" class="wpf_new_ui_button">{{ $t('Import Form')}}</el-button>
                        </form>

                        <div v-if="last_uploaded_form">
                            <hr />
                            <p> {{ $t('Form successfully imported.')}} <a :href="edit_url">{{ $t('Click here to view')}}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'global_tools',
        data() {
            return {
                forms: [],
                export_id: '',
                import_file: '',
                fetching_forms: false,
                exportingForm: false,
                uploadingForm: false,
                last_uploaded_form: false,
                edit_url: ''
            }
        },
        computed: {
            exportUrl(){
                const baseUrl = window.wpPayFormsAdmin.rest.url +  '/tools/form/' + this.export_id + '/export';
                let url = new URL(baseUrl);
                url.searchParams.append('_wpnonce', window.wpPayFormsAdmin.rest.nonce);
                return url.href;
            }
        },
        methods: {
            getForms() {
                this.fetching_forms = true;
                this.$get('forms/formatted', {})
                    .then(response => {
                        this.forms = response.available_forms;
                    })
                    .fail(error => {
                        this.$showAjaxError(error);
                    })
                    .always(() => {
                        this.fetching_forms = false;
                    });
            },
            exportForm() {
                let query = {
                    _wpnonce: window.wpPayFormsAdmin.rest.nonce
                };
                var data = new URLSearchParams(query);
                window.location.href = this.exportUrl;
                this.$notify.success('Exporting form');
                this.export_id = '';
            },
            importForm() {
                console.log(jQuery('#upload_json_form')[0]);
                return;
                const that = this;
                let query = {
                    _wpnonce: window.wpPayFormsAdmin.rest.nonce
                };
                var data = new URLSearchParams(query);
                this.$upload('tools/form/import/?' + data,
                    new FormData(jQuery('#upload_json_form')[0])
                )
                .then(response => {
                    that.$notify.success({
                        title: 'Success!',
                        message: response.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
    
                    that.last_uploaded_form = response.form;
                    that.edit_url = response.edit_url;
                    jQuery('#upload_json_form')[0].reset();
                    that.uploadingForm = false;
                })
                .catch(error => {
                    this.$notify.warning({
                        message: error.responseJSON.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
                    that.uploadingForm = false;
                });
            }

        },
        mounted() {
            this.getForms();
        }
    }
</script>
