<template>
	<!-- <el-table :data="revData" max-height="350" stripe style="width: 100%">
		<el-table-column prop="date" :label="$t('Date')" width="180"></el-table-column>
		<el-table-column prop="payment_status" :label="$t('Status')" width="180"></el-table-column>
		<el-table-column prop="submissions" :label="$t('Submissions')" width="180"></el-table-column>
		<el-table-column prop="total_paid" :label="$t('Net')" width="180"> </el-table-column>
		<el-table-column prop="currency" :label="$t('Currency')"></el-table-column>
	</el-table> -->
	<ul>
		<li v-for="item in revData" :key="item.id">
			<div class="item-left">
				<div class="status_and_date">
					<span class="date">{{ item.date }}</span>
					<div class="payment_status">
						<div :class="`badge ${item.payment_status}`">
							<Icon :icon="getPaymentStatusIcon(item.payment_status)" /> {{item.payment_status}}
						</div>
					</div>
				</div>
				<div class="submissions">
					<span>{{ item.submissions }} {{ $t('Entries') }}</span>
				</div>
			</div>
			<div class="item-right">
				<div class="total_paid">
					<span>{{ item.total_paid }} {{ item.currency }}</span>
				</div>
			</div>
			 <!-- - {{ item.payment_status }} - {{ item.submissions }} - {{ item.total_paid }} - {{ item.currency }} -->
		</li>
	</ul>
</template>

<script>
import Icon from '@admin/Components/Icons/Index.vue';
import { paymentStatusIcon } from '../../Components/helper.js';
	export default {
		components: {
			Icon
		},
		props: ['revData'],
		methods: {
			getPaymentStatusIcon(status) {
				return paymentStatusIcon(status);
			}
		}
	};
</script>

<style scoped>
</style>
