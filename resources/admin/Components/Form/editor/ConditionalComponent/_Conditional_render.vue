<template>
    <div class="payment_options_settings" v-if="has_pro">
        <el-form-item label="Conditional Render">
            <el-radio-group v-model="condition_options.conditional_logic">
                <el-radio v-for="(label, type) in item.conditional_logic" :key="type" :label="type">{{ label }}
                </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item
            v-if="condition_options.conditional_logic == 'yes'"
            label="Condition Match"
        >
            <el-radio-group v-model="condition_options.conditional_type">
                <el-radio v-for="(label, type) in item.conditional_type" :key="type" :label="type">{{ label }}
                </el-radio>
            </el-radio-group>
        </el-form-item>
        <div
            v-if="condition_options.conditional_logic == 'yes'"
            class="pricing_key_pair_options">
            <el-form-item>
                <conditional-render-options
                    :all_elements="all_elements"
                    :value.sync="condition_options.options"
                    :current_item="current_item"
                ></conditional-render-options>
            </el-form-item>
        </div>
    </div>
</template>
<script type="text/babel">
    import ConditionalRenderOptions from './_Conditional_render_options.vue';
    export default {
        name: 'conditional_render_settings',
        props: ['item', 'condition_options','all_elements', 'current_item'],
        components: {
            ConditionalRenderOptions
        },
        data() {
            return {
                value1 : true,
                has_pro: window.wpPayFormsAdmin?.has_pro,
                radio: 1,
                condition:''
                
            }
        },
        mounted() {
            this.condition = this.condition_options.conditional_logic;
        },
    }
</script>