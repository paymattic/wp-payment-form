
import Vue from 'vue';
import App from './CustomerDashboardApp.vue';

// import necessary elements to use
import { Loading, Button, Icon } from 'element-ui';
Vue.use(Loading, Button, Icon);

Vue.mixin({
    methods: {
        $t(str) { 
            return window.wpPayFormsDashboard?.i18n?.[str] || str;
        } 
    }
});

const mainApp = new Vue({
    el: '#dashboard_app',
    render: (h) => h(App),
    data: {
        todos: [
            { text: 'Learn JavaScript' },
            { text: 'Learn Vue' },
            { text: 'Build something awesome' }
        ]
    }
})
