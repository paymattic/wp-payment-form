<template>
    <div>
        <input
            v-model="model"
            :placeholder=" placeholder || 'Enter placeholder' "
            :disabled="visibility === 'no'"
            class="input-component"
        >
        </input>
    </div>    
</template>
<script>
    export default {
        props: ['value', 'visibility', 'placeholder'],
        data() {
            return {
                model: this.value
            }
        },
        watch: {
            model() {
                this.$emit('input', this.model);
            },
        },
    }
</script>
<style scoped>
    /* .input-component {
        display: block;
        width: 100% !important;
        max-width: 100% !important;
        padding: 8px;
        min-height: 45px;
        border: 1px solid #e4e7ea;
    } */
</style>
