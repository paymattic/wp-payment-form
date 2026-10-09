<template>
    <div class="key_pair_table_wrapper">
        <div style="margin-bottom: 15px" class="keypair_header">
            <el-checkbox v-model="value_option">View/Edit Value {{ hasPriceColumn() ? '& Extra Price' : '' }}
                Separately</el-checkbox>
            <!-- <el-button v-if="hide_bulk_action !== true" style="float: right" @click="initBulkEdit()" size="medium">Bulk Edit</el-button> -->
        </div>
        <div class="wpf_table_element">
            <slot></slot>
            <table class="ninja_filter_table">
                <thead>
                    <tr>
                        <th class="th_first_child_customize"></th>
                        <th>
                            <div style="display: flex; text-align: start;">
                                <span v-show="!value_option" style="width: 100%;">
                                    Label
                                </span>
                                <span v-show="value_option" style="width: 50%;">
                                    Label
                                </span>
                                <span v-show="value_option" style="width: 50%;">
                                    Value
                                </span>
                            </div>
                        </th>
                        <!-- <th v-show="value_option">Value</th> -->
                        <th v-show="value_option && hasPriceColumn()">Extra Price</th>
                        <th v-if="hide_bulk_action !== true" class="th_last_child_customize" @click="initBulkEdit()">
                            <Icon icon="wpf-edit" />
                            Bulk Edit
                        </th>
                        <th v-else=""></th>
                    </tr>
                </thead>
                <draggable :options="{ handle: '.handle' }" :list="item" :element="'tbody'">
                    <tr v-for="(filter, index) in item">
                        <td class="td_first_child_customize">
                            <span style="margin-top: 10px" class="handle">
                                <img :src="assetsUrl('/images/table/cell-icon.svg')" alt="Not Found">
                            </span>
                        </td>
                        <td>
                            <div style="display: flex; gap: 15px;">
                                <span v-show="!value_option" style="width: 100%;">
                                    <el-input @blur="changeFilterLabel(filter)" size="mini" placeholder="Label" v-model="filter.label"
                                        type="text">
                                    </el-input>
                                </span>
                                <span v-show="value_option" style="width: 50%;">
                                    <el-input placeholder="Label" size="mini" v-model="filter.label" type="text"></el-input>
                                </span>
                                <span v-show="value_option" style="width: 50%;">
                                    <el-input placeholder="Value" size="mini" v-model="filter.value" type="text"></el-input>
                                </span>
                            </div>
                        </td>
                        <!-- <td v-show="value_option">
                        <el-input size="mini" v-model="filter.value" type="text"></el-input>
                    </td> -->
                        <td style="min-width: 100px;" v-show="value_option && hasPriceColumn()">
                            <el-input size="mini" v-model="filter.price" type="text"></el-input>
                        </td>
                        <td class="td_last_child_customize">
                            <el-button :disabled="item.length == 1" @click="deleteItem(index)">
                                <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                                    <Icon icon="wpf-delete" />
                                </el-tooltip>
                            </el-button>
                            <!-- <el-button @click="add(hasPriceColumn(filter))" v-show="(index + 1) == item.length"
                            type="success" size="mini">+
                        </el-button> -->
                        </td>
                    </tr>
                </draggable>
            </table>
        </div>

        <div class="wpf_add_item">
            <a :underline="false" @click="add(hasPriceColumn())">
                <Icon icon="wpf-black-add" /> <span>Add More</span>
            </a>
        </div>

        <el-dialog :append-to-body="true" class="backdrop" title="Edit your options" :visible.sync="bulkEditVisible">
            <div class="bulk_editor_wrapper">
                <h4>Please provide the value as LABEL:VALUE as each line.</h4>
                <el-input type="textarea" :rows="5" v-model="value_key_pair_text"></el-input>
                <p>You can simply give value only the system will convert the label as value</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="bulkEditVisible = false">Cancel</el-button>
                <el-button size="mini" type="primary" @click="confirmBulkEdit()">Confirm</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script type="text/babel">
import draggable from 'vuedraggable'
import each from 'lodash/each';
import Icon from '../../../../Icons/Index.vue';
export default {
    name: 'key_pair_options',
    components: { draggable, Icon },
    props: ['value', 'hide_bulk_action', 'has_price_column'],
    data() {
        return {
            value_option: false,
            item: [{}],
            bulkEditVisible: false,
            value_key_pair_text: ''
        }
    },
    watch: {
        item: {
            handler() {
                this.$emit('update:value', JSON.parse(JSON.stringify(this.item)));
            },
            deep: true
        }
    },
    methods: {
        assetsUrl(path) {
            return window.wpPayFormsAdmin.assets_url + path;
        },
        deleteItem(index) {
            this.item.splice(index, 1);
        },
        hasPriceColumn() {
            return this.has_price_column;
        },
        add(hasPrice) {
            if (hasPrice) {
                this.item.push({
                    label: '',
                    value: '',
                    price: ''
                });
                return;
            }
            this.item.push({
                label: '',
                value: ''
            });
        },
        changeFilterLabel(filter) {
            if (!this.value_option) {
                filter.value = JSON.parse(JSON.stringify(filter.label));
            }
        },
        initBulkEdit() {
            let astext = '';
            each(this.item, (item, index) => {
                astext += item.label;
                if (astext) {
                    astext += ':' + item.value;
                }
                astext += String.fromCharCode(13, 10);
            });
            this.value_key_pair_text = astext;
            this.bulkEditVisible = true
        },

        confirmBulkEdit() {
            let lines = this.value_key_pair_text.split('\n');
            let values = [];
            each(lines, (line) => {
                let lineItem = line.split(':');
                let label = lineItem[0];
                let value = lineItem[1];
                if (!value) {
                    value = label;
                }
                if (label && value) {
                    values.push({
                        label: label,
                        value: value
                    });
                }
            });
            this.item = values;
            this.bulkEditVisible = false
        },
    },
    mounted() {
        if (this.value) {
            this.item = JSON.parse(JSON.stringify(this.value));
        }
    }
}
</script>
<style scoped>
.display-flex {
    display: flex;
    flex-wrap: wrap;
}
</style>