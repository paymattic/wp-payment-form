<template>
    <div class="dropdown_label_repeater">
        <table v-if="!loading" class="ninja_filter_table wpf_dropdown_label_repeater">
            <thead>
            <tr>
                <th>{{field.field_label || 'Field Label'}}</th>
                <th>{{field.value_label || 'Field Value'}}</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, itemIndex) in settings[field.key]" :key="'item_'+itemIndex">
                <td>
                    <el-input size="medium" :placeholder="field.field_label || 'Field Label'" v-model="item.label"></el-input>
                </td>
                <td>
                    <field-general
                        :editorShortcodes="editorShortcodes"
                        v-model="item.item_value"
                        class="wpf_input_shortcode"
                    ></field-general>
                </td>
                <td>
                    <!-- <el-button-group>
                        <el-button size="medium" type="success" @click="addItemAfter(itemIndex)">+</el-button>
                        <el-button size="medium" type="danger" :disabled="settings[field.key].length == 1" @click="removeItem(itemIndex)">-</el-button>
                    </el-button-group> -->
                    <el-button :disabled="settings[field.key].length == 1" @click="removeItem(itemIndex)" size="mini">
                        <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                            <Icon icon="wpf-delete" />
                        </el-tooltip>
                    </el-button>
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
        name: 'dropdown_label_repeater',
        props: ['settings', 'field', 'inputs', 'errors', 'editorShortcodes'],
        components: {
            FieldGeneral,
            Icon
        },
        data() {
          return {
              loading: false
          }
        },
        methods: {
            addItemAfter() {
                this.loading = true;
                this.settings[this.field.key].push({
                    item_value: '',
                    label: ''
                });
                this.$nextTick(() => {
                    this.loading = false;
                });
            },
            removeItem(index) {
                this.loading = true;
                this.settings[this.field.key].splice(index, 1);
                this.$nextTick(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>