<template>
	<div v-loading="loading" class="wpf_content_wrapper_parent_v2">
		<div class="payform_section_header">
			<h2 class="payform_gateway_title">
				{{ $t('Payment Gateways') }}
			</h2>
		</div>
		<div class="wpf_content_wrapper_v2 gap-20">
			<div class="wppayform_sidebar_v2 border-radius-8">
				<ul class="wppayform_sidebar_list_v2 wpf_gateway_lists">
					<!-- <li style="text-align: center">
						<el-popover placement="top-start" width="400" trigger="click">
							<div class="wppayform_gateway_search wpf_inputs_new_ui">
								<el-input @input="onSearch" :placeholder="$t('Search Payment Method')" v-model="search"
									ref="search_input_ref" autofocus>
								</el-input>
							</div>
							<span slot="reference">
								<i slot="suffix" class="el-input__icon el-icon-search" @click="makeFocus"
									style="font-size: 18px; cursor: pointer;"></i>
							</span>
						</el-popover>
					</li> -->
					<li v-for="(settings_menu, settings_index) in availableGateways" :key="settings_index" @click="scrollToTop">
						<router-link :to="{ name: settings_menu.route_name, query: settings_menu.route_query }" class="wpf_global_payment_setting_component">
							<div class="wpf_payment_title">
								<!-- <img :src="settings_menu.svg" width="16" class="menu_item_img" /> -->
								<img :src="getPaymentMethodIcon(settings_menu.route_name)" width="16" class="menu_item_img" />
								<p>{{ settings_menu.title }}</p>
							</div>
							<div class="wpf_payment_setting_forward_icon">
								<img :src="ImageIconUrl('images/global/forward.svg')" alt="Forward Icon">
							</div>
						</router-link>
					</li>
					<li class="wpf_gateway_request">
                        <a href="https://paymattic.com/payment-gateway-request/" target="_blank" class="wpf-btn">
                            {{ $t('Request a payment gateway') }}
                        </a>
                    </li>
				</ul>
			</div>
			<div class="wppayform_main_content_v2 border-radius-8" style="position: relative;">
				<AppCard v-if="checkIsProItem()">
					<template slot="header">
						<h3 style="display: flex; gap: 10px;">
							{{ paymentTitle() }} {{ $t('Settings')}}
							<Icon icon="wpf-upgrade" />
						</h3>
					</template>
					<template slot="body">
						<div style="height: 100vh;">
							<UpgradeNotice v-if="checkIsProItem()" :title="getTitle()" :type="('cart')" style="top: 28% !important;" />
						</div>
					</template>
				</AppCard>
				<!-- <template  v-else-if="checkAddon()">
					<div class="payform_addon_insatll_section">
						<Icon icon="wpf-download" />
						<p>{{$t('This is an Addon for Paymattic Pro')}}</p>
						<el-button v-loading="enabling" type="primary" @click=installAddon()>Install & Activate {{ addonTitle }}</el-button>
					</div>
				</template> -->
				<AppCard v-else-if="checkAddon()">
					<template slot="header">
						<h3>{{ paymentTitle() }} {{ $t('Settings')}}</h3>
					</template>
					<template slot="body">
						<div class="payform_addon_insatll_section">
							<div class="wpf_addon_body_section">
								<Icon icon="wpf-download" />
								<p>{{$t('This is an Addon for Paymattic Pro')}}</p>
								<el-button v-loading="enabling" type="primary" @click=installAddon()>Install & Activate {{ addonTitle }}</el-button>
							</div>
						</div>
					</template>
				</AppCard>
				<GlobalPaymentComponents v-else key="products_view" />
			</div>
		</div>
	</div>
</template>
<script type="text/babel">
import GlobalPaymentComponents from './GlobalPaymentComponents.vue';
import UpgradeNotice from '../../Common/UpgradeNotice.vue';
import AppCard from '../../Common/AppCard.vue';
import Icon from '../../Icons/Index.vue';

export default {
	name: 'Gateways',
	props: ['settings'],
	components: {
		GlobalPaymentComponents,
		UpgradeNotice,
		AppCard,
		Icon
	},
	data() {
		return {
			current_route: this.$route.name,
			loading: false,
			selectedMethod: '',
			search: '',
			route: '',
			availableGateways: [
			],
			gateways: this.availableGateways,
			addonSlug: '',
			addonTitle: '',
			enabling: false,
			has_pro: window.wpPayFormsAdmin.has_pro,
		};
	},
	methods: {
		makeFocus() {
			setTimeout(() => {
				this.$refs.search_input_ref.focus();
			}, 100);
		},
		checkIsProItem() {
			if (this.$route.name == 'offline' || this.$route.name == 'stripe') {
				return false;
			}
			return !this.has_pro;
		},
		checkAddon() {
			if (undefined !== this.$route.meta.addon_slug) {
				this.addonSlug = this.$route.meta.addon_slug;
				this.addonTitle = this.$route.meta.title
			}
			return this.has_pro && undefined !== this.$route.meta.Addon && this.$route.meta.Addon === 'yes' && undefined !== this.$route.meta.addon_slug;
		},
		getTitle() {
			return this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1).toLowerCase() + ' payment is a pro version feature.';;
		},
		paymentTitle() {
			return this.$route.name.charAt(0).toUpperCase() + this.$route.name.slice(1).toLowerCase();
		},
		onSearch(str) {
			let filterers = {};
			this.availableGateways = window.wpPayFormsAdmin.payment_methods;
			for (let key in this.availableGateways) {
				if (this.availableGateways[key]?.title.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
					filterers[key] = this.availableGateways[key];
				}
			}

			let firstVal = Object.values(filterers)[0];
			if (firstVal && this.$route.name !== firstVal.route_name) {
				this.$router.push(firstVal.route_name);
			}
		},
		installAddon() {
			this.enabling = true;
			
			let data = {
				name: this.$route.name,
				title: this.$route.meta.title,
				url: this.$route.meta.url,
				source: this.$route.meta.source,
				slug: this.$route.meta.addon_slug
			}
			this.$post(`paymattic/addons/install`, data)
				.then(response => {
					this.$notify.success({
						title: "Success!",
						offset: 30,
						message: response.data.message,
						position: 'bottom-right'
					})
					location.reload();
				})
				.fail(error => {
					this.$notify.error({
						title: 'Oops!',
						message: error.responseJSON.message,
						position: 'bottom-right'
					});
				})
				.always(() => {
					this.enabling = false;
				});
		},
		assetsUrl(path) {
			return window.wpPayFormsAdmin.assets_url + 'images/global/payment_icon/' + path + '.' + 'svg';
		},
		getPaymentMethodIcon (status) {
			if (status === 'stripe') {
				return this.assetsUrl(status);
			} else if (status === 'offline') {
				return this.assetsUrl(status);
			} else if (status === 'paypal') {
				return this.assetsUrl(status);
			} else if (status === 'mollie') {
				return this.assetsUrl(status);
			} else if (status === 'razorpay') {
				return this.assetsUrl(status);
			} else if (status === 'paystack') {
				return this.assetsUrl(status);
			} else if (status === 'payrexx') {
				return this.assetsUrl(status);
			} else if (status === 'square') {
				return this.assetsUrl(status);
			} else if (status === 'sslcommerz') {
				return this.assetsUrl(status);
			} else if (status === 'billplz') {
				return this.assetsUrl(status);
			}  else if (status === 'xendit') {
				return this.assetsUrl(status);
			}  else if (status === 'flutterwave') {
				return this.assetsUrl(status);
			}  else if (status === 'moneris') {
				return this.assetsUrl(status);
			}  else if (status === 'vivawallet') {
				return this.assetsUrl(status);
			}  else if (status === 'authorizedotnet') {
				return this.assetsUrl(status);
			} else {
				return ;
			}
		},
		ImageIconUrl(path){
			return window.wpPayFormsAdmin.assets_url + path;
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
	mounted() {
		this.availableGateways = window.wpPayFormsAdmin.payment_methods;
		this.route = this.$route.name;
		jQuery('li.wpf_menu_payments').addClass('active');
		const path = this.$route.name;
		this.selectedMethod = 'stripe';
		if (path) {
			this.selectedMethod = path;
		}
		this.gateways = this.availableGateways;
		window.WPPayFormsBus.$emit('site_title', 'Payment Gateways');
	},
	created() {
		has_pro: window.wpPayFormsAdmin.has_pro
	}
};
</script>
<style lang="scss" scoped >
.wpf_gateway_request {
    margin-top: 20px;
    text-align: center;

    .wpf-btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #0073aa;
        color: #fff;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #005177;
        }

        a {
            color: inherit;
            text-decoration: none;
        }
    }
}
// .search_icon {
// 	position: absolute;
// 	top: 10px;
// 	left: 37%;
// 	cursor: pointer;

// 	i {
// 		color: gray;
// 		font-size: 18px;
// 		font-weight: 700;
// 	}
// }
// .payform_addon_insatll_section{
// 	margin: 20px;
//     padding: 22px;
//     background: #e4e7ed;
// 	text-align: center;
// }
</style>

