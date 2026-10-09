<template>
    <div class="wpf_form_integrations all_payforms_wrapper payform_section">

        <div class="payform_section_header_2">
            <h3 class="payform_section_title">
                {{ $t('All Form Integrations')}}
            </h3>
            <div v-if="!isEmpty(available_integrations)" class="payform_section_actions">
                <el-dropdown type="primary" class="pull-right payform_action" @command="add">
                    <el-button size="medium" style="font-weight: 500 !important;">
                        {{ $t('Add New Integration')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                            v-for="(integration,integration_name) in available_integrations"
                            :key="integration_name" :command="integration_name"
                            v-show="integration.is_active"
                            >
                            {{integration.title}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <div v-if="isEmpty(available_integrations) && !loading" class="wpf_empty_integrations_section">
            <p>You don't have any integration module enabled. Please go to integration modules and enable and configured from 30+ available modules</p>
            <p style="text-align: center;"><a class="el-button el-button--primary el-button--small el-dropdown-selfdefine wpf_new_ui_button" :href="all_module_config_url">Configure Modules</a></p>
        </div>

        <!-- GetResponse Feeds Table: 1 -->
        <div class="wpf_list_table" v-else>
            <el-table stripe v-loading="loading" :data="integrations" class="el-fluid">
                <template slot="empty">
                    <div class="wpf_empty_table">
                        <img :src="asset_url + 'images/global/empty_table.svg'" alt="empty" />
                        <p>{{ $t("You don't have any form feed integration yet. Create new feed and connect your data to your favorite CRM/Marketing tool")}}</p>
                        <p v-show="!integrations.length" style="text-align: right;">
                            <a :href="all_module_config_url">{{ $t('Check Global Integration Settings')}}</a>
                            <a style="margin-left: 20px" target="_blank" rel="noopener" href="https://paymattic.com/docs">{{ $t('View Documentations')}}</a>
                        </p>
                    </div>
                </template>
                <el-table-column :label="$t('Status')" width="120">
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center; gap: 8px;"> 
                            <el-switch
                                v-model="scope.row.enabled"
                                @change="handleActive(scope.row)"
                            >
                            </el-switch>
                        </div>
                    </template>
                    
                </el-table-column>

                <el-table-column
                    width="200"
                    :label="$t('Integration')">
                    <template slot-scope="scope">
                        <img v-if="scope.row.provider_logo" class="general_integration_logo" :src="scope.row.provider_logo" :alt="scope.row.provider" />
                        <span class="general_integration_name" v-else>{{scope.row.provider}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    :label="$t('Title')">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>

                <el-table-column width="140" :label="$t('Actions')" class-name="action-buttons">
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span @click="edit(scope.row)" style="cursor: pointer;">
                                <Icon icon="wpf-edit" class="wpf_action_icon"/>
                            </span>
                            <el-tooltip class="item" effect="dark" :content="$t('Duplicate Integration')" placement="top-end">
                                <span @click="duplicateIntegration(scope.row.id)" style="cursor: pointer;">
                                    <Icon icon="wpf-duplicate" class="wpf_action_icon" />                         
                                </span>
                            </el-tooltip>
                            <!-- <remove class="pull-right" @on-confirm="emitClick('deleteNotification', scope.$index)">
                                
                                <i class="wpf-delete-activity el-icon-delete-solid" slot="icon"></i>
                            </remove> -->
                            <!-- <Icon icon="wpf-delete" /> -->
                            <remove @on-confirm="remove(scope.row.id, scope)">
                                <p style="font-size: 12px;" slot="info">
                                    {{$t('All the settings of ')}}<br/>
                                    {{$t('this integration will be deleted.')}}<br/>
                                    {{$t('Are you sure to delete this?')}}
                                </p>
                                <Icon icon="wpf-delete"  class="wpf_action_icon"/>
                            </remove>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import remove from '../../pieces/confirmation.vue';
    import isEmpty from 'lodash/isEmpty';
    import Icon from '../../Icons/Index.vue';
    export default {
        name: 'Integration',
        props: ['form_id', 'editorShortcodes'],
        components: {
            remove,
            Icon
        },
        data() {
            return {
                loading: true,
                integrations: [],
                available_integrations: {},
                all_module_config_url: '',
                has_pro: window.wpPayFormsAdmin.has_pro,
                asset_url: window.wpPayFormsAdmin.asset_url,
            }
        },
        methods: {
            add(integration_name) {
                let integration = this.available_integrations[integration_name];

                if(!integration.is_active) {
                    // Handle Inactive state
                    this.$confirm(integration.configure_message, integration.configure_title, {
                        confirmButtonText: integration.configure_button_text,
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        window.location.href = integration.global_configure_url;
                        return;
                    }).catch(() => {

                    });
                    return;
                }

                this.$router.push({
                    name: 'edit_integration',
                    params: {
                        integration_id: 0,
                        form_id: this.form_id,
                        integration_name: integration_name
                    }
                });
                return;
            },
            edit(integration) {
                this.$router.push({
                    name: 'edit_integration',
                    params: {
                        integration_id: integration.id,
                        form_id: this.form_id,
                        integration_name: integration.provider
                    }
                });
            },
            handleActive(row) {
                let data = {
                    status: row.enabled,
                    notification_id: row.id,
                };
                this.$post(`form/${this.form_id}/integration/settings/change-status`, data)
                    .then(response => {
                        this.$notify.success({
                            offset: 30,
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                    })
                    .fail(error => {
                        this.$notify.error({
                            offset: 30,
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    });
            },
            remove(id, scope) {
                let $index  = scope.$index;
                let data = {
                    integration_id: id,
                };

                this.$del(`form/${this.form_id}/integration/settings`, data)
                    .then(response => {
                        this.$notify.success({
                            offset: 30,
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                        this.integrations.splice($index, 1);
                    })
                    .fail(e => console.log(e));
            },
            getFeeds() {
                this.loading = true;
                this.$get(`form/${this.form_id}/integration`, {
                    form_id: this.form_id
                })
                    .then(response => {
                        this.integrations = response.feeds;
                        console.log('response', response);
                        this.available_integrations = response.available_integrations;
                        this.all_module_config_url = response.all_module_config_url;
                    })
                    .fail(error => {
                        console.log(error);
                    })
                    .always(r => this.loading = false);
            },
            isEmpty,
            duplicateIntegration(id) {
                let data = {
                    integration_id: id,
                };

                this.$post(`form/${this.form_id}/integration/settings/duplicate`, data)
                    .then(response => {
                        this.$notify.success({
                            offset: 30,
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                        this.getFeeds();
                    })
                    .fail(e => console.log(e));
            }
        },
        beforeMount() {
            this.getFeeds();
            window.WPPayFormsBus.$emit('site_title', 'Marketing & CRM Settings');
        }
    }
</script>


