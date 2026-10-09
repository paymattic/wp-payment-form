import Vue from './elements';
import Router from 'vue-router';
import Rest from './Rest';
Vue.use(Router);

import { applyFilters, addFilter, addAction, doAction } from '@wordpress/hooks';

export default class WPPayForms {
    constructor() {
        this.applyFilters = applyFilters;
        this.addFilter = addFilter;
        this.addAction = addAction;
        this.doAction = doAction;
        this.Vue = Vue;
        this.Router = Router;
        this.$rest = Rest;
    }
    // Rest start
    $get(url, options = {}) {
        return this.$rest.get(url, options);
    }

    $post(url, options = {}) {
        return this.$rest.post(url, options);
    }

    $del(url, options = {}) {
        return this.$rest.delete(url, options);
    }

    $put(url, options = {}) {
        return this.$rest.put(url, options);
    }

    $patch(url, options = {}) {
        return this.$rest.patch(url, options);
    }

    $upload(url, options = {}) {
        return this.$rest.upload(url, options);
    }
}

addFilter('wpf_main_children_routes_view', 'WPPayForms', function (routes) {
    if('yes' === window.wpPayFormsAdmin.fluent_pdf_active) {
        routes.push({
            route: 'pdf-feeds',
            title: 'Pdf Feeds',
            svg: '/images/form/pdf.svg'
        });
    }
    // if(window.wpPayFormsAdmin.wppayform_addon_modules.addOns['slack'].enabled === 'yes') {
    //     routes.push({
    //         route: 'slack',
    //         title: 'Slack',
    //         svg: '/images/form/slack.svg'
    //     });
    // }
    // if(window.wpPayFormsAdmin.wppayform_addon_modules.addOns['zapier'].enabled === 'yes') {
    //     routes.push({
    //         route: 'zapier',
    //         title: 'Zapier',
    //         svg: '/images/form/zapier.svg'
    //     });
    // }
    // if(window.wpPayFormsAdmin.wppayform_addon_modules.addOns['webhook'].enabled === 'yes') {
    //     routes.push({
    //         route: 'webhook',
    //         title: 'Webhook',
    //         svg: '/images/form/webhook.svg'
    //     });
    // }
    return routes;
}, 10);
