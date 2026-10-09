<template>
    <div class="field_general">
        <input-popover :fieldType="field_type"
            placeholder="Select a Field or Type Custom value"
            v-model="fieldValue"
            buttonText=''
            :data="editorShortcodes"
            style="width: 100%;"
        ></input-popover>
    </div>
</template>

<script type="text/babel">
    import inputPopover from './input-popover.vue';

    export default {
        name: 'fieldGeneral',
        components: {
            inputPopover
        },
        props: {
            value: [String, Number, Boolean, Array],
            editorShortcodes: {
                type: Array,
                default() {
                    return []
                }
            },
            field_type: {
                type: String,
                default: 'text'
            }
        },
        data() {
            return {
                fieldValue: this.value
            }
        },
        watch: {
            fieldValue() {
                this.$emit('input', this.fieldValue);
            }
        },
    }
</script>