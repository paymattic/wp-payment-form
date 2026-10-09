<template>
    <div class="wppayform_routing_fields" v-if="!disabled">
        <table class="wppayform_routing_table">
            <tbody>
                <tr v-for="(routing, key) in routings" :key="key">
                    <td>
                        <label class="wppayform_inline">
                            {{labels.input_label}}
                            <el-input v-if="input_type == 'text'" :placeholder="labels.input_placeholder" size="medium" v-model="routing.input_value"/>
                            <el-select size="medium" v-else-if="input_type == 'select'" v-model="routing.input_value" :placeholder="labels.input_placeholder">
                                <el-option
                                    v-for="(item,itemValue) in input_options"
                                    :key="itemValue"
                                    :label="item"
                                    :value="itemValue">
                                </el-option>
                            </el-select>
                        </label>
                    </td>
                    <td>
                        If
                    </td>
                    <td>
                        <el-select size="medium" v-model="routing.field" style="width: 100%" @change="routing.value = ''">
                            <el-option v-for="(field, key) in fields" :key="key"
                                        :label="field.admin_label || field.attributes.name" :value="field.element"
                            ></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select size="medium" v-model="routing.operator">
                            <el-option value="=" label="equal"></el-option>
                            <el-option value="!=" label="not equal"></el-option>
                            <template v-if="fields[routing.field] && !Object.keys(fields[routing.field].options).length">
                                <el-option value=">" label="greater than"></el-option>
                                <el-option value="<" label="less than"></el-option>
                                <el-option value=">=" label="greater than or equal"></el-option>
                                <el-option value="<=" label="less than or equal"></el-option>
                                <el-option value="contains" label="contains"></el-option>
                                <el-option value="doNotContains" label="do not contains"></el-option>
                                <el-option value="startsWith" label="starts with"></el-option>
                                <el-option value="endsWith" label="ends with"></el-option>
                            </template>
                        </el-select>
                    </td>
                    <td>
                        <el-select size="medium"
                                    v-if="fields[routing.field] && Object.keys(fields[routing.field].options).length"
                                    v-model="routing.value" style="width: 100%">
                            <el-option v-for="(label, value) in fields[routing.field].options" :key="value"
                                        :label="label" :value="value"
                            ></el-option>
                        </el-select>
                        <el-input size="medium" v-else placeholder="Enter a value" v-model="routing.value"></el-input>
                    </td>
                    <td style="padding-left: 8px;">
                        <div style="display: flex; align-items: center;" class="action-btns">
                            <!-- <span @click="remove(key)" v-if="routings.length > 1"><Icon icon="wpf-delete" class="wpf_action_block-delete"/></span>  -->
                            <el-button :disabled="routings.length == 1" @click="remove(key)" size="mini">
                                <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                                    <Icon icon="wpf-delete" />
                                </el-tooltip>
                            </el-button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <div class="wpf_block-add_more" @click="addAfter()"> 
                <Icon icon="wpf-black-add"/>
                <span class="wpf_block-add_more-button">
                    Add More
                </span>
            </div>
        </table>
    </div>
</template>

<script type="text/babel">
    // import ComingSoon from '../../modals/ItemDisabled';
    import Icon from '../../Icons/Index.vue';

    export default {
        name: 'RoutingFilterFields',
        components: {
            Icon
            // ComingSoon
        },
        props: {
            routings: {
                type: Array,
                required: true,
                default() {
                    return []
                }
            },
            fields: {
                type: Object,
                required: true,
                default() {
                    return {}
                }
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            labels: {
                default: () => ({
                    input_label: 'Send To',
                    input_placeholder: 'Email Address'
                })
            },
            input_type: {
                type: String,
                default: 'text'
            },
            input_options: {
                type: Object,
                required: false,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                defaultRules: {
                    input_value: '',
                    field: '',
                    operator: '=',
                    value: null
                },
                comingSoon: false,
            }
        },
        methods: {
            addAfter() {
                this.routings.push({...this.defaultRules});
                // this.routings.splice(index + 1, 0, {...this.defaultRules});
            },
            remove(index) {
                this.routings.splice(index, 1);
            }
        },
        mounted() {
            if (!this.routings || !this.routings.length) {
                this.routings.push({...this.defaultRules});
            }
        }
    };
</script>
