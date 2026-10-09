<template>
    <el-dialog
        :title="title"
        :visible.sync="showModal"
        width="55%"
        :before-close="resetModalState">
        <div class="modal_body wpf_payment_status_update">
            <p>{{$t('Current Payment Status')}}: <span>{{ editModel.status }}</span></p>
            <el-form ref="payment_status_form" :model="editModel" label-width="210px">
                <el-form-item :label="$t('New Payment Status')">
                    <el-radio-group v-model="editModel.status">
                        <el-radio v-for="(status, status_key) in available_payment_statuses" :key="status" v-show="status_key !=='abandoned'"
                            :label="status_key">{{status}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="Note">
                    <el-input type="textarea" :placeholder="$t('You may add a note for this status change (optional)')" size="mini" v-model="editModel.note">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="showModal = false" class="wpf_new_ui_button2">Cancel</el-button> -->
            <el-button @click="resetModalState">{{ $t('Cancel')}}</el-button>
            <el-button type="primary" @click="confirmMethod">{{ $t('Confirm')}}</el-button>
        </span>
    </el-dialog>
</template>
<script type="text/babel">

export default {
    name: "PaymentStatusModal",
    props: ['title', 'syncValue', 'confirmMethod', 'editModel', 'available_payment_statuses'],
    data() {
        return {
            showModal: this.syncValue
        }
    },
    methods: {
        resetModalState(){
            this.$emit('resetModalState');
        }
    }
}
</script>
<style scoped lang="scss">

.wpf_payment_status_update {

    p {
        margin: 0;
        color: #2F3448;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        padding-bottom: 20px;
        
        span {
            padding-left: 43px;
        }
    }
    .el-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}
</style>
