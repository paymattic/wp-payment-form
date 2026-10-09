<template>
    <div class="payform_upgrade_section_cart" v-if="type === 'cart'">
        <div class="wpf_upgrade_pro_icon">
            <Icon icon="wpf-pro" />
        </div>
        <h4 style="text-align: center;">{{title}}</h4>
        <a target="_blank" style="display: flex;gap: 6px;" :href="pro_purchase_url" class="el-button el-button--small el-button--primary">
            <Icon icon="wpf-upgrade-white" /> Upgrade Now
        </a>
    </div>
    <div v-else="" class="payform_upgrade_section">
        <div class="wpf_upgrade_pro_title">
            🎉 <span class="pro_title">{{ title }}</span>
        </div>
        <div>
            <a target="_blank" :href="pro_purchase_url" class="wpf_upgrade_url">Upgrade Now</a>
        </div>

    </div>

</template>

<script>
import Icon from '../Icons/Index.vue';
export default {
    name: 'UpgradeNotice',
    components: { Icon },
    props: ['title', 'type'],

}
</script>
<style scoped lang="scss">
// .payform_upgrade_section_cart {
// 	padding: 60px 0px;
// 	background: #F9FAFB;
// 	border-radius: 8px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     width: 100%;
//     .wpf_upgrade_pro_icon {
//         display: flex;
//         justify-content: center;
//         align-items: center;

//         .icon {
//             padding: 25px 28px;
//             background: #FEF3EB;
//             border-radius: 50%;
//         }
//     }
//     h4 {
//         padding: 25px 0 20px 0;
//         color: #2F3448;
//         font-family: Inter;
//         font-size: 14px;
//         font-style: normal;
//         font-weight: 500;
//         line-height: 20px;
//         margin: 0;
//     }
// }
</style>