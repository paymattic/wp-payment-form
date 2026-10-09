<template>
    <div class="wp-payment-form-editor__render-container">
        <splitpanes class="default-theme" @resized="resize($event)">
            <pane v-for="(column, index) in field_options.columns" :key="index" min-size="20"
                :size="field_options.columns[index].width <= 10 ? 10 : field_options.columns[index].width">
                <!-- <draggable style="height: 100%; width: 99%;" class="list-group" :list="column.fields" :group="{ name: 'nested', put: true }"> -->
                <draggable class="container-layout" v-model="column.fields" :group="{ name: 'nested', put: true }">
                    <div class="list-group-item " v-for="(field, containerFieldIndex) in column.fields" :key="containerFieldIndex">
                        <div class="field-item">
                            <FormFieldWrapper
                                v-if="checkValidField(field)"
                                :field_options="field.field_options"
                                :element="field"
                                :builder_elements="builder_elements"
                                @history_log="log"
                                :containerFieldIndex="containerFieldIndex"
                                :containerIndex="index"
                                :element_id="element.id"
                                @deleteItem="deleteItem"
                                @componentModalShow="componentModalShow"
                                :elementIndex="elementIndex"
                            />
                        </div>
                    </div>
                    <span class="add-field-item" @click="addFormFields(index, elementIndex)">
                        <i class="el-icon-plus"></i>
                    </span>
                </draggable>
            </pane>
        </splitpanes>
    </div>
</template>
<script type="text/babel">
import draggable from 'vuedraggable';
import { Splitpanes, Pane } from 'splitpanes';

import RenderComponent from './RenderComponent';

export default {
    name: "RenderContainer",
    components: {
        FormFieldWrapper: () => import('./FormFieldWrapper.vue'),
        draggable,
        Splitpanes,
        Pane,
    },
    props: {
        field_options: {
            type: Object,
            default: () => []
        },
        builder_elements: {
            type: Array,
            default: () => []
        },
        element: {
            type: Object,
            default: () => []
        },
        elementIndex: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
        };
    },
    methods: {
        log(data) {
            this.$emit('history_log', data);
        },
        checkValidField(field) {
            if (field?.type && field?.type !== 'container') {
                return true;
            }
            return false;
        },
        deleteItem( element, containerFieldIndex, containerIndex, element_id) {

            this.builder_elements?.map((item, index) => {
                console.log(item, index);
               if (item?.id == element_id) {
                     item?.field_options?.columns?.map((column, columnIndex) => {
                          if (columnIndex == containerIndex) {
                            column.fields.splice(containerFieldIndex, 1);
                          }
                     });
               }
            });
        },
        addFormFields(elementIndex, containerIndex) {
            this.$emit('show-form-fields', containerIndex, elementIndex);
        },
        componentModalShow(elementIndex = null, containerIndex, containerFieldIndex = null) {
            console.log('componentModalShow', elementIndex, containerIndex, containerFieldIndex);
            this.$emit('componentModalShow', elementIndex, containerIndex, containerFieldIndex);
        },
        resize(event) {
            this.field_options?.columns?.forEach((item, i) => {
                item.width = this.getNumber(event[i].size);
                console.log(item);
            })
        },
    }
}
</script>