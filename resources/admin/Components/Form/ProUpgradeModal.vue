<template>
    <el-dialog
        title="Premium features"
        :visible.sync="isVisible"
        :before-close="handleClose"
        width="50%"
    >
        <div style="text-align: center;">
            <div
                style="min-height: 50px"
                element-loading-spinner="el-icon-loading"
                v-loading="fetching"
                class="field_group_body dragArea"
            >
                <el-button
                    v-for="(component,componentIndex) in disabledMessage"
                    :key="'item_'+componentIndex"
                    size="mini"
                    :data-item_name="component.editor_title"
                    type="plain"
                    v-bind:style="{ 'margin-bottom' : '10px', 'margin-left' : '1px', 'opacity': '0.5' }"
                    class="wpf_element_items wpf_item_payment item_active"
                >
                    <img :src="renderIcons(component)" width="32" alt="">
                    <span class="field_title">{{ component.editor_title }}</span>
                </el-button>
            </div>
            <div class="payform_upgrade_section">
                <h4>Customized your form with pro version</h4>
                <a
                    target="_blank"
                    :href="pro_purchase_url"
                    class="el-button el-button--medium el-button--danger"
                >Upgrade To Pro version
                </a>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props:['isVisible', 'disabledMessage', 'fetching'],
        methods: {
            renderIcons(component) {
                let path = component.postion_group + '/' + component.type + '.svg'
                return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
            },
            handleClose() {
                this.$emit('close-pro-modal');
            }
        },
    }
</script>