<template>
    <div>
        <el-button @click="dialogTableVisible = true" size="small">view entry data</el-button>
        <el-dialog width="60%" title="Subscription Entry List" :visible.sync="dialogTableVisible">
            <el-table :data="related_payments">
                <el-table-column property="created_at" label="Created At" width="250"></el-table-column>
                <el-table-column property="payment_method" label="Payment Method" width="300"></el-table-column>
                <el-table-column property="payment_total_text" label="Payment Total"></el-table-column>
                <!-- <el-table-column property="address" label="Address"></el-table-column> -->
                <el-table-column property="status" label="Status"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'SubscriptionEntryModal',
    props: {
        related_payments: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            dialogTableVisible: false,
        }
    },
    mounted() {
        this.related_payments?.map(( subscription_entry, subscription_index)  => {
            let payment_total = subscription_entry?.payment_total/ 100 + ' ' + subscription_entry?.currency?.toUpperCase();
            this.$set(this.related_payments[subscription_index], 'payment_total_text', payment_total);
        })
    },
}

</script>