<template>
    <div class="" >
        <div :class="hasStepForm ? ' step-form-component' : 'title-editor'"  style="padding: 20px 4px; border-radius: 5px 5px 0px 0px;">
            <el-tooltip :open-delay="1000" class="item" effect="light" content="Click to edit title and description"
            placement="top-start">
                <h1 class="header" @click="$emit('form-title-modal-toggle')">
                    {{ form.post_title }}
                </h1>
            </el-tooltip>
            <span style="margin: 5px auto;
            max-width: 600px" v-if="form.show_title_description === 'yes'" v-html="form.post_content"></span>
        </div>
        <el-dialog title="Edit Form Title and Description" :visible.sync="editFormModalShow" width="50%"
            :before-close="handleClose" class="wpf_form_title_editor">
            <div class="modal_body">
                <el-form ref="edit_form" @submit.prevent.native="editForm()" :model="form" label-width="160px">
                    <el-form-item label="Form Title">
                        <el-input v-model="form.post_title" size="mini" type="text" placeholder="Form Title" />
                    </el-form-item>
                    <el-form-item label="Form Description">
                        <wp-editor v-model="form.post_content" />
                    </el-form-item>
                    <el-checkbox true-label="yes" false-label="no" v-model="form.show_title_description" style="padding-top: 10px;">Show Form Title
                        and Description at frontend
                    </el-checkbox>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="$emit('form-title-modal-toggle')" class="wpf_new_ui_button2">{{ $t('Cancel')}}
                </el-button>
                <el-button size="medium" type="primary" @click="editForm()" class="wpf_new_ui_button">{{ $t('Update')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import WpEditor from '../Common/_wp_editor';
export default {
    components: {
        WpEditor
    },
    props: ['form', 'editFormModalShow', 'hasStepForm'],
    methods: {
        editForm() {
            this.$emit('edit-form', this.form);
        },
        handleClose() {
            this.$emit('form-title-modal-toggle');
        }
    }
}
</script>
<style scoped>
.component-section {
    margin: 0 auto;
    width: 70%;
    padding: 5px 23px;
    margin-left: 140px;
    box-sizing: border-box;
    background: #fff;
}
.step-form-component {
    /* margin-left: 180px; */
}
.header {
    font-weight: bold;
    cursor: pointer;
    color: #1d2327cc;
}
</style>