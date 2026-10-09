<template>
  <div class="wpf_dashboard_notice" v-if="showNotice">
    <div id="wpf_review_notices" class="wpf_review_notice">
      <div class="wpf_review_notice-aside"></div>
      <div v-if="type== 'milestone'"> 
        <p> <span> Congratulations!! 🔥 </span> You’ve made more than <span style="color: #F98435; font-weight: 700;">{{ milestone }} </span> successful transactions with Paymattic! 🙌</p>
        <br/>
        <p>Would you mind giving Paymattic a 5-star review?</p>
        <br/>
      </div>
      <div v-else> 
        <p>In love with Paymattic? We hope it's been helpful. If you're enjoying the plugin, would you mind rating it  ⭐ ⭐ ⭐ ⭐ ⭐  to help spread the word?</p>
        <br/>
      </div>
      <div class="wpf_review_notice_actions">
        <a class="wpf_review_notice_deserve_it" target="_blank" href="https://wordpress.org/support/plugin/wp-payment-form/reviews/?rate=5#new-post">👍 Yes, You Deserve It</a>
        <a @click="updateStatus('already_rated', '1')">🙌 Already Rated!</a>
        <a @click="updateStatus('remind_me', '1')">🔔 Remind Me Later</a>
        <a @click="updateStatus('rescue_me', '1')">💔 No Thanks</a>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'DashboardNotices',
  props: ['displayNotice'],
  data() {
    return {
      showNotice: this.displayNotice,
      type: this.displayNotice.type,
      milestone : this.displayNotice.milestone
    }
  },
  methods: {
    updateStatus(notice_type, value){
        let args = {
          notice_type : notice_type,
          value : value,
          milestone: this.milestone ? this.milestone : 0
        };
        this.$post('forms/settings/check-status', {
          args: args
        }).then(response => {
            this.showNotice = !response.close;
        }).catch((errors) => {
          this.handleError(errors);
        }).always(() => {

        });
    }
  },
  mounted() {
  }
}
</script>
<style lang="scss">
.wpf_dashboard_notice{
  margin:0;
  background: #fff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0px 2px 21px 0px rgb(0 0 0 / 8%);
  padding-left: 15px;
  border-left: 6px solid #74409A;
  position: relative;
}
.wpf_review_notice{
  .wpf_review_notice-aside{
    position: absolute;
    width: 40px;
    height: auto;
    left: 0;
    bottom: 0;
    top: 0;
  }
  p{
    padding: 0;
    margin: 0;
    font-size: 15px;
  }
  .wpf_review_notice_actions{
    margin-top: 5px;
    a{
      padding: 5px;
      border: 1px solid #F98435;
      border-radius: 4px;
      display: inline-block;
      text-decoration: none;
      margin-right: 5px;
      cursor: pointer;
      &.wpf_review_notice_deserve_it{
        background-color: #F98435;
        color: #fff;
      }
    }
  }
  .wpf_review_notice_close_icon{
    position: absolute;
    top: 0px;
    right: 2px;
  }
}
</style>