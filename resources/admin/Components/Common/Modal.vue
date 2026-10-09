
<template>
    <div>
        <el-dialog :title="title" :visible="dialogVisible" :width="dialogWidth" :before-close="handleClose">
            <slot></slot>
            <slot name="footer"></slot>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
        dialogWidth: {
            type: String,
            default: '50%'
        }
    },
    methods: {
        handleClose(done) {
            this.$emit('close');
            done();
        }
    }
}
</script>

