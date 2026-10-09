import WPPayForms from '../../PayForms';
window.WPPayForms = new WPPayForms();

import GeneralSettings from './GeneralSettings';
import Licensing from './License';
// import GlobalTools from './GlobalTools';
import reCaptcha from './ReCaptchaSettings';
import Turnstile from './Turnstile';
import PDFSettings from './PdfSettings';
import Permission from './_Privacy.vue';
import GeneralIntegrationSettings from './GeneralIntegrationSettings';
import Coupons from './Payments/Coupons.vue';
import Dashboard from './Dashboard/Dashboard.vue';
import DonorLeaderBoard from './DonorLeaderBoard.vue'
import GiveWPMigrator from '../../GiveWPMigrator/App.vue'

require('../../GlobalVueMethods');

new window.WPPayForms.Vue({
	el: '#wppayform_global_settings_option_app',
	components: {
		settings: GeneralSettings,
		re_captcha: reCaptcha,
		turnstile: Turnstile,
		permission: Permission,
		coupons: Coupons,
		license: Licensing,
		// tools: GlobalTools,
		pdf_settings: PDFSettings,
		user_dashboard: Dashboard,
		donor_leaderboard: DonorLeaderBoard,
		wppayform_migrator: GiveWPMigrator,
		'general-integration-settings': GeneralIntegrationSettings
	},
	data: {
		component: 'settings',
		App: window.WPPayFormsBus,
		settings_key: ''
	},
	methods: {
		$t(str) {
			let transString = wpPayFormsAdmin.i18n[str];
			if (transString) {
				return transString;
			}
			return str;
		},
		setRoute(hash) {
			let $el = jQuery('.wppayform_sidebar_list_v2 li').find('a[data-hash=' + hash + ']');
			let component = hash;
			if ($el.data('component')) {
				component = $el.data('component');
			}
			if (this.$options.components[component]) {
				jQuery('.wppayform_sidebar_list_v2 li').removeClass('active');
				$el.parent().addClass('active');
				this.settings_key = jQuery($el).attr('data-settings_key');
				this.component = component;
			}
		}
	},
	created() {
		let hash = location.hash;
		if (hash && hash.includes("#/")) {
			hash = hash.substring(2);
		} else {
			hash = hash.substring(1);
		}
		hash ? this.setRoute(hash) : this.setRoute('settings');
		const that = this;
		jQuery('.wppayform_sidebar_list_v2 li a').on('click', function () {
			let hash = jQuery(this).attr('data-hash');
			hash && that.setRoute(hash);
			jQuery(this).parent().addClass('active');
		});
	}
});

