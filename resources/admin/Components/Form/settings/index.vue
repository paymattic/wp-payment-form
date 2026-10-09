<template>
    <div class="wppayform_editor wpf_content_wrapper_parent_v2">
        <div class="payform_editor_wrapper wpf_content_wrapper_v2 wpf_form_settings_wrapper">
            <div class="wppayform_sidebar_v2 wpf_form_settings_sidebar">
                <el-aside :width="sidebarWidth">
                    <el-menu background-color="#ffffff"
                        text-color="#565C64"
                        :router="true"
                        :collapse="isCollapse"
                        :default-active="current_route"
                        active-text-color="#fff"
                    >
                        <el-menu-item
                            v-for="formMenu in form_menus"
                            :key="formMenu.route"
                            :route="{ name: formMenu.route }"
                            :index="formMenu.route" @click="scrollToTop">
                            <span style="text-align: center">
                               <img :src="assetsUrl(formMenu.svg)"/>
                               <p>{{  formMenu.title }}</p>
                            </span>
                            <span class="wpf_setting_forward_icon">
                                <Icon icon="wpf-arrow-right" />
                            </span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
            </div>
            <div class="wppayform_main_content_v2">
                <keep-alive include="confirmation_settings">
                    <router-view :form_id="form_id" ref="childComponent"></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import Icon from '../../Icons/Index.vue';
import Setting from '../../Icons/Setting.vue';
    export default {
        name: 'global_settings',
        components: {
            Icon
        },
        data() {
            return {
                current_route: this.$route.name,
                form_id: this.$route.params.form_id,
                sidebarWidth: "100%",
                isCollapse: false,
                form_menus: window.WPPayForms.applyFilters('wpf_main_children_routes_view', [
                    {
                        route: 'confirmation_settings',
                        title: 'Confirmation',
                        svg: 'images/form/confirmation.svg'
                    },
                    {
                        route: 'payment_settings',
                        title: 'Payment',
                        svg: 'images/form/payments.svg'
                    },
                    {
                        route: 'form_currency_settings',
                        title: 'Currency',
                        svg: 'images/form/currency.svg',
                    },
                    {
                        route: 'design_options',
                        title: 'Design',
                        svg: 'images/form/design.svg',
                    },
                    {
                        route: 'scheduling_settings',
                        title: 'Scheduling',
                        svg: 'images/form/scheduling.svg'
                    },
                    {
                        route: 'custom_css_js',
                        title: 'Custom CSS/JS',
                        svg: 'images/form/custom_css.svg'
                    },
                    {
                        route: 'leaderboard_settings',
                        title: 'Leaderboard',
                        svg: 'images/global/donor_leaderboard.svg'
                    }
                ])
            }
        },
        methods: {
            assetsUrl(path){
                return window.wpPayFormsAdmin.assets_url + path;
            },

            saveSettings(){
                this.$refs.childComponent.saveSettings();
            },
            scrollToTop() {
                const currentScrollPosition = window.pageYOffset;
                const scrollStep = -currentScrollPosition / (500 / 15);

                const scrollInterval = setInterval(() => {
                    if (window.pageYOffset <= 0) {
                        clearInterval(scrollInterval);
                    } else {
                        window.scrollBy(0, scrollStep);
                    }
                }, 15);
            }
        },
        created() {
            this.form_id = this.$route.params.form_id
            console.log(this.form_id, 'settings index');
            if(window.outerWidth < 600) {
                this.sidebarWidth = "auto";
                this.isCollapse = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
// .el-popper {
//   width: 250px !important;
// }
</style>
