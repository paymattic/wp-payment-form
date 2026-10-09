<template>
    <div>
        <DonorLeaderBoard :form_id="form_id"/>
    </div>
</template>

<script type="text/babel">
    // Import global donor leaderboard settings components
    import DonorLeaderBoard from '../../Settings/DonorLeaderBoard.vue';

    export default {
        name: 'leaderboard_settings',
        components: {
            DonorLeaderBoard
        },
        data() {
            return {
                form_id: this.$route.params.form_id,
            }
        },
        methods: {
            saveSettings(){
                console.log('save settings');
            }
        }
    }
</script>