<template>
    <select
        value=""
        class="input-component"
        :disabled="field_options.disable"
    >
        <option
            v-for="(option_name, option_key) in field_options"
            :key="option_key"
            :value="option_name.value"
        >
            {{option_name.label}} <span v-if="isPaymentItem"> - {{currencySign + option_name.value}}</span>
        </option>
    </select> 
</template>
<script>
    export default {
        props: ['field_options', 'isPaymentItem', 'currencySign'],
        data() {
            return {
                model: this.value,
                radioLabelEdit: '',
                prevText : '',
            }
        },
    }
</script>
<style scoped lang="scss">
    // .input-component {
    //     display: block;
    //     width: 100% !important;
    //     max-width: 100% !important;
    //     padding: 8px;
    //     min-height: 45px;
    //     border: 1px solid #e4e7ea;
    // }
</style>
