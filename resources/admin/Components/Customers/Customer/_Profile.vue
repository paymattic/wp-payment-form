<template>
    <div class="wpf_customer_profile_wrapper" element-loading-text="Loading..." element-loading-spinner="el-icon-loading" v-loading="fetchingProfile" >
        <app-card>
            <div slot="header" class="header">
                <h3 class="wpf_customer_profile_title">{{ $t('Customer Profile') }}</h3>
            </div>
            <div slot="body" class="profile_body">
                <div class="profile">
                    <div v-if="info.fluent_crm" v-html="info.fluent_crm"></div>
                    <div v-else class="wpf_customer_profile_avatar" v-html="info.avatar"></div>
                    <div class="wpf_customer_profile_name">
                        <h3 class="customer_name" v-if="!info.fluent_crm" style="text-transform: capitalize;">
                            {{ info.customer_name }}</h3>
                        <p class="customer_email">
                            <!-- <i class="el-icon-message"></i> -->
                            <a :href="'mailto:' + customer_email">{{ customer_email }}</a>
                        </p>
                    </div>
                </div>
                <div class="sub-title">
                    <p class="title"> {{ $t('Since') }}</p>
                    <span>{{ info.created_at | dateFormat('MMM DD, YYYY h:mm a') }}</span>
                </div>

                <div class="sub-title">
                    <p class="title"> {{ $t('Customer Spent') }}</p>
                    <div class="summary_item" v-for="(item, i) in spends" :key="i">
                        <span class="summary_label">{{ item.currency }}</span>
                        <span class="summary_val"><span v-html="item.sign"></span> {{ item.formatted_price }}</span>
                    </div>
                </div>

                <div class="sub-title" v-if="!spends.length">
                   <p> No payment received! </p>
                </div>
            </div>
        </app-card>

        <app-card>
            <div slot="header" class="header">
                <h3 class="wpf_customer_profile_title">{{ $t('Permissions') }}</h3>
            </div>

            <div slot="body">
                <div class="has_site_access" v-if="user_id">
                        <div style="display: flex; gap: 10px">
                            <Icon icon="wpf-activity" />
                            <p style="margin: 0;"><b>{{ permissions.display_name }}</b> has site access!</p>
                        </div>
                        <p>
                            <i class="el-icon-user"></i>
                            <a v-if="permissions.manage_user" :href="permissions.manage_user">
                                Manage site user
                            </a>
                        </p>
                        <p style="font-size: 14px; font-weight: 600; ">User has following roles: </p>
                        <span class="user_roles" v-for="role in permissions.roles" :key="role">
                            {{ role }}
                        </span>
                    </div>
                    <p v-else>No site access!</p>
            </div>
        </app-card>
    </div>
</template>

<script>
import AppCard from '@admin/Components/Common/AppCard.vue';
import Icon from '@admin/Components/Icons/Index.vue';

export default {
    components: {
        AppCard,
        Icon
    },
    props: {
        info: {
            type: [Object, Array],
            default: () => { }
        },
        fetchingProfile: {
            type: Boolean,
            default: false
        },
        customer_email: {
            type: String,
            default: ''
        },
        spends: {
            type: Array,
            default: () => []
        },
        permissions: {
            type: [Object, Array],
            default: () => { }
        },
        user_id: {
            type: Number,
            default: 0
        }
    }
}
</script>