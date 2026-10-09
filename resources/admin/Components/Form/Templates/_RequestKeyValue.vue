<template>
    <div> 
      <!--Request Headers-->
    <template slot="label">
        Request Headers
        <el-tooltip class="item" placement="bottom-start" effect="light">
        <div slot="content">
            <h3>Request Headers</h3>
            <p>Setup the HTTP headers to be sent with the webhook request.</p>
        </div>
        <i class="el-icon-info el-text-info"></i>
        </el-tooltip>
    </template>
  
    <table width="100%" v-if="editing_item">
        <thead>
        <tr>
        <th class="text-left" width="50%">{{ field.keys[0] }}</th>
        <th class="text-left">{{ field.keys[1] }}</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(headerValue, headerKey) in settings[field.key]">
                <td v-if="field.key == 'request_headers'">
                    <el-select
                        clearable
                        style="width:80%"
                        :placeholder="field.placeholders[0]"
                        v-if="!editing_item.custom_header_keys[headerKey]"
                        v-model="settings[field.key][headerKey].key"
                        @change="addCustomHeaderKeyInput(headerKey, $event)"
                        >
                    <el-option
                        v-for="(header, index) in editing_item.options"
                        :value="header.value"
                        :label="header.label"
                        :key="index"
                    ></el-option>
                    </el-select>

                    <el-input
                        style="width:81%"
                        placeholder="Enter Header Name (e.g. X-Custom-Header)"
                        v-if="editing_item.custom_header_keys[headerKey]"
                        v-model="settings[field.key][headerKey].key"
                        @input="sanitizeHeaderKey(headerKey)">
                      <el-button
                          slot="append"
                          icon="el-icon-close"
                          @click="hideCustomHeaderKeyInput(headerKey)"></el-button>
                    </el-input>
                </td>
                <td v-if="field.key == 'selected_request_fields'"> 
                    <el-input
                        style="width:80%"
                        :placeholder="field.placeholders[0]"
                        v-model="settings[field.key][headerKey].key">
                    </el-input>
                </td>
                <td>
                    <el-select
                        clearable
                        style="width:80%"
                        :placeholder="field.placeholders[1]"
                        class="action-add-field-select"
                        v-if="!editing_item.custom_header_values[headerKey]"
                        v-model="settings[field.key][headerKey].value"
                        @change="addCustomHeaderValueInput(headerKey, $event)">
                        <el-option-group
                            v-for="group in getHeaderShortCodes(headerKey)"
                            :key="group.title"
                            :label="group.title">
                            <el-option
                                v-for="(value, index) in group.placeholders"
                                :value="value.tag"
                                :label="value.label"
                                :key="index"
                            ></el-option>
                        </el-option-group>
                    </el-select>

                    <el-input
                        style="width:81%"
                        placeholder="Enter Value"
                        v-if="editing_item.custom_header_values[headerKey]"
                        v-model="settings[field.key][headerKey].value">
                    <el-button
                        slot="append"
                        icon="el-icon-close"
                        @click="hideCustomHeaderValueInput(headerKey)"></el-button>
                    </el-input>

                    <span class="action-add-field-row">
                        <i
                            @click="addFieldRow(headerKey)"
                            style="cursor:pointer"
                            class="el-icon-circle-plus el-text-success"></i>

                        <i
                            @click="removeHeaderRow(headerKey)"
                            style="cursor:pointer"
                            class="el-icon-circle-close el-text-danger"
                            v-if="settings[field.key].length > 1"></i>
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-if="field.key === 'request_headers' && editing_item.custom_header_keys && editing_item.custom_header_keys.some(Boolean)"
         style="margin-top:6px;font-size:12px;color:#E6A23C;">
      <i class="el-icon-warning"></i>
      Header names cannot contain spaces — use hyphens (e.g. <code>X-Custom-Header</code>). Spaces are replaced automatically.
    </div>

      <!-- Conditional Logics -->
  
      <!-- <el-button :loading="saving" @click="saveWebHook" type="primary" class="wpf_new_ui_button" size="medium">
        <span v-if="selected_id">Update WebHook Feed</span>
        <span v-else>Create WebHook Feed</span>
      </el-button>
   -->
    </div>
  </template>
  
  <script>
  
  import inputPopover from './input-popover.vue';
  import Errors from "../../../../common/Errors";
  import ErrorView from './errorView.vue';
  import FilterFields from './FilterFields.vue';
  
  export default {
    name: "RequestKeyValue",
    components: {
      ErrorView,
      inputPopover,
      FilterFields
    },
    props: [
            'settings',
            'field',
            'inputs',
            'request_headers',
            'form_id',
            'editor_shortcodes'
        ],
    data() {
      return {
        header_shortcodes: [],
        errors: new Errors(),
        editing_item: false,
        saving: false,
        has_pro: window.wpPayFormsAdmin.has_pro,
        loading: true,
      }
    },
    methods: {
      loadApp() {

          this.editing_item = Object.assign({}, this.editing_item, this.field);
          for (let i = 0, l = this.settings[this.field.key].length; i < l; i++) {
            this.header_shortcodes[i] = this.cloneheaderShortCodes();
          }
          this.editing_item.options.push({
              'label': 'Add Custom Header',
              'value': '__webhook_custom_header__'
            });
          var predefinedKeys = (this.editing_item.options || [])
            .filter(function(o) { return o.value !== '__webhook_custom_header__'; })
            .map(function(o) { return o.value; });
          this.$set(this.editing_item, 'custom_header_keys', this.settings[this.field.key].map(function(h) {
            return !!(h.key && predefinedKeys.indexOf(h.key) === -1);
          }));
          this.$set(this.editing_item, 'custom_header_values', this.settings[this.field.key].map(() => false));
          // Sanitize only request_headers — not selected_request_fields or other field types
          if (this.field.key === 'request_headers') {
            this.settings[this.field.key].forEach((header, index) => {
              if (header.key && /\s/.test(header.key)) {
                this.$set(this.settings[this.field.key], index, {
                  ...header,
                  key: header.key.replace(/\s+/g, '-')
                });
              }
            });
          }
        },
        addFieldRow(mapIndex) {
            let index = mapIndex + 1;
            this.settings[this.field.key].splice(index, 0, {
            key: null,
            value: null
            });
            this.editing_item.custom_header_keys.splice(index, 0, false);
            this.editing_item.custom_header_values.splice(index, 0, false);
            this.header_shortcodes[index] = this.cloneheaderShortCodes();
        },
        removeFieldRow(mapIndex) {
            this.settings[this.field.key].splice(mapIndex, 1);
        },
        addHeaderRow(headerKey) {
            let index = headerKey + 1;
            this.settings[this.field.key].splice(index, 0, {
            key: null,
            value: null
            });
            this.editing_item.custom_header_keys.splice(index, 0, false);
            this.editing_item.custom_header_values.splice(index, 0, false);
    
            this.header_shortcodes[index] = this.cloneheaderShortCodes();
        },
        removeHeaderRow(headerKey) {
            this.settings[this.field.key].splice(headerKey, 1);
            this.editing_item.custom_header_keys.splice(headerKey, 1);
            this.editing_item.custom_header_values.splice(headerKey, 1);
    
            this.header_shortcodes.splice(headerKey, 1);
        },
        sanitizeHeaderKey(headerKey) {
          const raw = this.settings[this.field.key][headerKey].key || '';
          const sanitized = raw.replace(/\s+/g, '-');
          if (sanitized !== raw) {
            this.$set(this.settings[this.field.key], headerKey, {
              ...this.settings[this.field.key][headerKey],
              key: sanitized
            });
          }
        },
        addCustomHeaderKeyInput(headerKey, val) {
            if (val === "__webhook_custom_header__") {
                this.editing_item.custom_header_keys.splice(headerKey, 1, true);
                this.$set(this.settings[this.field.key], headerKey, {
                    key: null,
                    value: this.settings[this.field.key][headerKey].value
                });
            }
        },
        hideCustomHeaderKeyInput(headerKey) {
            this.editing_item.custom_header_keys.splice(headerKey, 1, false);
            this.$set(this.settings[this.field.key], headerKey, {
                key: null,
                value: this.settings[this.field.key][headerKey].value
            });
        },
        addCustomHeaderValueInput(headerKey, val) {
            if (this.settings[this.field.key][headerKey].value === "custom") {
                this.editing_item.custom_header_values.splice(headerKey, 1, true);
                this.settings[this.field.key][headerKey].value = null;
            }
        },
        hideCustomHeaderValueInput(headerKey) {
            this.editing_item.custom_header_values.splice(headerKey, 1, false);
            this.settings[this.field.key][headerKey].value = '';
        },
        getHeaderShortCodes(headerKey) {
            return this.header_shortcodes[headerKey];
        },
        cloneheaderShortCodes() {
            return this.headerShortCodes.map(item => Object.assign({}, item));
        }
    },
    computed: {
      headerShortCodes() {
        // Get a copy of editor_Shortcodes (An array of objects)
        let shortCodes = this.editor_shortcodes.map(o => Object.assign({}, o));
        shortCodes.push({title:'Custom Value', placeholders:{
            "Add Custom Value": {label: "Add Custom Value", tag: "custom"}
          }});
        return shortCodes;
      }
    },
    created() {
      this.loadApp();
    }
  }
  </script>
  
  <style scoped>
  
  </style>