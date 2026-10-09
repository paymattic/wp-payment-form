<template>
<div>
    <el-popover
        ref="input-popover"
        :placement="placement"
        width="200"
        popper-class="el-dropdown-list-wrapper"
        trigger="click">
            <ul class="el-dropdown-menu el-dropdown-list">
                <li v-for="(item, groupIndex) in data" :key="`${groupIndex}`">
                    <span v-if="data.length > 1" class="group-title" style="font-weight: 600;">{{ item.title }}</span>
                    <ul>
                        <li v-if="item.shortcodes == 0" style="padding: 5px 20px">No Item To Select</li>
                        <li v-else v-for="title, code in item.shortcodes"
                            @click="insertShortcode(code)"
                            class="el-dropdown-menu__item" :key="`${groupIndex}-${code}`">
                            {{ title }}
                        </li>
                    </ul>
                </li>
            </ul>
    </el-popover>

    <div v-if="fieldType == 'textarea'" class="textarea-container">
        <el-input size="medium" :placeholder="placeholder" type="textarea" v-model="model">
        </el-input>
        <span v-popover:input-popover class="textarea-suffix">
            <Icon icon="wpf-grid-view" style="width: 16px; padding: 4px"/>
        </span>
    </div>

    <el-input size="medium" :placeholder="placeholder" v-else v-model="model" :type="fieldType">
        <template #suffix>
            <span v-popover:input-popover style="cursor: pointer;"><Icon icon="wpf-grid-view" style="width: 16px; padding: 4px"/></span>
        </template>
    </el-input>
</div>
</template>

<script>
import Icon from '../../Icons/Index.vue';
export default {
    name: 'inputPopover',
    components: {
        Icon
    },
    props: {
        value : String,
        placeholder: {
            type: String,
            default: ''
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        icon: {
            type: String,
            default: 'el-icon-more'
        },
        fieldType: {
            type: String,
            default: 'text'
        },
        data: Array,
        attrName: {
            type: String,
            default: 'attribute_name'
        },
        buttonText: {
            type: String,
            default() {
                return 'Add Shortcodes <i class="el-icon-arrow-down el-icon--right"></i>';
            }
        },
    },
    data() {
        return {
            model: this.value,
        }
    },
    watch: {
        model() {
            this.$emit('input', this.model);
        }
    },
    methods: {
        insertShortcode(codeString) {
            if (this.model == undefined) {
                this.model = '';
            }
            this.model += codeString.replace(/param_name/, this.attrName);
        }
    }
}
</script>

<style scoped>
    .textarea-container {
        position: relative;
        display: inline-block;
        width: 100%;
    }

    .textarea-container .el-input__inner {
        padding-right: 50px; /* Adjust according to suffix width */
    }

    .textarea-suffix {
        position: absolute;
        right: 10px;
        top: 10px; /* Adjust according to your layout */
        color: #999;
    }
</style>