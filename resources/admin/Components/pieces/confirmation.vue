<template>
    <span>
        <el-popover
            ref="popover"
            placement="top"
            width="200"
            v-model="visible"
        >
            <slot name="info"></slot>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text"
                           @click="visible = false"
                >{{$t('cancel')}}</el-button>

                <el-button type="primary" size="mini"
                    @click="confirmAction"
                >{{$t('confirm')}}</el-button>
            </div>
        </el-popover>

        <span class="remove-btn" v-popover:popover>
            <slot name="icon">
                <slot></slot>
            </slot>
        </span>
    </span>
</template>

<script>
    export default {
        name: 'Confirmation',
        props: {
            plain: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                visible: false,
            };
        },
        methods: {
            confirmAction() {
                this.visible = false;
                this.$emit('on-confirm');
            }
        }
    };
</script>
