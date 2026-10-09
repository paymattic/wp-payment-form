<template>
    <div class="all_payforms_wrapper payform_section">
        <div class="payform_section_header">
            <h3 class="payform_section_title">
              {{ $t('Zapier') }}
            </h3>
            <div class="payform_section_actions">
              <el-button v-if="selected" @click="discard"
                           class="pull-right wpf_new_ui_button2" icon="el-icon-arrow-left" size="medium"
                >Back
                </el-button>

                <el-button v-else @click="add" type="primary"
                           size="medium" icon="el-icon-plus" class="wpf_new_ui_button"
                >Add Webhook
                </el-button>
            </div>
        </div>
        <div>
                  <!-- Notification Table: 1 -->
          <el-table v-loading="loading"
                    element-loading-text="Fetching Settings..."
                    v-if="!selected"
                    :data="notifications"
                    stripe
                    class="el-fluid">

              <el-table-column width="100">
                  <template slot-scope="scope">
                      <el-switch active-color="#13ce66" @change="handleActive(scope.$index)"
                        active-value="true"
                        inactive-value="false"
                        v-model="scope.row.meta_value.enabled"
                      ></el-switch>
                  </template>
              </el-table-column>

              <el-table-column width="300" prop="meta_value.name" label="Name"></el-table-column>

              <el-table-column prop="meta_value.url" label="Webhook Url"></el-table-column>

              <el-table-column width="160" label="Actions" class-name="action-buttons">
                  <template slot-scope="scope">
                      <el-button @click="edit(scope.$index)" type="primary"
                                icon="el-icon-setting" size="mini"
                      ></el-button>
                      <remove @on-confirm="remove(scope.$index, scope.row.id)" :plain="false">
                        <p style="font-size: 12px;" slot="info">$t{{'Are you sure to delte this?'}}</p>
                        <el-button type="danger" size="mini" class="el-icon-delete"></el-button>
                      </remove>
                  </template>
              </el-table-column>
          </el-table>

          <!-- Notification Editor -->
          <el-form class="wpf_inputs_new_ui" style="padding:23px;" v-else label-width="205px" label-position="left">

              <!--Notification name-->
              <el-form-item label="Name">
                  <el-input v-model="selected.meta_value.name"></el-input>
                  <ErrorView field="name" :errors="errors"/>

              </el-form-item>

              <!--Notification Url-->
              <el-form-item label="Webhook Url">
                  <el-input v-model="selected.meta_value.url"></el-input>
                  <ErrorView field="url" :errors="errors"/>
              </el-form-item>

              <!-- FilterFields -->
              <el-form-item>
                  <template slot="label">
                      Conditional Logics
                      <el-tooltip class="item" placement="bottom-start" effect="light">
                          <div slot="content">
                              <h3>Conditional Logics</h3>
                              <p>Allow zapier webhook conditionally</p>
                          </div>
                          <i class="el-icon-info"></i>
                      </el-tooltip>
                  </template>

                  <FilterFields
                    :fields="inputs"
                    :disabled="!has_pro"
                    :editorShortcodes="editorShortcodes"
                    :conditionals="selected.meta_value.conditionals">
                  </FilterFields>
              </el-form-item>

              <div class="text-right">
                  <el-button
                      v-if="selected.id"
                      :loading="verifying"
                      @click="verifyEndpoint"
                      size="medium"
                      type="default"
                  >
                      Send Data Sample
                  </el-button>

                  <el-button
                      :loading="loading"
                      @click="store"
                      size="medium"
                      type="primary"
                      class="wpf_new_ui_button"
                  >
                      {{loading ? 'Saving' : 'Save' }} Notification
                  </el-button>
              </div>
          </el-form>
        </div>
    </div>
</template>

<script>
    import Remove from '../../../Components/pieces/confirmation.vue';
    import inputPopover from '../Templates/input-popover.vue';
    import FilterFields from '../Templates/FilterFields.vue';
    import ErrorView from '../Templates/errorView.vue';
    import CloneDeep from 'lodash/cloneDeep';
    import Errors from "../../../../common/Errors";

    export default {
        name: 'Zapier',
        props: ['form_id', 'editorShortcodes'],
        components: {
            Remove,
            inputPopover,
            FilterFields,
            ErrorView,
        },
        data() {
            return {
                has_pro: window.wpPayFormsAdmin.has_pro,
                inputs: {},
                loading: true,
                verifying: false,
                selected: null,
                selectedIndex: null,
                notifications: [],
                mock: {
                    meta_value: {
                        name: 'Zapier Feed',
                        url: '',
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
                        enabled: 'true'
                    }
                },
                errors: new Errors()
            }
        },
        methods: {
            add() {
                this.selectedIndex = this.notifications.length;
                this.selected = CloneDeep(this.mock);
                let count = this.selectedIndex + 1;
                this.selected.meta_value.name = this.mock.meta_value.name + ' ' + count;
            },
            edit(index) {
                this.selectedIndex = index;
                let notification = this.notifications[index];
                this.selected = CloneDeep(notification);
            },
            discard() {
                this.selected = null;
                this.selectedIndex = null;
                this.errors.clear();
            },

            handleActive(index) {
                let notification = this.notifications[index];
                let data = {
                    id: notification.id,
                    form_id: this.form_id,
                    value: notification.meta_value,
                };

                let enabled = notification.meta_value.enabled == 'true' ? 'enabled' : 'disabled';

                this.$post(`form/${this.form_id}/integrations/zapier`,{
                  data: data
                })
                  .done(response => {
                      this.$notify.success({
                          offset: 30,
                          title: 'Success',
                          message: `Notification ${enabled} successfully !`,
                          position: 'bottom-right'
                      });
                  })
                  .fail(e => console.log(e));
            },
            remove(index, id) {
                this.$del(`form/${this.form_id}/integrations/zapier`, {
                  meta_id: id
                })
                .done(response => {
                    this.notifications.splice(index, 1);
                    this.$notify.success({
                        title: 'Success',
                        message: 'Successfully removed the notification.',
                        position: 'bottom-right',
                        offset: 30
                    });
                })
                .fail(e => console.log(e));
            },
            fetchNotifications() {
                this.$get(`form/${this.form_id}/integrations/zapier`, {
                })
                .then(response => {
                    this.notifications = response.data;
                    this.inputs = response.inputs;
                })
                .fail(e => console.log(e))
                .always(_ => this.loading = false);
            },
            store() {
                this.loading = true;
                this.errors.clear();

                this.$post(`form/${this.form_id}/integrations/zapier`,
                {
                  data: {
                    id: this.selected.id,
                    form_id: this.form_id,
                    value: this.selected.meta_value
                  }
                })
                .then(response => {
                    this.selected.id = response.id;
                    this.notifications.splice(this.selectedIndex, 1, this.selected);
                    this.$notify.success({
                        offset: 30,
                        title: 'Success',
                        message: 'Notification saved successfully!',
                        position: 'bottom-right'
                    });
                })
                .fail(e => {
                    this.errors.record(e.responseJSON.data);
                })
                .always(response => this.loading = false);
            },
            verifyEndpoint() {
                this.verifying = true;
                this.$post(`form/${this.form_id}/integrations/zapier/verify`,{
                    form_id: this.form_id,
                    zapier_hook_id: this.selected.id,
                }).then(response => {
                    this.$notify.success({
                        offset: 30,
                        title: 'Success!',
                        message: response.data.message,
                        position: 'bottom-right'
                    });
                }).fail(error => {
                    this.$notify.error({
                        offset: 30,
                        title: 'Oops!',
                        message: error.responseJSON.data.message,
                        position: 'bottom-right'
                    });
                }).always(r => {
                    this.verifying = false;
                });
            }
        },
        beforeMount() {
            this.fetchNotifications();
            jQuery('head title').text('Zapier Feeds - Paymattic');
        }
    }
</script>

