<template>
    <div class="header">
        <span class="customers" @click="()=>{$router.push('/customers');}">
                {{ $t('Customers') }}
        </span>
        <i class="el-icon-arrow-right"></i>
        <span class="customer-email"> {{customer_email}} </span>
    </div>
</template>

<script>
export default {
    props: {
        customer_email: {
            type: String,
            required: true
        }
    }
}
</script>