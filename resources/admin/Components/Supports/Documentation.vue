<template>
	<div>
		<el-row style="border: 1px solid white;">
			<el-col v-for="(item, i) in items" :key="i" :xs="24" :md="8">
				<div class="wpf_support_block_with_img">
					<img :src="assetsUrl(item.img)" alt="" />
					<div class="support_block_header">
						<h3>{{ $t(item.title) }}</h3>
					</div>
					<div class="support_block_body">
						<p>
							{{ $t(item.des) }}
						</p>
						<a
							target="_blank"
							class="el-button el-button--mini is-plain"
							:href="item.url"
							type="info"
							>{{ item.btn }}</a
						>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :xs="24" :md="12">
				<div class="wpf_support_block">
					<div class="support_block_header">
						<h3>Documentation and User Guide</h3>
					</div>
					<div class="support_block_body">
						<ul class="support_block_lists">
							<li v-for="(list,i) in docs" :key="i">
								<h4>{{ list.title }}</h4>
								<ul>
									<li v-for="(doc, it) in list.docs" :key="it">
										<a
											target="_blank"
											rel="noopener"
											:href="doc.url"
										>
											{{ doc.title }}
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :md="12">
				<div v-if="has_pro" class="wpf_support_block">
					<div class="support_block_header">
						<h3><i class="el-icon-star-off"/> Latest Features</h3>
					</div>
					<div class="support_block_body">
						<p>
							The current version has some amazing features,
							Check them to get more clear documentation.
						</p>
						<ul class="wpf_no_style top-features">
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://docs.paymattic.com/add-fee-recovery-field">Fee Recovery — pass gateway fees to donors</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://docs.paymattic.com/add-gift-aid">Gift Aid for Donations</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://docs.paymattic.com/givewp-migration">GiveWP Migration Tool</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-add-shopping-cart-in-wordpress/">Form cart template</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-manage-subscriptions-in-wordpress-with-paymattic/">Offline subscription payment management</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/creating-a-step-form-with-paymattic/">Step form</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-use-conditional-logic-in-form-fields-with-paymattic">Conditional Logic on Form Fields</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-integrate-lifterlms-in-wordpress-with-paymattic/">LifterLMS Course Enrollment</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-integrate-learndash-in-wordpress-with-paymattic/">LearnDash Course Enrollment</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-integrate-tutor-lms-in-wordpress-with-paymattic/">TutorLMS Course Enrollment</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-view-the-reports-and-payment-analytics-in-wordpress-with-paymattic/">Global Reports module</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-integrate-square-with-paymattic-in-wordpress/">Square payment gateway</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/integrate-google-sheets-in-wordpress-with-paymattic/">Google Sheets integration</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://paymattic.com/docs/how-to-configure-stripe-payment-gateway-in-wordpress-with-paymattic/">Stripe SCA / 3D Secure support</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								<a target="_blank" href="https://docs.paymattic.com/add-subscription-payment-fields">Donation field with recurring</a>
							</li>
							<li>
								<i class="el-icon-star-on"></i>
								Bug fixes with a lot more features
							</li>
						</ul>
						<i class="el-icon-right" style="margin-right: 12px; font-size: 16px;"></i>
						<a style="text-decoration: none"
							target="_blank"
							href="https://paymattic.com/docs/"
						>
							Check documentation here
						</a>
						<i class="el-icon-right" style="margin-right: 12px; font-size: 16px;"></i>
						<a style="text-decoration: none"
							target="_blank"
							href="https://paymattic.com/docs/change-log/"
						>
							Check full changelog here
						</a>
					</div>
				</div>
				<div v-else class="wpf_support_block">
					<div class="support_block_header">
						<h3>Paymattic Pro Features</h3>
					</div>
					<div class="support_block_body">
						<p>
							Upgrade to Paymattic Pro and get more information
							about your submission, Plus you will get the
							following features
						</p>
						<ul class="wpf_no_style">
							<li>
								<i class="el-icon-circle-check"></i> View
								Full reports with data and graphs
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Manage
								Customers with powerful listing and filtering
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								donations with recurring payments
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Subscription/Recurring Payments
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via PayPal
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Mollie
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Razorpay
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Paystack
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Payrexx
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Billplz
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via SSLCOMMERZ
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Xendit
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Accept
								Payment via Offline
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Collect Tax
								with Payment Items
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Tabular
								Product Order Field
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Get Email
								Notification on Form Submission
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Send
								Customized Email to form submitter
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Poweful
								Email Notification System
							</li>
							<li>
								<i class="el-icon-circle-check"></i> File Upload
								Field
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Export and
								Print Your Data (Excel/CSV/JSON)
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Form
								Scheduling and Submission Restriction Module
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Get
								Powerful reporting features
							</li>
							<li>
								<i class="el-icon-circle-check"></i> Get
								Get payments with custom discounts
							</li>
						</ul>
						<a
							target="_blank"
							href="https://paymattic.com/#pricing/?utm_source=upgrade&amp;utm_medium=url&amp;utm_campaign=wppayform_upgrade"
							class="el-button payform_action el-button--danger el-button--mini"
						>
							Upgrade To Pro
						</a>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row v-if="!has_pro" :gutter="20">
			<el-col :xs="24" :md="12">
				<div class="wpf_support_block">
					<div class="support_block_header">
						<h3>Feedback and Support us</h3>
					</div>
					<div class="support_block_body">
						<p>We'd love your help, feedback and support.</p>
						<ul class="support_items">
							<li>
								<a target="_blank" href="https://wordpress.org/plugins/wp-payment-form/#reviews">Rate our plugin</a> and help spread the word!
							</li>
							<li>
								Report bugs (with steps to reproduce) or <a target="_blank" href="https://github.com/WPManageNinja/wp-payment-form">submit pull requests on GitHub</a>
							</li>
							<li>
								Have a question? <a target="_blank" href="https://paymattic.com/docs/">Read docs or Frequently asked question</a>
							</li>
							<li>
								Need Expert Support? <a target="_blank" href="https://wpmanageninja.com/support-tickets/">Open a support Ticket</a>
							</li>
						</ul>
					</div>
				</div>
			</el-col>
			<el-col :xs="24" :md="12">
				<div class="wpf_support_block">
					<div class="support_block_header">
						<h3>Recommended Plugins</h3>
					</div>
					<div class="support_block_body">
						<p>We have developed few awesome plugin that you can give a try too</p>
						<ul class="support_items">
							<li>
								<b><a target="_blank" href="https://wordpress.org/plugins/fluent-crm/">Fluent CRM</a></b> - The easiest and fastest email newsletter, email marketing plugin & crm solution for wordpress
							</li>
							<li>
								<b><a target="_blank" href="https://wpmanageninja.com/azonpress/">AzonPress</a></b> - The Most Intuitive WordPress Plugin for Amazon Affiliates
							</li>
						</ul>
					</div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script type="text/babel">
	export default {
		name: 'documentation',
		data() {
			return {
				docs: {
					getting_started: {
						title: 'Getting Started with Paymattic',
						docs: [
							{
								title: 'Install and Activate - Paymattic',
								url: 'https://paymattic.com/docs/how-to-install-and-activate-paymattic-in-wordpress/'
							},
							{
								title: 'Configure Payment Methods and Currency',
								url: 'https://paymattic.com/docs/how-to-configure-stripe-payment-gateway-in-wordpress-with-paymattic/'
							}
						]
					},
					form_configuration: {
						title: 'Form Configuration',
						docs: [
							{
								title: 'Create your first Payment Form in a minute',
								url: 'https://paymattic.com/docs/how-to-create-your-first-payment-form-in-a-minute-and-accept-payments-with-paymattic/'
							},
							{
								title: 'General input fields',
								url: 'https://paymattic.com/docs/how-to-use-general-form-input-fields-in-wordpress-with-paymattic/'
							},
							{
								title: 'Form Confirmation Settings',
								url: 'https://paymattic.com/docs/how-to-configure-confirmation-settings-in-wordpress-with-paymattic/'
							},
							{
								title: 'Custom Currency Settings',
								url: 'https://paymattic.com/docs/how-to-change-currency-settings-in-wordpress-with-paymattic/'
							},
							{
								title: 'Form Design Settings',
								url: 'https://paymattic.com/docs/how-to-customize-form-design-settings-in-wordpress-with-paymattic/'
							},
							{
								title: 'Form Scheduling and Restriction Settings',
								url: 'https://paymattic.com/docs/how-to-set-form-scheduling-and-restriction-settings-in-wordpress-with-paymattic/'
							},
							{
								title: 'Step Form',
								url: 'https://paymattic.com/docs/creating-a-step-form-with-paymattic/'
							},
							{
								title: 'Conditional Logic on Form Fields',
								url: 'https://paymattic.com/docs/how-to-use-conditional-logic-in-form-fields-with-paymattic'
							}
						]
					},
					payment_gateways: {
						title: 'Payment Gateways',
						docs: [
							{
								title: 'Stripe Payment Gateway',
								url: 'https://paymattic.com/docs/how-to-configure-stripe-payment-gateway-in-wordpress-with-paymattic/'
							},
							{
								title: 'PayPal Payment Gateway',
								url: 'https://paymattic.com/docs/how-to-configure-paypal-in-wordpress-with-paymattic/'
							},
							{
								title: 'Mollie Payment Gateway',
								url: 'https://paymattic.com/docs/how-to-integrate-mollie-in-wordpress-with-paymattic/'
							},
							{
								title: 'Razorpay Payment Gateway',
								url: 'https://paymattic.com/docs/how-to-integrate-razorpay-with-paymattic-in-wordpress/'
							},
							{
								title: 'Paystack Payment Gateway',
								url: 'https://docs.paymattic.com/integrate-paystack'
							},
							{
								title: 'Square Payment Gateway',
								url: 'https://paymattic.com/docs/how-to-integrate-square-with-paymattic-in-wordpress/'
							},
							{
								title: 'Xendit Payment Gateway',
								url: 'https://paymattic.com/docs/how-to-integrate-xendit-in-wordpress/'
							},
							{
								title: 'Authorize.net',
								url: 'https://docs.paymattic.com/configure-authorize-net'
							},
							{
								title: 'Viva Wallet',
								url: 'https://docs.paymattic.com/integrate-viva-wallet'
							},
							{
								title: 'Moneris',
								url: 'https://docs.paymattic.com/integrate-moneris'
							},
							{
								title: 'Offline / Manual Payment',
								url: 'https://docs.paymattic.com/collect-offline-payment'
							}
						]
					},
					subscriptions: {
						title: 'Subscriptions & Recurring Payments',
						docs: [
							{
								title: 'Subscription Payment Item Fields',
								url: 'https://paymattic.com/docs/how-to-add-susbcription-payment-item-fields-in-paymattic/'
							},
							{
								title: 'Accept Recurring Payments with Stripe',
								url: 'https://docs.paymattic.com/add-subscription-payment-fields'
							},
							{
								title: 'Manage Subscriptions',
								url: 'https://paymattic.com/docs/how-to-manage-subscriptions-in-wordpress-with-paymattic/'
							},
							{
								title: 'Offline Subscription Payment Management',
								url: 'https://paymattic.com/docs/how-to-manage-subscriptions-in-wordpress-with-paymattic/'
							}
						]
					},
					pro_fields: {
						title: 'Pro Form Fields',
						docs: [
							{
								title: 'Coupon / Discount Codes',
								url: 'https://paymattic.com/docs/how-to-add-coupon-in-wordpress-payment-form-with-paymattic/'
							},
							{
								title: 'Tax Item Field',
								url: 'https://paymattic.com/docs/how-to-add-tax-calculated-amount-field-in-wordpress-with-paymattic/'
							},
							{
								title: 'Fee Recovery Field',
								url: 'https://docs.paymattic.com/add-fee-recovery-field'
							},
							{
								title: 'File Upload Field',
								url: 'https://paymattic.com/docs/how-to-use-file-upload-field-in-wordpress-with-paymattic/'
							},
							{
								title: 'Tabular Products Field',
								url: 'https://paymattic.com/docs/how-to-add-tabular-product-item-fields-in-wordpress-with-paymattic/'
							},
							{
								title: 'Currency Switcher Field',
								url: 'https://paymattic.com/docs/add-currency-switcher-in-wordpress-form/'
							},
							{
								title: 'Gift Aid for Donations',
								url: 'https://docs.paymattic.com/add-gift-aid'
							}
						]
					},
					integrations: {
						title: 'Integrations',
						docs: [
							{
								title: 'FluentCRM Integration',
								url: 'https://paymattic.com/docs/how-to-integrate-fluentcrm-in-wordpress-with-paymattic/'
							},
							{
								title: 'MailChimp Integration',
								url: 'https://paymattic.com/docs/how-to-integrate-mailchimp-in-wordpress-with-paymattic/'
							},
							{
								title: 'Slack Integration',
								url: 'https://paymattic.com/docs/how-to-integrate-slack-in-wordpress-with-paymattic/'
							},
							{
								title: 'Google Sheets Integration',
								url: 'https://paymattic.com/docs/integrate-google-sheets-in-wordpress-with-paymattic/'
							},
							{
								title: 'Zapier Integration',
								url: 'https://paymattic.com/docs/how-to-integrate-zapier-with-paymattic-in-wordpress/'
							},
							{
								title: 'Webhook Integration',
								url: 'https://paymattic.com/docs/how-to-integrate-webhook-in-wordpress-with-paymattic/'
							},
							{
								title: 'LifterLMS Course Enrollment',
								url: 'https://paymattic.com/docs/how-to-integrate-lifterlms-in-wordpress-with-paymattic/'
							},
							{
								title: 'LearnDash Course Enrollment',
								url: 'https://paymattic.com/docs/how-to-integrate-learndash-in-wordpress-with-paymattic/'
							},
							{
								title: 'TutorLMS Course Enrollment',
								url: 'https://paymattic.com/docs/how-to-integrate-tutor-lms-in-wordpress-with-paymattic/'
							},
							{
								title: 'ActiveCampaign',
								url: 'https://docs.paymattic.com/integrate-activecampaign'
							},
							{
								title: 'FluentSupport',
								url: 'https://docs.paymattic.com/integrate-fluent-support'
							},
							{
								title: 'FluentCommunity',
								url: 'https://docs.paymattic.com/integrate-fluentcommunity'
							},
							{
								title: 'Telegram',
								url: 'https://docs.paymattic.com/integrate-telegram'
							},
							{
								title: 'Twilio',
								url: 'https://docs.paymattic.com/integrate-twilio'
							},
							{
								title: 'User Registration',
								url: 'https://docs.paymattic.com/create-user-registration-form'
							}
						]
					},
					form_entries: {
						title: 'Managing Form Entries',
						docs: [
							{
								title: 'View and Manage all Form Entries',
								url: 'https://paymattic.com/docs/how-to-view-and-manage-all-form-entries-in-wordpress-with-paymattic/'
							},
							{
								title: 'View Single Submission Data and Managing Payments',
								url: 'https://paymattic.com/docs/how-to-view-single-submission-data-and-manage-payments-in-paymattic/'
							},
							{
								title: 'Export Submission Data (CSV)',
								url: 'https://paymattic.com/docs/how-to-export-form-entries-in-csv-excel-ods-and-json/'
							},
							{
								title: 'Cancel Subscription',
								url: 'https://docs.paymattic.com/cancel-subscription'
							},
							{
								title: 'Refund Payments',
								url: 'https://docs.paymattic.com/refund-payments'
							},
							{
								title: 'Import / Export Forms',
								url: 'https://docs.paymattic.com/import-export-forms'
							}
						]
					},
					reports: {
						title: 'Reports & Analytics',
						docs: [
							{
								title: 'Global Reports Dashboard',
								url: 'https://paymattic.com/docs/how-to-view-the-reports-and-payment-analytics-in-wordpress-with-paymattic/'
							},
							{
								title: 'Customer Management',
								url: 'https://paymattic.com/docs/how-to-view-customer-profile-in-wordpress/'
							}
						]
					},
					user_dashboard: {
						title: 'User Dashboard & PDF',
						docs: [
							{
								title: 'User Submission Dashboard',
								url: 'https://paymattic.com/docs/how-to-add-user-dashboard-module-in-paymattic/'
							},
							{
								title: 'PDF Invoice Generation',
								url: 'https://paymattic.com/docs/how-to-create-pdf-feed-for-form-submissions/'
							},
							{
								title: 'Donation Leaderboard',
								url: 'https://paymattic.com/docs/how-to-use-donation-leaderboard-in-wordpress-with-paymattic/'
							}
						]
					},
					email_notifications: {
						title: 'Email Notifications',
						docs: [
							{
								title: 'Setup Email Notifications',
								url: 'https://docs.paymattic.com/setup-email-notifications'
							},
							{
								title: 'Email Notifications for Subscription Cancel',
								url: 'https://docs.paymattic.com/enable-subscription-cancel-email'
							},
							{
								title: 'Email Notifications for Donation',
								url: 'https://docs.paymattic.com/email-notification-for-donation'
							}
						]
					},
					rest_api: {
						title: 'Developer & REST API',
						docs: [
							{
								title: 'Customize and Access your data from the REST API',
								url: 'https://rest-api.paymattic.com'
							},
							{
								title: 'GiveWP Migration to Paymattic',
								url: 'https://docs.paymattic.com/givewp-migration'
							}
						]
					}
				},
				items: {
					support1: {
						title: 'Need And Expert Support?',
						des:
							'Our EXPERTS would like to assist you for your query and any customization.',
						url: 'https://wpmanageninja.com/support-tickets/',
						img: 'images/supports/support.png',
						btn: 'Contact Support'
					},
					support2: {
						title: 'Love this Plugin?',
						des:
							'Please write a review in wp.org plugin repository. We appreciate it!',
						url: 'https://wordpress.org/plugins/wp-payment-form/',
						img: 'images/supports/like.png',
						btn: 'Write a Review'
					},
					support3: {
						title: 'Found a Bug?',
						des:
							'Please report us and we promise we will fix that as soon as humanly possible',
						url: 'https://wpmanageninja.com/support-tickets/',
						img: 'images/supports/bug.png',
						btn: 'Let us know'
					}
				}
			};
		},
		methods: {
			assetsUrl(path) {
				return window.wpPayFormsAdmin.assets_url + path;
			}
		}
	};
</script>
<style lang="scss" scoped>
	.wpf_tab_title {
		font-size: 17px;
		color: #6e6e6e;
		margin: 20px;
	}
	.wpf_support_block_with_img {
		padding: 12px;
		background: white;
		text-align: center;
		margin: 12px;
		min-height: 200px;
	}
	i.el-icon-star-on {
		color: gold !important;
		margin-right: 12px;
	}
	ul.wpf_no_style.top-features a {
		text-decoration: none;
	}
</style>
