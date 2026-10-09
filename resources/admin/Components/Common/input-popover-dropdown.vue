<template>
    <div>
        <el-popover
            class="wpf-popover"
            ref="input-popover1"
            placement="right"
            popper-class="el-dropdown-list-wrapper"
            v-model="visible"
            trigger="click">
            <div class="el_pop_data_group">
                <div  class="el_pop_data_headings">
                    <ul>
                        <li
                            v-for="(item,item_index) in data"
                            :data-item_index="item_index"
                            :class="(activeIndex == item_index) ? 'active_item_selected' : ''"
                            @click="activeIndex = item_index" :key="item_index">
                            {{item.title}}
                        </li>
                    </ul>
                </div>
                <div class="el_pop_data_body">
                    <ul v-for="(item,current_index) in data" v-show="activeIndex == current_index" :class="'el_pop_body_item_'+current_index" :key="current_index">
                        <li v-if="item.placeholders.length === 0"><span style="font-size: medium">No Item To Select</span></li>
                        <li v-else @click="insertShortcode(code.tag)" v-for="code in item.placeholders" :key="code.tag"><span class="wpf_lead-title">{{code.label}}</span><span class="wpf_lead-text">{{code.tag}}</span></li>
                    </ul>
                </div>
            </div>
        </el-popover>
        <el-button v-if="buttonText" class="pop-over-btn"
            v-popover:input-popover1
            v-html="buttonText"
        />
        <span v-else v-popover:input-popover1 style="cursor: pointer;"><Icon icon="wpf-grid-view" style="width: 13px;"/></span>
    </div>
</template>

<script>
    import Icon from '../Icons/Index.vue';
    export default {
        name: 'inputPopoverDropdown',
        components: {
            Icon
        },
        props: {
            data: Array,
            close_on_insert: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            buttonText: {
                type: String,
                default() {
                    return '';
                }
            },
            btnType: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data() {
          return {
              activeIndex: 0,
              visible: false,
          }
        },
        methods: {
            insertShortcode(code) {
                this.$emit('command', code);
                if(this.close_on_insert) {
                    this.visible = false;
                }
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>

    // .el-popover{
    //     top: 48px !important;
    // }
    .el-dropdown-list-wrapper {
        padding: 0;
        width: fit-content !important;
        .group-title {
            display: block;
            padding: 5px 10px;
            background-color: gray;
            color: #fff;
        }
    }

    .input-textarea-value {
        position: relative;

        .icon {
            position: absolute;
            right: 0;
            top: -18px;
            cursor: pointer;
        }
    }
    .el_pop_data_group {
        overflow: hidden;
        display: flex;
        gap: 20px;
        .el_pop_data_headings {
            min-width: 170px;
            background: #f2f2f2;
            float: left;
            padding: 12px;
            border-radius: 8px;
            ul {
                padding: 0;
                margin: 10px 0px;
                li {
                    padding: 5px 10px 5px 10px;
                    display: block;
                    margin-bottom: 4px;
                    font-size: 15px;
                    color: #1E1F21;
                    cursor: pointer;
                    &.active_item_selected {
                        margin-bottom: 4px;
                        border-radius: 8px;
                        background-color: #5a5a5a;
                        color: #ffffff;
                        padding: 8px;
                    }
                }
                li:not(:last-child) {
                    border-bottom: 1px solid #d6d5d5;
                }
            }
        }

        .el_pop_data_body {
            float: left;
            background: white;
            width: 280px;
            max-height: 388px;
            overflow: auto;
            ul {
                padding: 10px 0;
                margin: 0;
                li {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    cursor: pointer;
                    text-align: left;
                    .wpf_lead-title{
                        font-size: 15px;
                        display: block;
                        color: #1E1F21;
                        transition: 0.2s;
                        font-weight: 500;
                    }
                    .wpf_lead-text{
                        font-size: 13px;
                        color:#606266;
                    }
                    &:hover {
                        background: white;
                    }
                    span {
                        font-size: 11px;
                        color: #8e8f90;
                    }
                }
                li:not(:last-child) {
                    padding-bottom: 12px;
                    margin-bottom: 12px;
                    border-bottom: 1px solid #ececec;
                }
            }
        }
    }
</style>