<template>
  <el-form v-if="editing_item" label-position="left" label-width="205px">
    <!--Name-->
    <el-form-item required>
      <template slot="label">
        Name
        <el-tooltip class="item" placement="bottom-start" effect="light">
          <div slot="content">
            <h3>Name</h3>
            <p>Enter a feed name to uniquely identify this setup.</p>
          </div>
          <i class="el-icon-info el-text-info"></i>
        </el-tooltip>
      </template>

      <el-input v-model="editing_item.name" placeholder="WebHook Feed Name"></el-input>
      <error-view field="name" :errors="errors"></error-view>
    </el-form-item>

    <!--Request URL-->
    <el-form-item required>
      <template slot="label">
        Request URL
        <el-tooltip class="item" placement="bottom-start" effect="light">
          <div slot="content">
            <h3>Request URL</h3>
            <p>Enter the URL to be used in the webhook request.</p>
          </div>
          <i class="el-icon-info el-text-info"></i>
        </el-tooltip>
      </template>

      <el-input v-model="editing_item.request_url" placeholder="WebHook URL"></el-input>
      <error-view field="request_url" :errors="errors"></error-view>
    </el-form-item>

    <!--Request Method-->
    <el-form-item>
      <template slot="label">
        Request Method
        <el-tooltip class="item" placement="bottom-start" effect="light">
          <div slot="content">
            <h3>Request Method</h3>
            <p>Select the HTTP method used for the webhook request.</p>
          </div>
          <i class="el-icon-info el-text-info"></i>
        </el-tooltip>
      </template>

      <el-select v-model="editing_item.request_method">
        <el-option
            v-for="method in request_methods"
            :value="method"
            :label="method"
            :key="method"
        ></el-option>
      </el-select>
    </el-form-item>

    <!--Request Format-->
    <el-form-item>
      <template slot="label">
        Request Format
        <el-tooltip class="item" placement="bottom-start" effect="light">
          <div slot="content">
            <h3>Request Format</h3>
            <p>Select the format for the webhook request.</p>
          </div>
          <i class="el-icon-info el-text-info"></i>
        </el-tooltip>
      </template>

      <el-select v-model="editing_item.request_format">
        <el-option
            v-for="format in ['FORM', 'JSON']"
            :value="format"
            :label="format"
            :key="format"
        ></el-option>
      </el-select>
    </el-form-item>

    <!--Request Header-->
    <el-form-item>
      <template slot="label">
        Request Header
        <el-tooltip class="item" placement="bottom-start" effect="light">
          <div slot="content">
            <h3>Request Header</h3>
            <p>Select with headers if any headers should be sent with the webhook request.</p>
          </div>
          <i class="el-icon-info el-text-info"></i>
        </el-tooltip>
      </template>

      <template>
        <el-radio v-model="editing_item.with_header" label="nop">No Headers</el-radio>
        <el-radio v-model="editing_item.with_header" label="yup">With Headers</el-radio>
      </template>
      <error-view field="with_header" :errors="errors"></error-view>
    </el-form-item>

    <!--Request Headers-->
    <el-form-item required v-if="editing_item.with_header=='yup'">
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

      <table width="100%">
        <thead>
        <tr>
          <th class="text-left" width="50%">Header Name</th>
          <th class="text-left">Header Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(headerValue, headerKey) in editing_item.request_headers">
          <td>
            <el-select
                clearable
                style="width:80%"
                placeholder="Select Header"
                v-if="!editing_item.custom_header_keys[headerKey]"
                v-model="editing_item.request_headers[headerKey].key"
                @change="addCustomHeaderKeyInput(headerKey, $event)"
               >
              <el-option
                  v-for="(header, index) in request_headers"
                  :value="header.value"
                  :label="header.label"
                  :key="index"
              ></el-option>
            </el-select>

            <template v-if="editing_item.custom_header_keys[headerKey]">
              <el-input
                  style="width:81%"
                  placeholder="Enter Header Name (e.g. X-Custom-Header)"
                  v-model="editing_item.request_headers[headerKey].key"
                  @input="sanitizeHeaderKey(headerKey)">
                <el-button
                    slot="append"
                    icon="el-icon-close"
                    @click="hideCustomHeaderKeyInput(headerKey)"></el-button>
              </el-input>
              <el-alert
                  style="margin-top:6px;width:81%;"
                  title="Header names cannot contain spaces. Use hyphens instead (e.g. X-Custom-Header). Spaces are replaced automatically."
                  type="warning"
                  :closable="false"
                  show-icon>
              </el-alert>
            </template>
          </td>
          <td>
            <el-select
                clearable
                style="width:80%"
                placeholder="Select Value"
                class="action-add-field-select"
                v-if="!editing_item.custom_header_values[headerKey]"
                v-model="editing_item.request_headers[headerKey].value"
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
                v-model="editing_item.request_headers[headerKey].value">
              <el-button
                  slot="append"
                  icon="el-icon-close"
                  @click="hideCustomHeaderValueInput(headerKey)"></el-button>
            </el-input>

            <span class="action-add-field-row">
                  <i
                      @click="addHeaderRow(headerKey)"
                      style="cursor:pointer"
                      class="el-icon-circle-plus el-text-success"></i>

                  <i
                      @click="removeHeaderRow(headerKey)"
                      style="cursor:pointer"
                      class="el-icon-circle-close el-text-danger"
                      v-if="editing_item.request_headers.length > 1"></i>
              </span>
          </td>
        </tr>
        </tbody>
      </table>
      <error-view :errors="errors" field="headers"></error-view>
    </el-form-item>
    <!-- Conditional Logics -->
    <el-form-item>
      <template slot="label">
        Conditional Logics

        <el-tooltip class="item" placement="bottom-start" effect="light">
          <div slot="content">
            <h3>Conditional Logics</h3>

            <p>Allow WebHook to take action conditionally</p>
          </div>

          <i class="el-icon-info el-text-info"/>
        </el-tooltip>
      </template>

      <FilterFields
          :fields="fields"
          :disabled="!has_pro"
          :conditionals="editing_item.conditionals"/>

    </el-form-item>

    <el-button :loading="saving" @click="saveWebHook" type="primary" class="wpf_new_ui_button" size="medium">
      <span v-if="selected_id">Update WebHook Feed</span>
      <span v-else>Create WebHook Feed</span>
    </el-button>

  </el-form>
</template>

<script>

import inputPopover from '../../Templates/input-popover.vue';
import Errors from "../../../../../common/Errors";
import ErrorView from '../../Templates/errorView.vue';
import FilterFields from '../../Templates/FilterFields.vue';

export default {
  name: "Editor",
  components: {
    ErrorView,
    inputPopover,
    FilterFields
  },
  props: {
    selected_index: {
      default() {
        return 1;
      }
    },
    form_id: {
      required: true
    },
    selected_id: {
      default() {
        return 0;
      }
    },
    setSelectedId: {
      type: Function,
      required: true
    },
    edit_item: {
      default() {
        return true;
      }
    },
    fields: {
      type: Object,
      required: true
    },
    request_headers: {
      type: Array,
      required: true
    },
    editor_shortcodes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      request_methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      header_shortcodes: [],
      errors: new Errors(),
      editing_item: false,
      saving: false,
      has_pro: window.wpPayFormsAdmin.has_pro,
    }
  },
  methods: {
    saveWebHook() {
      this.saving = true;
      let data = {
        form_id: this.form_id,
        notification_id: this.selected_id,
        notification: JSON.stringify(this.editing_item)
      };

      this.errors.record({});
      this.$post(`form/${this.form_id}/integrations/webhook`, {
        data: data
      })
          .then(response => {
            this.setSelectedId(response.data.notification_id);
            this.$notify.success({
              offset: 30,
              title: 'Success!',
              message: response.data.message,
              position: 'bottom-right'
            });
          })
          .fail(error => {
            this.errors.record(error.responseJSON.data.errors);
            this.$notify.error({
              offset: 30,
              title: 'Oops!',
              message: error.responseJSON.data.message,
              position: 'bottom-right'
            });
          })
          .always(() => this.saving = false);
    },
    loadApp() {
      if (this.edit_item) {
        this.editing_item = Object.assign({}, this.editing_item, this.edit_item);
        for (let i = 0, l = this.editing_item.request_headers.length; i < l; i++) {
          this.header_shortcodes[i] = this.cloneheaderShortCodes();
        }
        var predefinedKeys = (this.request_headers || []).map(function(h) { return h.value; });
        this.$set(this.editing_item, 'custom_header_keys', this.editing_item.request_headers.map(function(h) {
          return !!(h.key && predefinedKeys.indexOf(h.key) === -1);
        }));
        this.$set(this.editing_item, 'custom_header_values', this.editing_item.request_headers.map(() => false));
        // Sanitize existing header keys that contain spaces (saved before validation was added)
        this.editing_item.request_headers.forEach((header, index) => {
          if (header.key && /\s/.test(header.key)) {
            this.$set(this.editing_item.request_headers, index, {
              ...header,
              key: header.key.replace(/\s+/g, '-')
            });
          }
        });
      } else {
        this.header_shortcodes[0] = this.headerShortCodes;
        this.editing_item = {
          name: '',
          request_url: '',
          with_header: 'nop',
          request_method: 'GET',
          request_format: 'FORM',
          request_body: 'all_fields',
          custom_header_keys: [false],
          custom_header_values: [false],
          fields: [{key: null, value: null}],
          request_headers: [{key: null, value: null}],
          conditionals: {
            status: false,
            type: 'all',
            conditions: [
              {
                field: null,
                operator: '=',
                value: null
              }
            ]
          },
          enabled: true
        };
      }
    },
    addFieldRow(mapIndex) {
      let index = mapIndex + 1;
      this.editing_item.fields.splice(index, 0, {
        key: null,
        value: null
      });
    },
    removeFieldRow(mapIndex) {
      this.editing_item.fields.splice(mapIndex, 1);
    },
    sanitizeHeaderKey(headerKey) {
      const raw = this.editing_item.request_headers[headerKey].key || '';
      const sanitized = raw.replace(/\s+/g, '-');
      if (sanitized !== raw) {
        this.$set(this.editing_item.request_headers, headerKey, {
          ...this.editing_item.request_headers[headerKey],
          key: sanitized
        });
      }
    },
    addHeaderRow(headerKey) {
      let index = headerKey + 1;
      this.editing_item.request_headers.splice(index, 0, {
        key: null,
        value: null
      });
      this.editing_item.custom_header_keys.splice(index, 0, false);
      this.editing_item.custom_header_values.splice(index, 0, false);

      this.header_shortcodes[index] = this.cloneheaderShortCodes();
    },
    removeHeaderRow(headerKey) {
      this.editing_item.request_headers.splice(headerKey, 1);
      this.editing_item.custom_header_keys.splice(headerKey, 1);
      this.editing_item.custom_header_values.splice(headerKey, 1);

      this.header_shortcodes.splice(headerKey, 1);
    },
    addCustomHeaderKeyInput(headerKey, val) {
      if (val === "__webhook_custom_header__") {
        this.editing_item.custom_header_keys.splice(headerKey, 1, true);
        this.$set(this.editing_item.request_headers, headerKey, {
          key: null,
          value: this.editing_item.request_headers[headerKey].value
        });
      }
    },
    hideCustomHeaderKeyInput(headerKey) {
      this.editing_item.custom_header_keys.splice(headerKey, 1, false);
      this.$set(this.editing_item.request_headers, headerKey, {
        key: null,
        value: this.editing_item.request_headers[headerKey].value
      });
    },
    addCustomHeaderValueInput(headerKey, val) {
      if (this.editing_item.request_headers[headerKey].value === "custom") {
        this.editing_item.custom_header_values.splice(headerKey, 1, true);
        this.editing_item.request_headers[headerKey].value = null;
      }
    },
    hideCustomHeaderValueInput(headerKey) {
      this.editing_item.custom_header_values.splice(headerKey, 1, false);
      this.editing_item.request_headers[headerKey].value = null;
    },
    getHeaderShortCodes(headerKey) {
      console.log(this.header_shortcodes[headerKey], this.headerShortCodes);
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
  mounted() {
    this.loadApp();
  }
}
</script>

<style scoped>

</style>