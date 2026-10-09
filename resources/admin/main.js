import './GlobalVueMethods.js';
import { routes } from './routes';

const router = new window.WPPayForms.Router({
	routes: window.WPPayForms.applyFilters('wpf_global_vue_routes', routes),
	linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
	if (window.wpPayFormsAdmin.is_paymattic_user == '1' && !to.meta?.is_paymattic) {
		next('/paymattic-dashboard');
	} else {
	    next();
	}
});
  

import App from './App';

new window.WPPayForms.Vue({
	el: '#wppayforms_app',
	render: (h) => h(App),
	router: router,
	watch: {
		$route(to, from) {
			this.routeCheck();

			if (!to.params.form_id && from.params.form_id) {
				jQuery('.wppayform_main_nav').css('display', 'block');
			}
		}
	},
	mounted() {
		window.WPPayFormsBus.$on('site_title', (title) => {
			jQuery(document).attr('title', title + ' :: Paymattic');
		});

		this.routeCheck();
	},
	methods: {
		routeCheck() {
			(function ($) {
				const hash = location.hash;
				let path = '.wpf-route-';
				let routeName = '';

				if (hash && hash.includes('#/')) {
					routeName = hash.substring(2);
					if(routeName.includes('/')) {
						routeName = routeName.split('/')[0];
					}
				} else {
					routeName = hash.substring(1);
				}

				if (
					!routeName ||
					routeName.includes('edit-form') ||
					routeName.includes('new-form')
				) {
					routeName = 'forms';
				} else if (routeName.includes('gateways')) {
					routeName = 'gateways';
				}

				path += routeName;

				const elem = $(path);
				$('.ninja-tab').removeClass('ninja-tab-active');
				elem.length && elem.addClass('ninja-tab-active');

				$('.wp-submenu li').removeClass('current');

				$('.wp-submenu li')
					.find(`a[href*="${routeName}"]`)
					.parent()
					.addClass('current');
			})(jQuery);
		}
	}
});
