<template>
    <div class="wppayform_editor">
        <div class="wpf-settings_header">
            <div class="wpf-back-button">
                <router-link to="/"><p><i class="el-icon-back"></i>{{ $t('Back to All Forms') }}</p>
                </router-link>
            </div>
            <div class="settings_left">
                <el-menu class="wpf_form_menu wpf_menu" mode="center" :router="true" :default-active="current_route">
                    <!-- <el-menu-item 
                        style="height: 51px; border-right: 1px solid #f0f0f1;"
                        :index="'forms'"
                        :route="{ name: 'forms' }"
                        :route_name="'forms'">
                        <img :src="assetsUrl('forms.svg')" class="wpf_form_menu_icons" />
                        <p>{{ $t('All Forms')}}</p>
                    </el-menu-item> -->
                    <el-menu-item v-for="formMenu in form_menus" :key="formMenu.route"
                        :route="{ name: formMenu.route, params: { form_id: form_id } }" :index="formMenu.route"
                        :route_name="formMenu.route">
                        <Icon :icon="getIconName(formMenu.icon)" />
                        <!-- <img :src="assetsUrl(formMenu.icon)" class="wpf_form_menu_icons" /> -->
                        <p>{{ formMenu.title }}</p>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="settings_right">
                <div class="wpf_action_handler">
                    <div class="wpf_form_shortcode">
                        <div class="payform_shortcode">
                            <el-tooltip effect="dark" content="Click to copy shortcode" title="Click to copy shortcode"
                                placement="top">
                                <code class="copy"
                                    :data-clipboard-text='`[wppayform id="${form.ID}"]`'>
                                    <Icon icon="wpf-copy" />
                                    [wppayform id="{{ form_id }}"]
                                </code>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="wpf-undo-redo-btn-group first"  v-if="currentRouteName === 'edit_form'">
                        <el-tooltip placement="top" effect="light" :open-delay="1000">
                            <div slot="content">
                                Click to redo, Shortcuts:<br /> Ctrl + shift + Z or Cmd + shift + z
                            </div>
                            <div :class="canUndo ? 'wpf-button' : 'wpf-button disabled'" @click="undo()">
                                <i class="el-icon-refresh-left" />
                            </div>
                        </el-tooltip>
                        <el-tooltip placement="top" effect="light" :open-delay="1000">
                            <div slot="content">
                                Click to Undo, Shortcuts:<br /> Ctrl + z or Cmd + z
                            </div>
                            <div @click="redo()" :class="canRedo ? 'wpf-button' : 'wpf-button disabled'">
                                <i class="el-icon-refresh-right" />
                            </div>
                        </el-tooltip>
                    </div>
                    <div class="wpf-undo-redo-btn-group">
                        <a class="preview-icon-btn" :href="form.preview_url" target="_blank">
                            <i class="el-icon-view"></i>
                        </a>
                        <el-button v-if="!quick_form_builder && show_form_save_button" @click="saveform" style="margin: 0 4px 0 0;" class="" size="mini" type="primary">
                            {{ $t('Save')}}
                        </el-button>
                        <el-button v-if="quick_form_builder && show_form_save_button" @click="saveQuickform" style="margin: 0 4px 0 0;" class="" size="mini" type="primary">
                            {{ $t('Save')}}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-if="currentRoute === 'view' || integrationOrEmailFeed" style="display: none;"></div>
        <div v-else class="wpf_form_settings_banner">
            <div class="wpf_form_settings_breadcumb">
                <div class="wpf_form_editor_path">
                    <router-link :to="{ name: 'edit_form', params: { form_id: form_id } }">
                        {{ form_title }}
                    </router-link>
                </div>

                <div class="payhead_back_icon">
                    <Icon icon="GreaterIcon" />
                </div>

                <div class="wpf_form_title">
                    <span>{{ formattedRoute }}</span>
                </div>
            </div>
            <div class="wpf_form_shortcode">
                <div class="payform_shortcode" style="top:-17px;">
                    <el-tooltip effect="dark" content="Click to copy shortcode" title="Click to copy shortcode"
                        placement="top">
                        <code class="copy"
                            :data-clipboard-text='`[wppayform id="${form.ID}"]`'>
                            <Icon icon="wpf-copy" />
                            [wppayform id="{{ form_id }}"]
                        </code>
                    </el-tooltip>
                </div>
            </div>
        </div> -->
        <div class="payform_editor_wrapper">
            <router-view @undo-redo-toggole="undoRedoToggole" @get-some-data="getSomeDataFormChild" ref="childComponent"
                :form_id="form_id"></router-view>
        </div>
        <!--Edit Form Modal-->
        <el-dialog title="Edit Form Title and Description" :visible.sync="editFormModalShow" width="50%">
            <div class="modal_body">
                <el-form ref="edit_form" @submit.prevent.native="editForm()" :model="form" label-width="160px">
                    <el-form-item label="Form Title">
                        <el-input v-model="form.post_title" size="mini" type="text" placeholder="Form Title" />
                    </el-form-item>
                    <el-form-item label="Form Description">
                        <wp-editor v-model="form.post_content" />
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
import Icon from '../Icons/Index.vue';

export default {
    name: 'global_wrapper',
    components: { WpEditor, Icon },
    data() {
        return {
            form_id: this.$route.params.form_id,
            current_route: this.$route.name,
            form_menus: [],
            editFormModalShow: false,
            form: {},
            fetching: false,
            saving: false,
            layout_settings: {},
            icon: window.wpPayFormsAdmin.icon_url,
            goFull: window.localStorage.getItem('wpf_full_screen'),
            sidebar: false,
            hasChange: false,
            buttonText: '',
            canUndo: false,
            canRedo: false,
            quick_form_builder: false,
            show_form_save_button: true,
            form_title: ''
        }
    },
    watch: {
        form: {
            handler: function (val) {
                if (this?.form.post_name?.includes('donation-template')) {
                    this.form_menus[0].route = 'quick_edit_form'
                }
            },
            deep: true
        },
        $route(to, from) {
            let routePath = to.fullPath;
            if (routePath.includes('email_settings') || routePath.includes('integrations') || routePath.includes('form_entries') || routePath.includes('entries')) {
                this.show_form_save_button = false;
            } else {
                this.show_form_save_button = true;
            }
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        currentRoute() {
            const route = this.$route.path;
            // Split the route by '/'
            const routeParts = route.split('/');
            // Get the last part of the array
            if (this.current_route !== 'quick_edit_form'){
                return routeParts[routeParts.length - 1];
            } else {
                return routeParts[routeParts.length - 2];
            }
        },
        formattedRoute() {
          return this.currentRoute
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
        },
        integrationOrEmailFeed() {
            const route = this.$route.path;
            
            if (route.includes('integrations') || route.includes('email_settings') || route.includes('quick-form-builder')) {
                if (route.includes('integrations')) {
                    const routeParts = route.split('/');
                    if (routeParts[routeParts.length - 1] !== 'integrations') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true
                }
            }

            return false;
        }
    },
    methods: {
        // assetsUrl(path) {
        //     return window.wpPayFormsAdmin.assets_url + 'images/form/' + path;
        // },
        getIconName(icon) {
            let iconName = 'wpf-' + icon.split('.')[0];
            return iconName;
        },
        getSettings() {
            this.fetching = true;
            // console.log('getSettings', this.form_id);
            // FormController@designSettings
            this.$get(`form/${this.form_id}/settings/design`, {})
                .then((response) => {
                    this.layout_settings = response.layout_settings;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON.message,
                        position: 'bottom-right',
                    })
                })
                .always(() => {
                    this.fetching = false;
                });
        },
        getForm() {
            this.fetching = true;
            // FormController@getForm
            this.$get(`form/${this.form_id}`, {
            })
                .then(response => {
                    this.form = response;
                    this.form_title = response.post_title;
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
                    this.$notify.success({ title: 'Success!', message: response.message, offset: 30, position: 'bottom-right' });
                    this.editFormModalShow = false;
                })
                .fail(error => {
                    this.$notify.error({
                        title: 'Oops!',
                        offset: 30,
                        message: error.responseJSON.data.message,
                        position: 'bottom-right',
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
                    title: this.$t('Editor'),
                    icon: 'editor.svg'
                },
                {
                    route: 'confirmation_settings',
                    title: this.$t('Settings'),
                    icon: 'settings.svg'
                },
                {
                    route: 'form_entries',
                    title: this.$t('Entries'),
                    icon: 'entries.svg'
                },
                {
                    route: 'email_settings',
                    title: this.$t('Email'),
                    icon: 'notifications.svg'
                },
                {
                    route: 'integration',
                    title: this.$t('Integrations'),
                    icon: 'integrations.svg'
                }
            ], this.form_id);
        },
        gotoAllForms() {
            this.$router.push({
                name: 'forms'
            });
        },
        saveform() {
            this.hasChange = false;
            this.$refs.childComponent.saveSettings();
        },
        saveQuickform() {
            this.hasChange = false;
            this.$emit('save-quick-form');
            // this.$refs.childComponent.saveQuickSettings();
        },
        undo() {
            this.$refs.childComponent.undo();
        },
        redo() {
            this.$refs.childComponent.redo();
        },
        getSomeDataFormChild() {
            const childData = this.$refs.childComponent.getSomeData();
            this.hasChange = childData.hasChange;
            this.buttonText = childData.buttonText;
        },
        undoRedoToggole() {
            setTimeout(() => {
                const childData = this.$refs.childComponent.undoRedoToggole();
                this.canRedo = childData.canRedo;
                this.canUndo = childData.canUndo;
            }, 100);
        }
    },
    mounted() {
        this.setFormMenu();
        if (this.$route.name === 'edit_form') {
            this.getSomeDataFormChild();
        }
        if (this.$route.name === 'quick_edit_form') {
            this.quick_form_builder = true;
        } else {
            this.quick_form_builder = false;
        }
        // check route if save form button is not needed
        let routePath = this.$route.fullPath;
        if (routePath.includes('email_settings') || routePath.includes('integrations') || routePath.includes('form_entries') || routePath.includes('entries')) {
            this.show_form_save_button = false;
        } else {
            this.show_form_save_button = true;
        }

        this.getForm();
        this.getSettings();
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
        jQuery('.wppayform_main_nav').css('display', 'none');
    }
}
</script>
<style scoped lang="scss">
// .ninja_mini {
//     border-radius: 7px;
//     margin-right: 11px;
// }
// .el-link {
//     box-shadow: none;
// }

// .wpf_form_menu_icons {
//     filter: grayscale(100%);
// }

// .section_title {
//     color: #F98435;
//     margin-right: 10px;
//     text-align: center;
//     cursor: pointer;
// }

// .wppayform_editor .settings_header .settings_left {
//     flex: 1;
//     float: none;
// }

// .settings_header {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 14px;
// }

// .wpf_menu {
//     display: flex;
//     justify-content: center;
//     border-right: none;
//     background: none !important;
//     img.wpf_form_menu_icons {
//         max-width: 21px;
//     }
// }

// .grid-container {
//     display: grid;
//     grid-template-columns: auto auto auto auto;
// }

// .wpf_form_menu li {
//     height: auto;
//     line-height: inherit;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     flex-direction: column;
//     gap: 4px;
//     margin: 0;
//     padding: 12px 10px 10px 20px;

//     p {
//         font-size: 12px;
//         margin: 0 !important;
//     }
// }

// .wpf_form_menu li img {
//     margin-bottom: -3px;
// }

// .wpf_form_menu li.is-active {
//     p {
//         color: #FF7518;
//     }
// }

// .wpf_form_menu li>* {
//     display: block;
// }

// .el-menu-item {
//     background: none !important;
// }

// @media (min-width: 1200px) {
//     .settings_right {
//         position: absolute;
//         right: 18px;
//     }
// }

// .wppayform_editor {
//     margin: 0 auto;
// }
</style>