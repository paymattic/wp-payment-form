<template>
	<div class="wpf-integration-modules_wrapper" v-loading="loading">
		<h3 class="wpf-integration-modules_header">{{ $t('Integrations') }}</h3>
		<div v-if="isActive === 'yes'" class="wpf-integration-modules_body"> 
			<div class="wpf-integration-modules_sidebar"> 
				<div :class='module_type === "all" ? "wpf-integration-module_category active" : "wpf-integration-module_category"'
					@click="changeModuleType('all')">
					<div class="wpf-integration-module_category-left"> 
						<Icon icon="wpf-analytics"  class="left-icon" />
						<span class="label">ALL</span>
					</div>
					<Icon icon="wpf-arrow-right" class="right-icon"/>
				</div>
				<div :class='module_type === "crm" ? "wpf-integration-module_category active" : "wpf-integration-module_category"'
					@click="changeModuleType('crm')">
					<div class="wpf-integration-module_category-left"> 
						<Icon icon="wpf-chart-bar-line"  class="left-icon"/>
						<span class="label">CRM & SASS</span>
					</div>
					<Icon icon="wpf-arrow-right" class="right-icon"/>
				</div>
				<div :class='module_type === "lms" ? "wpf-integration-module_category active" : "wpf-integration-module_category"'
					@click="changeModuleType('lms')">
					<div class="wpf-integration-module_category-left"> 
						<Icon icon="wpf-elearning"  class="left-icon"/>
						<span class="label">LMS</span>
					</div>
					<Icon icon="wpf-arrow-right" class="right-icon"/>
				</div>
				<div :class='module_type === "wp_core" ? "wpf-integration-module_category active" : "wpf-integration-module_category"'
					@click="changeModuleType('wp_core')">
					<div class="wpf-integration-module_category-left"> 
						<Icon icon="wpf-pin-location"  class="left-icon"/>
						<span class="label">CORE</span>
					</div>
					<Icon icon="wpf-arrow-right" class="right-icon"/>
				</div>
			</div>
			<div class="wpf-integration-modules_main" v-if="!showSettings"> 
				<div class="wpf-integration-modules_main-header"> 
					<div class="wpf-integration-modules_main-header_content"> 
						<h4>{{ $t('Paymattic Modules') }}</h4>
						<p>{{ $t('Here is the list of all Paymattic Modules. You can enable or disable the modules based on your need.') }}</p>
					</div>
				</div>
				<div class="wpf-integration-modules_search"> 
					<div class="wpf-integration-modules_search-layout"> 
						<Icon icon="wpf-search" />
						<!-- <el-button><Icon icon="Search"/></el-button> -->
						<el-input size="small" placeholder="Search Modules" v-model="search" class="wpf-integration-modules_search-input">
							
						</el-input>
					</div>
				</div>
				<div class="wpf-integration-modules_main-content"> 
					<div v-for="(addon, addonKey) in filteredAddons" :key="addonKey"
						:class="'addon_enabled_' + addon.enabled" class="wpf-integration-module_body">

						<div class="wpf-integration-module_body-left">
							<div class="wpf-integration-module_body-left_top"> 
								<img v-if="addon.logo" :src="addon.logo" class="" style="max-width: 80px; height: auto;" />
								<div class="wpf-integration-module_left-top_status" v-if="!addon.purchase_url">
									<Icon icon="wpf-checkmark" v-if="(!addon.config_url && addon.enabled === 'yes') || (addon.config_url && addon.is_configured === 'yes' && addon.enabled === 'yes')" />
									<span class="wpf-integration-module_active" v-if="(!addon.config_url && addon.enabled === 'yes') || (addon.config_url && addon.is_configured == 'yes' && addon.enabled === 'yes') "> {{ $t('Active') }}{{ addon.isActive }}</span>
									<Icon icon="wpf-minus" v-if="(!addon.config_url && addon.enabled === 'no') || (addon.config_url && addon.is_configured === 'no') || (addon.config_url && addon.enabled === 'no')" />
									<span class="wpf-integration-module_inactive" v-if="(!addon.config_url && addon.enabled === 'no') || (addon.config_url && addon.is_configured == 'no') || (addon.config_url && addon.enabled == 'no')"> {{ $t('Inactive') }}</span>
								</div>
							</div>
							<p class="wpf-integration-module_description"> {{ addon.description }} </p>
						</div>

						<!-- <img v-if="addon.logo" :src="addon.logo" class="" style="width: 80px; height: 20px;" />
						<div class="">
							<span class="">{{ addon.title }}</span>
							<span class="">{{ addon.description }}</span>
						</div> -->
						<el-tooltip v-if="!addon.purchase_url">
							<div slot="content">
								Configure {{ addon.title }}
							</div>
							<div  class="wpf-integration-module_middle"> 
								<!-- <a :href="addon.config_url" class="add_on_setting"> 
									<Icon icon="wpf-setting" class="icon"/>
								</a> -->
								<div @click="goToConfig(addonKey)"> 
									<Icon icon="wpf-setting"/>
								</div>
							</div>
						</el-tooltip>
						
						<div class="wpf-integration-module_body_right">
							<template v-if="addon.purchase_url">
								<div class="wpf-integration-module_right-install_active">
									<a rel="noopener" target="_blank" :href="addon.purchase_url">
										{{ addon.btnTxt }}
									</a>
								</div>
								
							</template>
							<template v-else>
								<!-- <el-switch active-color="#F98435" @change="saveStatus(addonKey)" active-value="yes"
									inactive-value="no" v-model="addon.enabled" /> -->
							</template>
						</div>
					</div>
					<div style="text-align: center" v-if="is_no_modules">
						<h4>Sorry! No modules found based on your filter</h4>
					</div>
				</div>
			</div>
			<integration-settings v-if="showSettings"/>
		</div>
	</div>
</template>

<script type="text/babel">
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import Icon from '../Icons/Index.vue';
import IntegrationSettings from './IntegrationSettings.vue';
// import PdfPromo from './pdf_promo.vue'

export default {
	name: 'Integrations',
	components: {
		Icon,
IntegrationSettings
	},
	data() {
		return {
			search: '',
			addOns: window.wpPayFormsAdmin.wppayform_addon_modules.addOns,
			has_pro: window.wpPayFormsAdmin.has_pro,
			isActive: window.wpPayFormsAdmin.wppayform_addon_modules.status,
			module_type: 'all',
			has_pdf: window.wpPayFormsAdmin.fluent_pdf_active === 'yes' ? true : false,
			is_installed: false,
			install_url: '',
			loading: false,
			downloadableFiles: [],
			statuses: {},
			globalSettingsUrl: '',
			currentModule: 'all',
			showSettings: false,
			configSetUp: false
		};
	},
	computed: {
		filteredAddons() {
			let addons = this.addOns;
			if (this.search) {
				let filteredAddons = {};
				each(addons, (addOn, addOnKey) => {
					let obString = JSON.stringify(addOn);
					if (obString.indexOf(this.search) !== -1) {
						filteredAddons[addOnKey] = addOn;
					}
				});
				addons = filteredAddons;
			}

			if (this.module_type != 'all') {
				let filteredAddons = {};
				each(addons, (addOn, addOnKey) => {
					if (addOn.category == this.module_type) {
						filteredAddons[addOnKey] = addOn;
					}
				});
				addons = filteredAddons;
			}
			return addons;
		},
		is_no_modules() {
			return isEmpty(this.filteredAddons);
		}
	},
	watch: {
		showSettings(newValue) {
			if (newValue) {
				this.$nextTick(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				});
			}
		}
	},
	methods: {
		activateIntegration() {
			this.$post('forms/integration/enable', {})
				.then((response) => {
					this.$message({
						message: response.message,
						type: 'success',
						offset: 32
					});
				}).fail((error) => {
					this.$message({
						dangerouslyUseHtmlString: true,
						message: error.responseText,
						offset: 32
					});
				});
		},
		changeModuleType(module_type) {
			if (this.showSettings) {
				this.showSettings = false;
				this.$router.push({ path: '/integrations' });
			}
			this.module_type = module_type;

			if ('pdf' === this.module_type) {
				if (!location.hash.includes('pdf')) {
					this.$router.push({ path: 'integrations/pdf' })
					this.getPdfInstallInfo();
					this.renderGlobalPdf();
				}
			} else {
				if (location.hash.includes('pdf')) {
					this.$router.push({ path: '/integrations' })
				}
			}
		},
		goToConfig(addOnKey) {
			this.showSettings = true;
			const targetRoute = '/integrations/' + addOnKey;
			if (this.$route.path !== targetRoute) {
				this.$router.push(targetRoute).catch(err => {
				if (err.name !== 'NavigationDuplicated') {
					throw err;
				}
				});
			}
		},
	},
	mounted() {
		window.WPPayFormsBus.$emit('site_title', 'Add-On');
		let paths = this.$route.path.split('/');
		if (paths.length > 2) {
			this.showSettings = true;
		}
	}
};
</script>
