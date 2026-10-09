<template>
    <div class="over_view_card">
        <div class="card_header">
            <div class="header_icon" :style="{ background: color }">
                <Icon :icon="icon"></Icon>
            </div>
            <div class="content">
                <h6>{{ item.title }}</h6>
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 4px;"
                        v-if="typeof item.value === 'object' && item.value.length > 0">
                        <h3 v-for="(val, index) in previewValues" :key="index" style="display: flex; align-items: center; gap: 2px;">
                            <span v-html="getCurrencySymbol(val.currency)"></span>
                            {{ removeDecimalPoint(val.total_paid) }}
                            <span v-if="index < previewValues.length - 1">,</span>
                        </h3>
                        <span v-if="item.value.length > 2" class="wpf-more-currencies">
                            +{{ item.value.length - 2 }} more
                        </span>
                    </div>
                    <div v-else>
                        <h3>
                            {{ typeof item.value == 'object' ? item.value[0]?.currency : item && item?.currency }}
                            {{ typeof item.value == 'object' ? item.value[0]?.total_paid : item && item?.value }}
                        </h3>
                    </div>
                    <div v-if="showReportsBadge(item)">
                        <div class="badge down_stats" v-if="item.change < 0">
                            <Icon icon="wpf-down"></Icon>
                            <span>{{ item.change }} % </span>
                        </div>
                        <div v-else class="badge">
                            <Icon icon="wpf-up"></Icon>
                            <span> + {{ item.change }} % </span>
                        </div>
                    </div>
                </div>
                <el-popover
                    placement="bottom"
                    width="280"
                    trigger="click"
                    v-if="item.value.length > 2"
                >
                    <div class="payments">
                        <div v-for="(value, index) in item.value" :key="index">
                            <div class="payment">
                                <h6><span v-html="getCurrencySymbol(value.currency)"></span></h6>
                                <h6>{{ removeDecimalPoint(value.total_paid) }}</h6>
                            </div>
                        </div>
                    </div>
                    <div slot="reference" class="redirect_btn_wrapper">
                        <span class="redirect_btn">
                            {{ $t('Expand All') }}
                        </span>
                        <Icon icon="wpf-link"></Icon>
                    </div>
                </el-popover>
                <div v-else @click="redirectPage(redirectUrl)" class="redirect_btn_wrapper">
                    <span class="redirect_btn">
                        {{ filter_label }}
                    </span>
                    <Icon icon="wpf-link"></Icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Icon from '@admin/Components/Icons/Index.vue';
export default {
    components: {
        Icon
    },
    props: {
        item: {
            type: [Object, Array],
            required: true
        },
        filter_label: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: 'wpf-customers'
        },
        color: {
            type: String,
            default: '#E6F2FE'
        },
        redirectUrl: {
            type: [Object, String],
            default: ''
        }
    },
    computed: {
        previewValues() {
            if (Array.isArray(this.item.value)) {
                return this.item.value.slice(0, 2);
            }
            return [];
        }
    },
    methods: {
        getCurrencySymbol(code) {
            if (!code) return '';
            try {
                // narrowSymbol gives "Rp" for IDR, "€" for EUR, "$" for USD, etc.
                const parts = new Intl.NumberFormat('en', {
                    style: 'currency',
                    currency: code.toUpperCase(),
                    currencyDisplay: 'narrowSymbol'
                }).formatToParts(1);
                const symbolPart = parts.find(p => p.type === 'currency');
                return symbolPart ? symbolPart.value : code.toUpperCase();
            } catch (e) {
                return code.toUpperCase();
            }
        },
        removeDecimalPoint(numberString) {
            let cleanedString = String(numberString).replace(/,/g, '');
            let floatNumber = parseFloat(cleanedString);
            return Math.floor(floatNumber);
        },
        redirectPage(url) {
            if (url) {
                this.$router.push({
                    name: this.redirectUrl.name,
                    params: { filter_data: this.redirectUrl.query }
                });
            }
        },
        showReportsBadge(item) {
            if (item.change === undefined || item.change === null) {
                return false;
            }
            if (Object.keys(item.value).length > 1) {
                return false;
            }
            return true;
        }
    }
}
</script>

<style scoped>
.wpf-more-currencies {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
}
</style>
