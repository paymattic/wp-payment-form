import moment from 'moment/moment';
window.WPPayFormsBus = new window.WPPayForms.Vue();

window.WPPayForms.Vue.prototype.$rest = window.WPPayForms.$rest;
window.WPPayForms.Vue.prototype.$get = window.WPPayForms.$get;
window.WPPayForms.Vue.prototype.$post = window.WPPayForms.$post;
window.WPPayForms.Vue.prototype.$del = window.WPPayForms.$del;
window.WPPayForms.Vue.prototype.$put = window.WPPayForms.$put;
window.WPPayForms.Vue.prototype.$patch = window.WPPayForms.$patch;
window.WPPayForms.Vue.prototype.$upload = window.WPPayForms.$upload;

window.WPPayForms.Vue.mixin({
    methods: {
        $t(str) {
            let transString = wpPayFormsAdmin.i18n[str];
            if(transString) {
                return transString;
            }
            return str;
        },
        setStoreData(key, value) {
            if(window.localStorage) {
                localStorage.setItem("wppayforms_"+key, value);
            }
        },
        deleteStoreData(key) {
            if(window.localStorage) {
                localStorage.removeItem("wppayforms_"+key);
            }
        },
        $showAjaxError(error) {
            if(error.responseJSON && error.responseJSON.message) {
                this.$notify.error({
                    title: 'Error',
                    message: error.responseJSON?.data?.message,
                    position: 'bottom-right'
                });
            } else if (error.responseText) {
                this.$notify.error({
                    title: 'Error',
                    message: error.responseText,
                    position: 'bottom-right'
                });
            } else {
                 this.$notify.error({
                    title: 'Error',
                    message: 'Something is wrong when doing ajax request! Please try again',
                    position: 'bottom-right'
                });
            }
        },
        getFromStore(key, defaultValue) {
            if(window.localStorage) {
                let itemValue = localStorage.getItem('wppayforms_'+key);
                if(itemValue) {
                    return itemValue;
                }
            }
            return defaultValue;
        },
        applyFilters: window.WPPayForms.applyFilters,
        addFilter: window.WPPayForms.addFilter,
        addAction: window.WPPayForms.addFilter,
        doAction: window.WPPayForms.doAction
    },
    data(){
        return {
            has_pro: window.wpPayFormsAdmin.has_pro,
            pro_purchase_url: window.wpPayFormsAdmin.wppayformUpgradeUrl,
        }
    },
    filters: {
        ucFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        dateFormat(date, format) {
            if(!format) {
                format = 'MMM DD, YYYY';
            }
            let dateString = (date === undefined) ? null : date;
            let dateObj = moment(dateString);
            return dateObj.isValid() ? dateObj.format(format) : null;
        }
    }
});



jQuery(document).ready(function($) {
    /** Nav menu **/
    (function() {
        const hash = window.location.hash;
        let path = '.wpf-route-';
        path += (hash && hash == '#/') ? 'forms' : hash.substring(2).split("/")[0];
        const elem = $(path);
        elem.length && elem.addClass("ninja-tab-active");
    })();

    $('.wppayform_main_nav .ninja-tab').click(function(){
        $('.ninja-tab').removeClass("ninja-tab-active");
        $(this).addClass("ninja-tab-active");
    });

    /** Menu expand/contract toggler **/
	if (window.localStorage.getItem('wpf_full_screen') === 'yes') {
		$('html').addClass('wpf_go_full');
        setActive('.wpf-contract-btn');
	} else {
        setActive('.wpf-expand-btn');
    }

    function setActive(className) {
        $('.wppayform-fullscreen-main span').removeClass("wpf-inactive");
        $(className).addClass('wpf-inactive');
    }

    $('.wppayform-fullscreen-main span').click(function(e) {
        let status = 'no';
        let disable = '.wpf-expand-btn';
        if (e.target.id === 'wpf-expand-btn') {
            status = 'yes';
            disable = '.wpf-contract-btn';
        }
        window.localStorage.setItem('wpf_full_screen', status)
        setActive(disable);
        $('html').toggleClass('wpf_go_full');
    });
});

//remove unwanted notice from other plugins
jQuery('.update-nag,.notice, #wpbody-content > .updated, #wpbody-content > .error').remove();