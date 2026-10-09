<template>
    <div class="wppayform_field_routing">
        <template>
            <el-select size="medium"
                v-if="field.simple_component == 'select'"
                :disabled="settings[field.routing_key] != 'simple'"
                filterable
                clearable
                :multiple="field.is_multiple"
                v-model="settings[field.key]"
                :placeholder="field.placeholder"
                >
                <el-option
                    v-for="(list_name, list_key) in field.options"
                    :key="list_key"
                    :value="list_key"
                    :label="list_name"
                ></el-option>
            </el-select>
            <el-input size="medium"
                :disabled="settings[field.routing_key] != 'simple'"
                v-model="settings[field.key]"
                :placeholder="field.placeholder"
                v-else-if="field.simple_component == 'text'"></el-input>
            <filed-general
                v-else-if="field.simple_component == 'value_text' && settings[field.routing_key] == 'simple'"
                :editorShortcodes="editorShortcodes"
                v-model="settings[field.key]"
            />
            <p v-if="settings[field.routing_key] == 'simple' && field.inline_tip">{{field.inline_tip}}</p>
        </template>
        <el-checkbox size="medium" v-model="settings[field.routing_key]" true-label="routing" false-label="simple">{{field.labels.choice_label}}</el-checkbox>

        <routing-filter-fields
            :routings="settings[field.settings_key]"
            :input_type="field.routing_input_type"
            :fields="inputs"
            :labels="field.labels"
            :input_options="field.options"
            v-if="settings[field.routing_key] == 'routing'" />
    </div>
</template>

<script type="text/babel">
    import RoutingFilterFields from './RoutingFilterFields';
    import FiledGeneral from './_FieldGeneral';

    export default {
        name: 'SelectionRouting',
        props: ['field', 'settings', 'inputs', 'editorShortcodes'],
        components: {
            RoutingFilterFields,
            FiledGeneral
        }
    }
</script>
<style lang="scss">
.wppayform_field_routing .el-select__tags
{
   .el-select__input{
        background-color: transparent !important;
        border: none !important;
        &:focus {
            border: none !important;
        }
    }
}
</style>
