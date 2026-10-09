<template>
    <div class="wpf_customer_content_wrapper">
        <app-card>
            <div slot="header">
                <h3>{{ $t('Customer Engagement by form') }}</h3>
            </div>
            <div style="width: 100%;" slot="body" v-loading="fetchingEngagements">
                <el-table class="wpf_customer_engagement_table" :data="engagements" max-height="453"
                    empty-text="No form submissions found!">
                    <el-table-column width="110" label="Form ID">
                        <template slot-scope="scope">
                            <router-link style="margin-right: 5px;"
                                :to="{ name: 'edit_form', params: { form_id: scope.row.form_id } }">
                                {{ scope.row.form_id }}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="post_title" label="Form Title" width="475">
                    </el-table-column>
                    <el-table-column prop="submission" label="Entries" width="140">
                    </el-table-column>
                    <el-table-column  width="140">
                        <template slot-scope="scope">
                           <el-button size="mini" class="view-entry-btn">
                                <router-link :to="{ path: `/edit-form/${scope.row.form_id}/form_entries?customer_email=${customer_email}` }">
                                    {{ $t('View Entries') }}
                                </router-link>
                           </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </app-card>
    </div>
</template>

<script>
import AppCard from '@admin/Components/Common/AppCard.vue'
export default {
    components: {
        AppCard
    },
    props: {
        fetchingEngagements: {
            type: Boolean,
            default: false,
        },
        engagements: {
            type: Array,
            default: () => [],
        },
        customer_email: {
            type: String,
            default: '',
        },
    },
}
</script>
