<template>
    <div class="wppayform_editor">
        <div class="settings_header">
            <div class="settings_left">
                <el-button class="ninja_mini wpf_new_ui_button2" size="medium" @click="editFormModalShow = true">
                    <i title="Edit" class="el-icon-edit action">{{ $t('Edit') }}</i>
                </el-button>
                <span class="section_title">{{ form.post_title }}</span>
                <el-tooltip effect="dark"
                            content="Click to copy shortcode"
                            title="Click to copy shortcode"
                            placement="top">
                    <code class="copy" style="padding: 4px;"
                          :data-clipboard-text='`[wppayform id="${form.ID}"]`'>
                        [wppayform id="{{ form.ID }}"] <i class="el-icon-document"></i>
                    </code>
                </el-tooltip>
            </div>
            <div class="settings_right">
                <a :href="form.preview_url" target="_blank">
                    <el-button style="background: #fff; color: black;" size="medium" class="wpf_new_ui_button2">{{ $t('Preview') }}</el-button>
                </a>
                <a
                    @click.prevent="gotoAllForms()"
                    class="el-button payform_action el-button--mini el-button--info">
                    All Forms
                </a>
                <a
                    v-if="!has_pro"
                    target="_blank"
                    class="el-button payform_action el-button--danger el-button--mini"
                    :href="pro_purchase_url">
                    Upgrade To Pro
                </a>
            </div>
        </div>

        <div class="payform_editor_wrapper">
            <el-menu class="wpf_form_menu" mode="horizontal"
                 :router="true"
                 :default-active="current_route"
                 background-color="#F5F5F5"
            >
                <el-menu-item
                    v-for="formMenu in form_menus"
                    :key="formMenu.route"
                    :route="{ name: formMenu.route, params: { form_id: form_id } }"
                    :index="formMenu.route">
                    <img :src="assetsUrl(formMenu.icon)" class="wpf_form_menu_icons"/>
                    <span>{{ formMenu.title }}</span>
                </el-menu-item>
            </el-menu>
            <router-view :form_id="form_id"></router-view>
        </div>
        <!--Edit Form Modal-->
        <el-dialog
            title="Edit Form Title and Description"
            :visible.sync="editFormModalShow"
            width="50%">
            <div class="modal_body">
                <el-form ref="edit_form" @submit.prevent.native="editForm()" :model="form" label-width="160px">
                    <el-form-item label="Form Title">
                        <el-input v-model="form.post_title" size="mini" type="text" placeholder="Form Title"/>
                    </el-form-item>
                    <el-form-item label="Form Description">
                        <wp-editor v-model="form.post_content"/>
                    </el-form-item>
                    <el-checkbox true-label="yes" false-label="no" v-model="form.show_title_description">Show Form Title
                        and Description at frontend
                    </el-checkbox>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="editFormModalShow = false" class="wpf_new_ui_button2">Cancel</el-button>
                <el-button size="medium" type="primary" @click="editForm()" class="wpf_new_ui_button">Update</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
    import WpEditor from '../Common/_wp_editor';
    import Clipboard from 'clipboard';

    export default {
        name: 'global_wrapper',
        components: {WpEditor},
        data() {
            return {
                form_id: this.$route.params.form_id,
                current_route: this.$route.name,
                form_menus: [],
                editFormModalShow: false,
                form: {},
                fetching: false,
                saving: false,
                icon: window.wpPayFormsAdmin.icon_url,
                goFull: window.localStorage.getItem('wpf_full_screen')
            }
        },
        methods: {
            assetsUrl(path) {
				return window.wpPayFormsAdmin.assets_url + 'images/form/' +  path;
			},
            getForm() {
                this.fetching = true;
                // FormController@getForm
                this.$get(`form/${this.form_id}`, {
                })
                    .then(response => {
                        this.form = response;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.fetching = false;
                    })
            },
            editForm() {
                // validate first
                if (!this.form.post_title) {
                    this.$message.error('Please provide form title');
                    return;
                }
                this.saving = true;
                // FormController@update
                this.$put(`form/${this.form.ID}`, {
                    post_title: this.form.post_title,
                    post_content: this.form.post_content,
                    show_title_description: this.form.show_title_description
                })
                    .then(response => {
                        this.$notify.success({
                            title: 'Success!',
                            message: response.message,
                            offset: 30,
                            position: 'bottom-right'
                        })
                        this.editFormModalShow = false;
                    })
                    .fail(error => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            offset: 30,
                            position: 'bottom-right'
                        })
                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            setFormMenu() {
                this.form_menus = this.applyFilters('wpf_set_form_menus', [
                    {
                        route: 'edit_form',
                        title: 'Form Editor',
                        icon: 'editor.svg'
                    },
                    {
                        route: 'confirmation_settings',
                        title: 'Form Settings',
                        icon: 'settings.svg'
                    },
                    {
                        route: 'form_entries',
                        title: 'Form Entries',
                        icon: 'entries.svg'
                    },
                    {
                        route: 'email_settings',
                        title: 'Email',
                        icon: 'notifications.svg'
                    },
                    {
                        route: 'integration',
                        title: 'Form Integrations',
                        icon: 'integrations.svg'
                    }
                ], this.form_id);
            },
            gotoAllForms() {
                this.$router.push({
                    name: 'forms'
                });
            }
        },
        mounted() {
            this.setFormMenu();
            this.getForm();
            if (!window.wpf_clip_inited) {
                var clipboard = new Clipboard('.copy');
                clipboard.on('success', (e) => {
                    this.$message({
                        offset: 39,
                        message: 'Copied to Clipboard!',
                        type: 'success'
                    });
                });
                window.wpf_clip_inited = true;
            }

            if (window.localStorage.getItem('wpf_full_screen') === 'yes') {
                jQuery('html').addClass('wpf_go_full');
            }
            // hide main menu
            jQuery('.wppayform_main_nav').css('display', 'none');
            jQuery('body').addClass('folded');
            jQuery('.wppayform_main_nav').css('display', 'none');
        }
    }
</script>
<style scoped>
.ninja_mini {
    border-radius: 7px;
    margin-right: 11px;
}
.wpf_form_menu_icons {
    filter: grayscale(100%);
}
</style>