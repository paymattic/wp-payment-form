<template>
    <div class="dropdown_label_repeater">
        <table class="ninja_filter_table wppayform-table">
            <thead>
            <tr>
                <th>{{rendered_labels.remote_text}}</th>
                <th>{{rendered_labels.local_text}}</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, itemIdex) in settings[field.key]" :key="'item_'+itemIdex">
                <td>
                    <el-select size="medium" v-model="item.label">
                        <el-option
                            v-for="(optionLabel, optionValue) in field.options"
                            :key="optionValue"
                            :label="optionLabel"
                            :value="optionValue"
                        ></el-option>
                    </el-select>
                </td>
                <td>
                    <field-general
                        :editorShortcodes="editorShortcodes"
                        v-model="item.item_value"
                    ></field-general>
                </td>
                <td>
                    <el-button-group>
                        <!-- <el-button size="mini" type="success" @click="addItemAfter(itemIdex)">+</el-button> -->
                        <el-button size="mini" :disabled="settings[field.key].length == 1" @click="removeItem(itemIdex)">
                            <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                                <Icon icon="wpf-delete" />
                            </el-tooltip>
                        </el-button>
                    </el-button-group>
                </td>
            </tr>
            </tbody>
            <div class="wpf_block-add_more" @click="addItemAfter()"> 
                <Icon icon="wpf-black-add"/>
                <span class="wpf_block-add_more-button">
                    Add More
                </span>
            </div>
        </table>
    </div>
</template>

<script type="text/babel">
    import FieldGeneral from './_FieldGeneral';
    import Icon from '../../Icons/Index.vue';

    export default {
        name: 'dropdown_many_fields',
        props: [
            'settings',
            'field',
            'inputs',
            'errors',
            'editorShortcodes'
        ],
        data() {
            return {
                rendered_labels: {
                    remote_text: this.field.remote_text || 'Field Label',
                    local_text: this.field.local_text || 'Field Value'
                }
            }
        },
        components: {
            FieldGeneral,
            Icon
        },
        methods: {
            addItemAfter(index) {
                this.settings[this.field.key].push({
                    item_value: '',
                    label: ''
                });
            },
            removeItem(index) {
                this.settings[this.field.key].splice(index, 1);
            }
        },
        mounted() {
            if(!this.settings[this.field.key] || !this.settings[this.field.key].length) {
                this.settings[this.field.key] = [
                    {
                        item_value: this.field,
                        label: ''
                    }
                ]
            }
        }
    }
</script>