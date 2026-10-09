<template>
    <div class="item_selector">
        <el-select size="mini" v-model="field_options[item_name]">
            <el-option v-for="element in productElements" :key="element.id" :value="element.id" :label="element.label"></el-option>
        </el-select>
    </div>
</template>
<script type="text/babel">
    import each from 'lodash/each';
    export default {
        name: 'oneTimeProductSelectors',
        props: ['all_elements', 'field_options', 'item_name'],
        computed: {
            productElements() {
                let paymentFields = [];
                each(this.all_elements, (element) => {
                    if(element.is_payment_field) {
                        paymentFields.push({
                            id: element.id,
                            label: element.field_options.label || element.id
                        });
                    } else {
                        if(element.field_options && element.field_options.columns) {
                            each(element.field_options.columns, (column) => {
                                each(column.fields, (field) => {
                                    if(field.is_payment_field) {
                                        paymentFields.push({
                                            id: field.id,
                                            label: field.field_options.label || field.id
                                        })
                                    }
                                })
                            })
                        }
                    }
                });
                return paymentFields;
            }
        }
    }
</script>