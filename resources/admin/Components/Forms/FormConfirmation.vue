<template>
    <div class="wpf-setup_container">
        <!-- <div class="wpf-back-button">
            <router-link to="/">
                <i class="el-icon-back" style="font-size: 20px; cursor: pointer;" @click="active = 0"></i>
                <span style="font-size: 20px; margin-left: 4px;">{{ $t('BACK')}}</span>
            </router-link>
        </div> -->
        <div class="wpf-setup_wrapper">
            <div v-if="active == 0">
                <div class="header">
                    <h3>{{ $t('Create a Form') }}</h3>
                    <p>{{ $t('Build, choose templates or import a form to start gathering data') }}</p>
                </div>
                <div class="wpf-choose-form-card-wrapper">
                    <div @click="createABlankForm" class="wpf-choose-form-card">
                        <div class="wpf-form-type-icon">
                            <Icon icon="wpf-plus-form" />
                            <!-- <img :src="assetsUrl('classic_editor.svg')" alt="" /> -->
                        </div>
                        <div class="wpf-form-type-details">
                            <h4 class="wpf-choose-form-card-title">{{ $t('Blank Form') }}</h4>
                            <p class="wpf-choose-form-card-description">{{ $t('Create a fresh one from scratch') }}.</p>
                        </div>
                    </div>
                    <!-- <div @click="chooseFormTemplate('0')" class="wpf-choose-form-card">
                        <div class="wpf-form-type-icon active">
                            <img :src="assetsUrl('donation_template.svg')" alt="" />
                        </div>
                        <div class="wpf-form-type-details">
                            <h4 class="wpf-choose-form-card-title">{{ $t('Donation Templates')}}</h4>
                            <p class="wpf-choose-form-card-description">{{ $t('Create a donation form in a blink')}}.</p>
                        </div>
                    </div> -->
                    <div @click="chooseFormTemplate('1')" class="wpf-choose-form-card">
                        <div class="wpf-form-type-icon active">
                            <img :src="assetsUrl('form-template.svg')" alt="" />
                        </div>
                        <div class="wpf-form-type-details">
                            <h4 class="wpf-choose-form-card-title">{{ $t('Choose Templates') }}</h4>
                            <p class="wpf-choose-form-card-description">{{ $t('From 70+ pre-built templates') }}.</p>
                        </div>
                    </div>
                    <div class="wpf-choose-form-card">
                        <div class="wpf-form-type-icon active" @click="dialogVisible = true">
                            <img :src="assetsUrl('import-template.svg')" alt="" />
                        </div>
                        <div class="wpf-form-type-details">
                            <h4 class="wpf-choose-form-card-title">{{ $t('Import Form') }}</h4>
                            <p class="wpf-choose-form-card-description">{{ $t('Import a JSON format form in seconds.') }}.
                            </p>
                        </div>
                    </div>

                    <!-- Modal dialog -->
                    <ImportModal title="Import Form" :dialog-visible="dialogVisible" :dialog-width="dialogWidth" @close="handleClose">
                        <div class="wpf_import">
                            <form enctype="multipart/form-data">
                                <div class="wpf_import_upload">
                                    <el-upload class="upload-demo" drag
                                        action=""
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove" :file-list="fileList" :on-progress="handleProgress"
                                        :class="{ 'el-upload-custom-class': fileList.length != 0 }"
                                        :before-upload="beforeUpload" accept=".json" :limit="1"
                                        :file-size="5242880" :on-success="handleUploadSuccess">
                                        <Icon icon="wpf-upload" />
                                        <div class="el-upload__text"><span>Drop Form here or</span> <em>Import your form in JSON format.</em>
                                        </div>
                                        <span>File size: up to 5MB.</span>
                                    </el-upload>

                                </div>
                                <div class="preview-link" v-if="showPreviewLink === true">
                                    <span>Form Successfully Imported</span>
                                    <a :href="previewUrl" target="_blank">
                                        <Icon icon="wpf-gold-eye" />
                                        <span>Preview Form</span>
                                    </a>
                                </div>
                                <span slot="footer" class="dialog-footer">
                                    <el-button size="medium" @click="closeDialog">Cancel</el-button>
                                    <el-button size="medium" @click="importForm" type="primary">Import</el-button>
                                </span>
                            </form>
                        </div>
                    </ImportModal>
                </div>
            </div>
            <!-- {{ demo_forms }} -->
            <div class="wpf-setup_body">
                <template>
                    <create-form :style="{ display: active === 1 ? 'block' : 'none' }" :demo_forms="demo_forms"
                        :categories="payment_categories" :modalVisible.sync="createFormModal" :form_type="radio"
                        ref="create_form" @update:close-modal="active = 0" />
                </template>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import CreateForm from './CreateForm.vue';
import Icon from '../Icons/Index.vue';
import ImportModal from '../Common/Modal.vue';

export default {
    name: 'FormConfirmation',
    components: { CreateForm, Icon, ImportModal },
    data() {
        return {
            active: 0,
            radio: '1',
            loadingDemoForms: false,
            createFormModal: false,
            demo_forms: {},
            payment_categories: [],
            quick_checkout_categories: [],
            quick_checkout_forms: {},
            dialogVisible: false,
            dialogWidth: '40%',
            fileList: [],
            uploadingForm: false,
            last_uploaded_form: false,
            edit_url: '',
            previewUrl: null,
            showPreviewLink: false
        };
    },
    methods: {
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
        },
        chooseFormTemplate(type) {
            this.active = 1;
            this.radio = type;
        },
        createABlankForm() {
            this.$refs.create_form.createFromTemplate()
        },
        // prepareDemosData(demo_forms, categories) {
        //     let payment_form = {};
        //     let payment_form_category = {};
        //     let quick_checkout = {};
        //     let quick_checkout_category = {};
        //     Object.keys(demo_forms).map((form, index) => {
        //         if(demo_forms[form].category === 'Quick checkout') {
        //             quick_checkout[form] = demo_forms[form];
        //             if(demo_forms[form].category === categories[index]) {
        //                 quick_checkout_category[index] = categories[index];
        //             }
        //         } else {
        //             payment_form[form] = demo_forms[form];
        //             if(demo_forms[form].category === categories[index]) {
        //                 payment_form_category[index] = categories[index]
        //             }
        //         }
        //     });
        //     this.demo_forms = payment_form;
        //     this.payment_categories = payment_form_category;
        //     this.quick_checkout_categories = quick_checkout_category;
        //     this.quick_checkout_forms = quick_checkout;
        // },
        getDemoForms() {
            this.loadingDemoForms = true;
            this.$get('forms/demo', {})
                .then(response => {
                    this.demo_forms = response.demo_forms;
                    this.payment_categories = response.categories;
                    // this.prepareDemosData(response.demo_forms, response.categories);
                })
                .fail(error => {
                    this.$showAjaxError(error);
                })
                .always(() => {
                    this.loadingDemoForms = false;
                });
        },
        createTemplate() {
            this.$refs.create_form.createFromTemplate()
        },
        handleClose() {
            if(this.showPreviewLink){
                this.showPreviewLink = false;
            }

            if(this.fileList.length > 0){
                this.fileList = [];
            }
            this.dialogVisible = false;
        },
        handleRemove(file, fileList) {
            fileList.splice(1, 1);
            this.fileList = fileList;
        },
        handlePreview(file, fileList) {
        },
        handleProgress(event, file, fileList) {
            this.fileList = fileList;
            // console.log(`File ${file.name} is ${event.percent}% uploaded.`);
        },
        closeDialog(){
            if(this.showPreviewLink){
                this.showPreviewLink = false;
            }

            if(this.fileList.length > 0){
                this.fileList = [];
            }
            this.dialogVisible = false;
        },
        beforeUpload(file) {
            if(this.showPreviewLink){
                this.showPreviewLink = false;
            }

            const maxSizeMB = 5;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            const isSizeValid = file.size <= maxSizeBytes;

            if (!isSizeValid) {
                this.$notify.warning({
                    offset: 30,
                    title: 'Warning!',
                    message: `File size exceeds ${maxSizeMB}MB limit.`,
                    position: 'bottom-right'
                });
            }
            return isSizeValid;
        },
        handleUploadSuccess(response, file, fileList) {
            // console.log('Upload success:', response, fileList);
            // this.previewUrl = response.preview_url;
        },
        isJSONFile(filename) {
            return filename.endsWith('.json');
        },
        timeOut() {
            setTimeout(() => {
                // this.showPreviewLink = false;
            }, 5000);
        },
        importForm() {

            if (this.fileList.length === 0) {
                this.$notify.warning({
                    offset: 30,
                    title: 'Warning!',
                    message: 'Please choose a file!!',
                    position: 'bottom-right'
                });

                return;
            }

            if (!this.isJSONFile(this.fileList[0].name)) {
                this.$notify.error({
                    offset: 30,
                    title: 'Error!',
                    message: 'Invalid File. Please upload the correct JSON file.',
                    position: 'bottom-right'
                });
                return;
            }

            const formData = new FormData();
            this.fileList.forEach(file => {
                formData.append('file', file.raw);
                formData.append('_wpnonce', window.wpPayFormsAdmin.rest.nonce);
            });
            
            const that = this;
            that.$upload('tools/form/import/', formData)
                .then(response => {
                    that.$notify.success({
                        title: 'Success!',
                        message: response.message,
                        offset: 30,
                        position: 'bottom-right'
                    });

                    this.fileList = [];
                    that.last_uploaded_form = response.form;
                    that.edit_url = response.edit_url;
                    this.previewUrl = response.form.preview_url;
                    this.showPreviewLink = true;
                    that.uploadingForm = false;
                    this.timeOut()
                })
                .catch(error => {
                    // console.error('Error during form import:', error);
                    if (error.responseJSON && error.responseJSON.message) {
                        
                        that.$notify.error({
                        title: 'Error!',
                        message: error.responseJSON.message,
                        offset: 30,
                        position: 'bottom-right'
                    });
                    }
                    that.uploadingForm = false;
                });
        }

    },
    mounted() {
        this.getDemoForms();
    }
}
</script>
<!-- <style lang="scss" scope>
 .wpf-setup {
     &_wrapper {
         max-width: 940px;
         margin: 0 auto;
         .wpf-navigation {
             margin-bottom: 10px;
             padding: 0px 40px 0px 40px;
             .el-step__icon.is-icon {
               width: 40px;
               border-radius: 50px;
               padding: 21px;
               margin-top: -9px;
             }
         }
         &_container {
             width: 100%;
             overflow: scroll;
             background: #f6f7f7;
         }
         .wpf-setup_body {
             padding: 10px;
             overflow: hidden;
             border-radius: 10px;
             zoom: 1;
             border: 1px solid #d5d5d5;
         }
         .header {
             text-align: center;
         }
     }
 }</style> -->

<style lang="scss">
.el-upload-custom-class {
    .el-upload-list {
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #D6DAE1;
        background: #FFF;
        margin-top: 15px;

        .el-icon-document {
            font-size: 16px;
            background: #FAFAFA;
            padding: 0px 8px;
            border-radius: 4px;
        }
    }
}

.preview-link {
    background: #F9FAFB;
    display: flex;
    justify-content: space-between;
    padding: 22px 20px;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
    border-radius: 8px;
    transition: all 0.3s ease;

    a {
        color: #F98435;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        border: 1px solid;
        border-radius: 8px;
        text-decoration: none;
        padding: 5px 10px;
        display: flex;
        gap: 8px;

        &:focus {
            box-shadow: none !important;
        }

        .icon {
            display: flex;
            align-items: center;
        }
    }
}
</style>
