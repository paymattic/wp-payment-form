<template>
	<div style="padding: 30px 0px">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane name="support">
                <span slot="label"><i class="el-icon-headset"></i> Support & Docs</span>
            <documentation />
            </el-tab-pane>
            <el-tab-pane name="debug">
                <span slot="label"><i class="el-icon-setting"></i> Debug</span>
                <debug v-if="activeTab === 'debug'"/>
            </el-tab-pane>
        </el-tabs>
	</div>
</template>

<script>
	import Documentation from './Documentation.vue';
    import Debug from './Debug.vue'

    export default {
	    components: {
	        Documentation,
            Debug
	    },
	    name: 'support',
        data() {
            return {
                activeTab: 'support'
            }
        },
        mounted() {
            window.WPPayFormsBus.$emit('site_title', 'Support & Debug');
        }
	}
</script>
