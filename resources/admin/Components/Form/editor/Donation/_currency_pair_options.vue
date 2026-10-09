<template>
    <div class="payment_options_settings">
        <div v-if="fetched"> 
            <div class="pricing_key_pair_options">
                <el-form-item label="Switch Options">
                     <div>
                        <div class="key_pair_table_wrapper">
                            <table class="ninja_filter_table pricing_options_length_customize">
                                <thead>
                                    <tr>
                                        <th style="width: 40px;"></th>
                                        <th style="width: fit-content;">Currency</th>
                                        <th style="width: 50px;"></th>
                                    </tr>
                                </thead>
                                <draggable
                                    :options="{handle:'.handle'}"
                                    :list="items"
                                    :element="'tbody'"
                                >
                                    <tr v-for="(filter, index) in items" :key="index">
                                        <td style="text-align: center">
                                            <span class="dashicons dashicons-editor-justify handle"></span>
                                        </td>
                                        <td>
                                            <el-select v-model="filter.value" filterable>
                                                    <el-option 
                                                        v-for="([currencyKey, currencyName, disabled]) in currencies"
                                                        :key="currencyKey"
                                                        :label="currencyName"
                                                        :value="currencyKey"
                                                        :disabled="disabled"
                                                    >
                                                    </el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-button :disabled="items.length == 1" @click="deleteItem(index)" size="mini">
                                                <el-tooltip class="item" effect="dark" content="Delete" placement="top-start">
                                                    <Icon icon="wpf-delete" />
                                                </el-tooltip>
                                            </el-button>
                                            <!-- <el-button @click="add()" v-show="(index + 1) == items.length" type="success" size="mini">+
                                            </el-button> -->
                                        </td>
                                    </tr>
                                </draggable>
                            </table>
                        </div>
                        <div class="wpf_add_item position_customize">
                            <a :underline="false" @click="add()">
                                <Icon icon="wpf-black-add" /> <span>Add More</span>
                            </a>
                        </div>
                    </div>
                </el-form-item>
                <template>
                    <el-form-item label="Display Type">
                        <el-radio-group v-model="element.field_options.display_type">
                            <el-radio label="radio">Radio</el-radio>
                            <el-radio label="select">Select</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>
                <template>
                    <p style="color: #F98435; word-break: break-word;"> NB: It only works on donation item and Make sure you have Api key configured for currency switcher in <br/> <a href="admin.php?page=wppayform_settings"> Settings -> General Settings </a></p>
                </template>
            </div>
        </div>

    </div>
</template>
<script type="text/babel">
    import draggable from 'vuedraggable'
    import Icon from '../../../Icons/Index.vue'
    export default {
        name: 'currency_pair_options',
        props: ['element','item','value','currency_list'],
        components: {
            draggable,
            Icon
        },
        data() {
            return {
                value1: true,
                currencies: [],
                primary_currency: '',
                courseLoaded: false,
                selectedCourse: [],
                items: [],
                saved_lms_data: {},
                fetched: false,
                currency_convirsion_api_key: '',
            }
        },
        watch: {
            items: {
                handler() {
                    this.populateItemsWithCurrencyLabel();
                    this.$emit('update:value', JSON.parse(JSON.stringify(this.items)));
                    // this.$emit('populateCurrencySwitcher', this.element.field_options['which_lms']);
                },
                deep: true
            }
        },
        methods: { 
            getCurrencies() {
                this.$get(`forms/settings/currencies`, {})
                    .then(response => {
                        this.currencies = Object.entries(response.currencies).map(([currencyCode, currencyName]) => {
                            return [currencyCode, currencyName, false];
                        });
                        this.primary_currency = response.currency_settings.currency
                        this.currency_convirsion_api_key = response.currency_settings.currency_conversion_api_key
                    })
                    .fail(error => {
                         this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.fetched = true;
                    })
            },
            deleteItem(index) {
                this.items.splice(index, 1);
            },
            add() {
                //make already selected course disabled
                this.items.push({
                    label: '',
                    value: '',
                });
            },
            populateItemsWithCurrencyLabel() {
                for (let index in this.currencies) {
                    let currency = this.currencies[index];
                    let currencyName = currency[1];
                    this.currencies[index][2] = false;
                    for (let item of this.items) {
                        if (item.value == currency[0]) {
                            item.label = currencyName;
                            this.currencies[index][2] = true;
                        }
                    }
                }
            },
        },
        mounted() {
            this.getCurrencies();
            this.items = JSON.parse(JSON.stringify(this.value));
            if (this.items.length == 0) {
                this.add();
            }
        }
}
        
</script>
<style scoped>
.key_pair_table_wrapper {
    border: 1px solid #D6DAE1;
	border-radius: 8px;
	overflow: hidden;
    width: fit-content;
}
</style>
