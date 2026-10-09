<template>
  <div :class="wrapperClass" style="position: relative; width: 100%">
    <input
      @focus="togglePicker()"
      v-if="!value && label_edit === false"
      :placeholder="placeholder || 'Enter label'"
      style="border-width: 0 !important; border: none"
      class="editor_input"
    />
    <div class="wpf-label-editor" v-if="!label_edit">
      <label
        class="editable-lable"
        @click="focusInput()"
      >
        <div class="wpf_lable">
          {{ value }}
        </div>
        <Icon icon="wpf-edit" v-if="!label_edit" class="label-edit-wrap" />
      </label>
      <span v-if="required" style="color: red; margin-left: -3px;" >*</span>
      <!-- <span class="label-edit-wrap">
        <Icon v-if="!label_edit" class="label-edit-icon" @click="focusInput()"  icon="wpf-edit" />
      </span> -->
    </div>
    <!-- <input
      @focus="togglePicker()"
      v-if="!value && label_edit === false"
      :placeholder="placeholder || 'Enter label'"
      style="border-width: 0 !important; border: none"
      class="editor_input"
    /> -->
    <div v-if="isTextarea && label_edit" class="label_editor-width">
      <textarea
        v-if="label_edit"
        v-model="model"
        @blur="afterEdited()"
        ref="input_ref"
        class="editor_input"
        style="width: 100%"
      ></textarea>
    </div>
    <div v-if="!isTextarea && label_edit" class="label_editor-width">
      <div class="input-wrapper">
        <input
          v-model="model"
          @blur="afterEdited()"
          ref="input_ref"
          class="editor_input"
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Icon from "../../../Icons/Index.vue";
export default {
  components: {
    Icon,
  },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Number, String],
      default: 'Default Value for "value" prop',
    },
    nullable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "Default Placeholder",
    },
    isTextarea: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'Default Value for "layout" prop',
    },
    editLabel: {
      type: String,
      default: "click to edit",
    },
    wrapperClass: {
      type: String,
      default: "wpf-label-editor",
    },
  },
  data() {
    return {
      model: this.value,
      label_edit: false,
      storeValue: this.value,
    };
  },
  watch: {
    model() {
      this.$emit("input", this.model);
    },
    label_edit() {
      if (this.label_edit) {
        setTimeout(() => {
          this.$refs.input_ref.focus();
        }, 100);
      }
    },
  },
  methods: {
    afterEdited() {
      this.$emit("history_log");
      if (this.model === "" && this.nullable === false) {
        this.model = this.storeValue;
      }
      this.label_edit = false;
    },
    togglePicker() {
      this.label_edit = true;
    },
    focusInput() {
      this.label_edit = true;
    },
  },
};
</script>
<style scoped>
/* .wpf-label-editor {
  display: flex; align-items: center; gap: 10px;
} */
.input-wrapper {
  padding: 4px;
  border-bottom: 1px solid #D6DAE1;
  text-decoration: dotted;
  width: 100%;

}
.label_editor-width{
  width: calc(100% - 96px);
}
.editor_input {
  border-width: 0 !important;
  outline: none;
  min-width: 60px !important;
  background: inherit !important;
}
/* .editable-lable:hover + .label-edit-wrap {
  height: auto;
  opacity: 1;
  color: #f98435;
} */
.editable-lable {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}
.label-edit-wrap {
  height: 0;
  opacity: 0;
  color: #ff7518;
}
.label-edit-icon {
  &:hover {
    cursor: pointer;
  }
}
.step-form-label {
  .wpf-label-editor {
    justify-content: center;
    gap: 1px;
  }
  .input-wrapper  {
    width: 100%;
  }
}
</style>
