<template>
  <div>
    <div class="no_shadow">
      <div class="edit_form_warpper">
        <div class="all_payforms_wrapper payform_section">
          <div class="payform_section_header">
            <h3 class="payform_section_title">
              {{ $t('Slack') }}
            </h3>
            <div class="payform_section_actions">
              <el-button @click="save()" class="payform_action wpf_new_ui_button" size="medium" type="primary">
                {{ $t('Save Slack Settings') }}
              </el-button>
            </div>
          </div>
          <div v-loading="loading" element-loading-text="Loading Settings..." class="payform_section_body">
            <el-form ref="payment_settings" label-position="right" label-width="220px">
              <div class="wpf_sub_section wpf_inputs_new_ui">
                <div class="sub_section_body">
                  <el-form-item label="Integrate Slack">
                    <el-switch active-color="#13ce66" @change="changeStatus" v-model="slack.enabled"></el-switch>
                  </el-form-item>
                  <el-form-item v-if="slack.enabled" label="Slack title">
                    <el-input placeholder="optional" size="medium" v-model="slack.textTitle"></el-input>
                  </el-form-item>
                  <template v-if="slack.enabled">
                    <el-form-item>
                      <template slot="label">
                        Slack Webhooks

                        <el-tooltip class="item" placement="bottom-start" effect="light">
                          <div slot="content">
                            <h3>Form Label Placement</h3>
                            <p>
                              The <a href="https://api.slack.com/incoming-webhooks" target="_blank">slack webhook
                              URL</a> where Paymattic will send JSON payload.
                            </p>
                          </div>

                          <i class="el-icon-info"></i>
                        </el-tooltip>
                      </template>
                      <el-input size="medium" placeholder="https://hooks.slack.com/services/..."
                                v-model="slack.webhook"></el-input>
                    </el-form-item>
                  </template>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "Slack",
  props: ['form_id'],
  data() {
    return {
      loading: false,
      saving: false,
      slack: {
        id: null,
        enabled: false,
        webhook: null,
        textTitle: ''
      }
    }
  },
  methods: {
    fetch() {
      this.loading = true;
      this.$get(`form/${this.form_id}/integration/slack`, {})
          .then(response => {
            if (response.id) {
              this.slack = response.settings;
              this.slack.id = response.id;
            }
          })
          .fail(e => {
          })
          .always(() => {
            this.loading = false;
          })
    },
    changeStatus() {
      this.save();
    },
    save() {
      this.saving = true;

      let data = {
        meta_key: 'slack',
        value: JSON.stringify(this.slack),
        id: this.slack.id,
      };

      this.$post(`form/${this.form_id}/integration/slack`, data)
          .then(response => {
            this.$notify.success({
              title: 'Success',
              message: response.message,
              position: 'bottom-right',
              offset: 30
            });
          })
          .fail(error => {
            console.log(error.responseJSON.data.errors);
          })
          .always(() => {
            this.saving = false;
          });
    }
  },
  mounted() {
    this.fetch();
  },
  beforeCreate() {
    window.WPPayFormsBus.$emit('site_title', 'Slack Settings');
  }
}
</script>
