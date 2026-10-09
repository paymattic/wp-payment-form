<template>
    <div v-if="appReady" class="wpf_merge_fields_table" width="100%">
        <el-row class="wpf_merge_fields_table_head">
            <el-col class="text-left" width="50%">{{field.field_label_remote}}</el-col>
            <el-col class="text-left" width="50%">{{field.field_label_local}}</el-col>
        </el-row>
        <el-row class="wpf_merge_fields_table_row" v-for="primary_field in field.primary_fileds" :key="primary_field.key">
            <el-col :class="(primary_field.required) ? 'remote_field is-required' : 'remote_field'">
                <label class="el-form-item__label" style="padding: 0px !important;">{{primary_field.label}} <span v-if="primary_field.required" style="color: red;">*</span></label>
            </el-col>
            <el-col class="local_field">
                    <el-select
                        size="medium"
                        v-if="primary_field.input_options == 'emails'"
                        v-model="settings[primary_field.key]"
                        placeholder="Select a Field"
                        style="width:100%"
                        clearable
                    >
                        <el-option
                            v-for="(option, index) in inputs"
                            v-if="option.attributes.type === 'customer_email'"
                            :key="index" :value="option.attributes.code"
                            :label="option.attributes.name"
                        ></el-option>
                    </el-select>

                    <el-select
                        size="medium"
                        v-else-if="primary_field.input_options == 'all'"
                        v-model="settings[primary_field.key]"
                        placeholder="Select a Field"
                        style="width:100%"
                        clearable
                    >
                        <el-option
                            v-for="(option, index) in inputs"
                            :key="index" :value="option.attributes.name"
                            :label="option.admin_label"
                        ></el-option>
                    </el-select>


                    <template v-else>
                        <field-general
                            :editorShortcodes="editorShortcodes"
                            v-model="settings[primary_field.key]"
                        ></field-general>
                    </template>

                    <div
                        style="color: #999;font-size: 12px;line-height: 15px;font-style: italic;"
                        class="primary_field_help_text"
                        v-if="primary_field.help_text"
                    >{{ primary_field.help_text }}</div>

                    <error-view field="fieldEmailAddress" :errors="errors"></error-view>
            </el-col>
        </el-row>
        <el-row  class="wpf_merge_fields_table_row" v-if="field.default_fields" v-for="default_field in field.default_fields" :key="default_field.name">
            <el-col :class="(default_field.required) ? 'remote_field is-required' : 'remote_field'">
                <label class="el-form-item__label">{{default_field.label}}</label>
            </el-col>
            <el-col class="local_field">
                <div style="position: relative; margin-bottom: 15px;">
                    <field-general
                        :editorShortcodes="editorShortcodes"
                        v-model="settings.default_fields[default_field.name]"
                    ></field-general>
                    <error-view field="default_fields" :errors="errors"></error-view>
                </div>
            </el-col>
        </el-row>
        <el-row class="wpf_merge_fields_table_row" v-for="(field_name, field_index) in merge_fields" :key="field_name">
            <el-col class="remote_field">
                <label class="el-form-item__label">{{ field_name }}</label>
            </el-col>
            <el-col class="local_field">
                <field-general
                    :editorShortcodes="editorShortcodes"
                    v-model="merge_model[field_index]"
                ></field-general>
            </el-col>
        </el-row>
    </div>
</template>

<script type="text/babel">
    import ErrorView from './errorView';
    import FieldGeneral from './_FieldGeneral'

    export default {
        name: 'field_maps',
        components: {
            ErrorView,
            FieldGeneral
        },
        props: ['settings', 'merge_fields', 'field', 'errors', 'merge_model', 'inputs', 'editorShortcodes', 'required'],
        data() {
            return {
                appReady: false
            }
        },
        mounted() {
            if (Array.isArray(this.merge_model) || !this.merge_model) {
                this.$emit('setMergeModelObj');
            }
            this.appReady = true;
        }

    };
</script>
