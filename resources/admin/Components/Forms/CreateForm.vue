<template>
  <div class="wpf-demo_forms_modal" top="60px" width="70%" :append-to-body="true" style="height: 100vh;
      overflow-y: scroll;
      overflow-x: hidden;">
    <div class="wpf-pay_form_modal_body">
      <div class="choose_form_action_navigations">
        <div class="wpf-body-title">
          <h3>
            <Icon :icon="'wpf-file'" /> {{ $t('Choose template') }}
          </h3>
          <el-button @click="closeChooseBtn()" class="choose-form-close-btn" size="small"
            icon="el-icon-close"></el-button>
        </div>
      </div>
      <div class="form-template-wrapper">
        <div class="form-template-sidebar">
          <p class="category-title">Category</p>
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item @click="category = ''" index="1">
              <span>{{ $t('All Category') }}</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <span>{{ $t(' Donation ')}}</span>
              </template>
              <el-menu-item-group >
                <el-menu-item @click="category = 'Donation'" index="1-2">Simple Form</el-menu-item>
                <el-menu-item @click="category = 'Quick checkout'" index="1-1">Advanced Form</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item @click="category = 'Payment'" index="3">
              <span>{{ $t('Payment') }}</span>
            </el-menu-item>
            <el-menu-item @click="category = 'Subscription'" index="4">
              <span>{{ $t('Subscription')}}</span>
            </el-menu-item>
            <el-menu-item @click="category = 'Basic'" index="5">
              <span>{{ $t('Basic')}}</span>
            </el-menu-item>
          </el-menu>
          <div class="wpf_suggest_template_wrapper">
            <a class="wpf_suggest_template_link" href="https://paymattic.com/form-template-suggestion/" target="_blank">
              {{ $t('Suggest a Template')}}
              <Icon icon="wpf-external-link" />
            </a>
          </div>
        </div>
        <div class="wpf-choose-form_group_container">
          <el-input class="wpf-form-search"
            placeholder="Search template by title" prefix-icon="el-icon-search" v-model="search">
          </el-input>
          <div v-for="(forms, category) in filteredForms" :key="category" class="wpf-choose-form_group">
            <div v-if="category !== 'Blank From'" class="form_template_group_title">
              <h3>{{ category == 'Quick checkout' ? 'Advance Donation' : category  }}</h3>
              <p>{{ countActiveCategoryForms(forms) }} Templates</p>
            </div>
            <div :class="category != 'Quick checkout' ? 'demo_form_cards' : 'demo_form_cards quick_checkout_form'">
              <div v-for="(demo_form, form_name) in forms" :key="Math.random()" v-if="demo_form.category !== 'Blank From'" class="demo_form_card"
                :style="{ 'width': category === 'Quick checkout' ? '45%' : '200px' }">
                <div class="form_card_body" :style="getRandomBackground()">
                  <img :src="demo_form.preview_image" title="Click to create this form" />
                  <div class="demo_form_desc">
                    <div v-if="demo_form.is_pro && !has_pro" class="desc_info">
                      <el-button type="primary" size="small">
                        <Icon style="width: 20px; height: 20px;" icon="wpf-premium" />
                        <a target="_blank" :href="pro_purchase_url" class="wpf_premium_url">{{ $t('Upgrade To Premium')}}</a>
                      </el-button>
                    </div>
                    <div v-else class="desc_info">
                      <!-- <i class="el-icon-circle-wpf-plus"></i> -->
                      <el-button @click="createFromTemplate(form_name)" type="primary" size="small">
                        <Icon icon="wpf-plus" />Create Form
                      </el-button>
                      <el-button @click="demoPreviewUrl(form_name)" type="default" size="small">
                        <Icon icon="wpf-preview" />Preview Form
                      </el-button>
                    </div>
                  </div>
                </div>
                <div class="form_card_footer">
                  <h6>{{ demo_form.label }} <span v-if="demo_form.is_pro && !has_pro">(PRO)</span></h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import each from "lodash/each";
import Icon from '../Icons/Index.vue';
export default {
  name: 'CreateForm',
  props: ['modalVisible', 'demo_forms', 'categories', 'form_type'],
  components: {
    Icon
  },
  data() {
    return {
      form_title: 'Blank Form',
      template: 'blank_form',
      category: '',
      search: '',
      has_pro: !!window.wpPayFormsAdmin.has_pro
    }
  },
  computed: {
    filteredForms() {
      let items = {};
      if (this.search) {
        let search = this.search.toLocaleLowerCase();
        let allForms = {
          'Search Result': {}
        };
        each(this.demo_forms, (form, formName) => {
          let formStrung = JSON.stringify([
            form.label,
            form.category,
          ]).toLowerCase();
          if (formStrung.indexOf(search) != -1) {
            allForms['Search Result'][formName] = form;
          }
        });
        this.category = '';
        return allForms;
      } else {
        if (this.category) {
          items[this.category] = {};
          each(this.demo_forms, (form, formName) => {
            if (form.category === this.category) {
              items[this.category][formName] = form;
            }
          })
        } else {
          each(this.categories, (category) => {
            items[category] = {};
            each(this.demo_forms, (form, formName) => {
              if (form.category === category) {
                items[category][formName] = form;
              }
            })
          })
          return items;
        }
      }

      return items;
    }
  },
  watch: {
    isVisible() {
      this.$emit('update:modalVisible', JSON.parse(this.isVisible))
    }
  },
  methods: {
    closeChooseBtn() {
      this.$emit('update:close-modal', '0')
    },
    demoPreviewUrl(form_id) {
      window.open(window.origin + '/?wp_paymentform_preview=' + form_id + '&template=yes', '_blank');
    },
    getRandomBackground() {
      return {
        'background-color': `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`
      }
    },
    createForm(category = '') {
      this.submitting = true;
      // Send Request now
      this.$post('forms', {
        post_title: this.form_title,
        template: this.template
      })
        .then(response => {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            position: 'bottom-right'
          });
          if (category === 'Quick checkout') {
            this.$router.push({ name: 'quick_edit_form', params: { form_id: response.form_id } })
          } else {
            this.$router.push({ name: 'edit_form', params: { form_id: response.form_id } })
          }
        })
        .fail(error => {
          this.$notify({
            title: 'error',
            message: error.responseJSON.message,
            type: 'error',
            position: 'bottom-right'
          });
        })
        .always(() => {
          this.submitting = false;
        });
    },
    createFromTemplate(templateName = 'blank_form') {
      let form = this.demo_forms[templateName];
      if (form) {
        if (form.is_pro && !this.has_pro) {
          this.$notify.error({
            offset: 30,
            title: 'Oops!',
            message: 'You need pro version to create this form',
            position: 'bottom-right'
          });
          return;
        }
        if (form.label) {
          this.form_title = form.label;
        }
        this.template = templateName;
      }
      this.createForm(form?.category);
    },
    countActiveCategoryForms(forms) {
      return Object.keys(forms).length;
    },
    // countForms() {
    //   return Object.keys(this.demo_forms).length;
    // },
    handleCreateClose() {
      window.location.hash = '/'
      this.isVisible = false;
    }
  }
}
</script>

<style></style>