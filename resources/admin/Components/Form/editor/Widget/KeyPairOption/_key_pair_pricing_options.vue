<template>
    <div>
        <div class="key_pair_table_wrapper">
            <table class="ninja_filter_table pricing_options_length_customize" style="width: -webkit-fill-available;">
                <thead>
                    <tr>
                        <th style="width: 40px;"></th>
                        <th v-if="enableImage == 'yes'" style="width: 70px;">Photo</th>
                        <th>Item Name</th>
                        <th style="width: 90px;">Item Price</th>
                        <th style="width: 60px;"></th>
                    </tr>
                </thead>
                <draggable
                    :options="{handle:'.handle'}"
                    :list="item"
                    :element="'tbody'"
                >
                    <tr v-for="(filter, index) in item" :key="index">
                        <td style="text-align: center">
                            <!-- <span class="dashicons dashicons-editor-justify handle"></span> -->
                            <span style="margin-top: 10px" class="handle">
                                <img :src="assetsUrl('/images/table/cell-icon.svg')" alt="Not Found">
                            </span>
                        </td>
                        <td v-if="enableImage == 'yes'">
                                <photo-widget :product="filter" />
                        </td>
                        <td>
                            <el-input size="mini" v-model="filter.label"
                                    type="text" placeholder="Item Name"></el-input>
                        </td>
                        <td>
                            <el-input-number size="mini" v-model="filter.value" :min="0"></el-input-number>
                        </td>
                        <td>
                            <el-button :disabled="item.length == 1" @click="deleteItem(index)" size="mini">
                                <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                                    <Icon icon="wpf-delete" />
                                </el-tooltip>
                            </el-button>
                            <!-- <el-button @click="add()" v-show="(index + 1) == item.length" type="success" size="mini">+
                            </el-button> -->
                        </td>
                    </tr>
                </draggable>
            </table>
        </div>
        <div class="wpf_add_item position_customize">
            <a :underline="false" @click="add()">
                <Icon icon="wpf-black-add" /> <span>Add More</span>
            </a>
        </div>
    </div>
</template>
<script type="text/babel">
    import draggable from 'vuedraggable'
    import PhotoWidget from '../PhotoWidget/_photo_widget';
    import Icon from '../../../../Icons/Index.vue';


    export default {
        name: 'key_pair_options',
        components: { draggable, PhotoWidget, Icon },
        props: ['value','enableImage'],
        data() {
            return {
                value_option: false,
                item: [{}]
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
            deleteItem(index) {
                this.item.splice(index, 1);
            },
            add() {
                this.item.push({
                    label: '',
                    value: ''
                });
            },
            assetsUrl(path) {
                return window.wpPayFormsAdmin.assets_url + path;
            },
        },
        mounted() {
            if (!this.value[0].photo && this.enableImage =='yes'){
                return
            }

            if (this.value) {
                this.item = JSON.parse(JSON.stringify(this.value));
            }

        }
    }
</script>

<style lang="scss" scoped>
.enableImageContainer{
    float: left;
}
.key_pair_table_wrapper {
    border: 1px solid #D6DAE1;
	border-radius: 8px;
	overflow: hidden;
    width: fit-content;
}
</style>
