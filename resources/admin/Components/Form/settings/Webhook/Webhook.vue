<template>
  <div class="all_payforms_wrapper payform_section">
    <el-row class="payform_section_header">
      <el-col :md="12"><h2>WebHooks Integration</h2></el-col>

      <!--Add Feed-->
      <el-col :md="12" class="action-buttons mb15 clearfix">
        <el-button v-if="!show_edit" @click="add" type="primary" class="pull-right wpf_new_ui_button"
                   size="medium" icon="el-icon-plus">Add New
        </el-button>

        <el-button v-if="show_edit" @click="backToHome()"  class="pull-right wpf_new_ui_button2"
                   size="medium" icon="el-icon-arrow-left">Back
        </el-button>
      </el-col>
    </el-row>
    <!-- WebHook Feeds Table: 1 -->
    <el-table v-if="!show_edit" :data="tableData" stripe class="el-fluid">
      <template slot="empty">
        You don't have any feeds configured. Let's go
        <a href="#" @click.prevent="add">create one!</a>
      </template>

      <el-table-column width="100">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" @change="handleActive(scope.row)"
                     v-model="scope.row.meta_value.enabled"></el-switch>
        </template>
      </el-table-column>

      <el-table-column width="300" prop="meta_value.name" label="Name"></el-table-column>

      <el-table-column prop="meta_value.request_url" label="Webhook Url"></el-table-column>

      <el-table-column width="160" label="Actions" class-name="action-buttons">
        <template slot-scope="scope">
          <el-button @click="edit(scope.$index)" type="primary"
                     icon="el-icon-setting" size="mini"
          ></el-button>
          <remove @on-confirm="remove(scope.row)" :plain="false">
            <p style="font-size: 12px;" slot="info">$t{{'Are you sure to delete this?'}}</p>
            <el-button type="danger" size="mini" class="el-icon-delete"></el-button>
          </remove>
        </template>
      </el-table-column>
    </el-table>
   <div class="notification_edit">
    <!-- Webhook Feed Editor -->
      <editor
          v-if="show_edit"
          :fields="inputs"
          :form_id="form_id"
          :edit_item="editing_item"
          :selected_id="selected_id"
          :setSelectedId="setSelectedId"
          :selected_index="selectedIndex"
          :request_headers="request_headers"
          :editor_shortcodes="editor_shortcodes"
      ></editor>
   </div>
  </div>
</template>

<script>

import Remove from '../../../../Components/pieces/confirmation.vue';
import inputPopover from '../../Templates/input-popover.vue';
import Editor from './Editor.vue';
import Errors from "../../../../../common/Errors";

export default {
  name: "Webhook",
  props: ['form_id'],
  components: {
    Remove,
    inputPopover,
    Editor
  },
  data() {
    return {
      loading: true,
      configure_url: '',
      editing_item: null,
      selected_id: 0,
      selectedIndex: null,
      show_edit: false,
      integrations: [],
      webHook_lists: [],
      request_headers: [],
      inputs: {},
      webHookCustomFields: null,
      errors: new Errors,
      editor_shortcodes: []
    }
  },
  computed: {
    tableData() {
      return this.integrations;
    }
  },
  methods: {
    setSelectedId(id) {
      this.selected_id = id;
    },
    backToHome() {
      this.getFeeds(true);
      this.selected_id = 0;
      this.selectedIndex = 0;
      this.show_edit = false;
    },
    add() {
      this.selectedIndex = this.integrations.length;
      this.selected_id = 0;
      this.editing_item = false;
      this.show_edit = true;
    },
    edit(index) {
      let integration = this.integrations[index];
      this.selectedIndex = 0;
      this.selected_id = integration.id;
      this.editing_item = integration.meta_value;
      this.show_edit = true;
    },
    discard() {
      this.selected = null;
      this.selectedIndex = null;
      this.errors.clear();
    },
    handleActive(row) {
      let data = {
        form_id: this.form_id,
        notification_id: row.id,
        notification: JSON.stringify(row.meta_value)
      };
      this.$post(`form/${this.form_id}/integrations/webhook`, {
        data: data
      })
          .then(response => {
            this.$notify.success({
              offset: 30,
              title: 'Success!',
              message: response.data.message,
              position: 'bottom-right'
            });
          })
          .fail(error => {
            this.$notify.error({
              offset: 30,
              title: 'Success!',
              message: error.responseJSON.data.message,
              position: 'bottom-right'
            });
          });
    },
    remove(row) {
      let data = {
        id: row.id,
        form_id: this.form_id
      };
      this.$del(`form/${this.form_id}/integrations/webhook`, {
        data: data
      })
          .then(response => {
            this.integrations = response.data.integrations;
            this.$notify.success({
              offset: 30,
              title: 'Success!',
              message: response.data.message,
              position: 'bottom-right'
            });
          })
          .fail(e => console.log(e));
    },
    getFeeds(onlyFeeds = null) {
      this.$get(`form/${this.form_id}/integrations/webhook`, {})
          .then(response => {
            this.integrations = response.data.integrations;
            this.request_headers = response.data.request_headers;
            this.inputs = response.data.inputs;
            this.request_headers.push({
              'label': 'Add Custom Header',
              'value': '__webhook_custom_header__'
            });
          })
          .fail(e => console.log(e))
          .always(_ => this.loading = false);

      //get all editor_shortcodes
      this.$get(`form/${this.form_id}/settings`, {})
          .then(response => {
            this.editor_shortcodes[0] = response.editor_shortcodes.other;
            this.editor_shortcodes[1] = response.editor_shortcodes.submission;
            this.editor_shortcodes[2] = response.editor_shortcodes.wp
          })
          .fail(e => console.log(e))
          .always(_ => this.loading = false);
    }
  },
  beforeMount() {
    this.getFeeds();
  },
  beforeCreate() {
    jQuery('head title').text('WebHook Settings - WPPayform');
  }
}
</script>

<style scoped>

</style>