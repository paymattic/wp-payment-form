<template>
	<div class="wpf_email_resend_inline">
		<!-- <el-button
			v-if="element_type == 'button'"
			icon="el-icon-message"
			@click="getNotifications"
			type="info"
			size="mini"
			>{{ btn_text }}
		</el-button> -->
		<span @click="getNotifications">Send Email Notification Manually</span>
		<el-dialog
			title="Choose Email Notification"
			top="42px"
			@close="resetData()"
			:append-to-body="true"
			:visible.sync="dialogVisible"
			width="60%"
		>
			<template v-if="has_pro">
				<el-form
					label-width="210px"
					ref="form"
					:model="form"
					label-position="left"
					class="wpf_email_notification"
				>
					<el-form-item label="Notification">
						<el-select
							v-loading="fetching"
							size="small"
							placeholder="Select Notification"
							v-model="form.notification_id"
						>
							<el-option
								v-for="notification in notifications"
								:value="notification.id"
								:label="notification.name"
								:key="notification.id"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="Send To">
						<el-radio-group
							size="small"
							v-model="form.send_to_type"
						>
							<el-radio-button label="default"
								>Default Recipient</el-radio-button
							>
							<el-radio-button label="custom"
								>Custom Recipient</el-radio-button
							>
						</el-radio-group>
					</el-form-item>
					<template v-if="form.send_to_type == 'custom'">
						<el-form-item label="Recipient">
							<el-input
								v-model="form.send_to_custom_email"
								size="small"
								placeholder="Please Type Recipient Email Address"
							/>
						</el-form-item>
					</template>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false" size="small"
						>Cancel</el-button
					>
					<el-button
						v-loading="sending"
						:disabled="!isActive"
						size="small"
						type="primary"
						@click="send()"
						>Send this notification</el-button
					>
				</span>
			</template>
			<div style="text-align: center" v-else>
				<h3>This feature is available on pro version of Paymattic.</h3>
				<a
					target="_blank"
					rel="noopener"
					:href="upgrade_url"
					class="el-button el-button--danger"
				>
					Buy Pro Now
				</a>
			</div>
		</el-dialog>
	</div>
</template>
<script type="text/babel">
	export default {
		name: 'resentEmailNotification',
		props: {
			entry_id: {
				default() {
					return '';
				}
			},
			form_id: {
				required: true
			},
			entry_ids: {
				default() {
					return [];
				}
			},
			element_type: {
				default() {
					return 'button';
				}
			},
			btn_text: {
				default() {
					return 'Send Email Notification Manually';
				}
			}
		},
		data() {
			return {
				has_pro: window.wpPayFormsAdmin.has_pro,
				dialogVisible: false,
				fetching: true,
				sending: false,
				form: {
					notification_id: '',
					send_to_type: 'default',
					send_to_custom_email: ''
				},
				notifications: [],
				upgrade_url:
					'https://paymattic.com/#pricing'
			};
		},
		computed: {
			isActive() {
				if (this.form.send_to_type == 'custom') {
					return (
						this.form.notification_id !== '' &&
						this.form.send_to_custom_email
					);
				}
				return this.form.notification_id !== '';
			}
		},
		methods: {
			send() {
				this.sending = true;
				this.$post(`form/${this.form_id}/email/resend`, {
					submission_id: parseInt(this.entry_id),
					submissions: this.entry_ids,
					info: this.form
				})
					.then((res) => {
						if (res.success) {
							this.$notify.success({
								title: 'Success',
								message: res.data,
								offset: 40,
								duration: 5000,
								position: 'bottom-right'
							});
						} else {
							this.$notify.error({
								title: 'Oops!',
								message: res.message,
								offset: 40,
								duration: 5000,
								position: 'bottom-right'
							});
						}
						this.sending = false;
					})
					.fail((e) => {
						this.$notify.error({
							    title: 'Oops!',
								message: e.responseJSON.data.err,
								offset: 40,
								duration: 5000,
								position: 'bottom-right'
						});
						this.sending = false;
					})
					.always(() => {
						this.sending = false;
					});
			},
			resetData() {
				this.form = {
					notification_id: '',
					send_to_type: 'default',
					send_to_custom_email: ''
				};
			},
			getNotifications() {
				this.dialogVisible = true;
				if (!this.has_pro) {
					return;
				}
				this.fetching = true;
				this.$get(`form/${this.form_id}/email/only`, {})
					.then((response) => {
						this.notifications = response.notifications;
						this.fetching = false;
					})
					.always(() => {
						this.fetching = false;
					});
			}
		}
	};
</script>

<style lang="scss">
	.wpf_email_resend_inline {
		cursor: pointer;
	}
</style>
