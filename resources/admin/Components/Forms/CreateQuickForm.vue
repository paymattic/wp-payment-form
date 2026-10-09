<template>
  <div
    class="demo_forms_modal"
    top="60px"
    width="70%"
    :append-to-body="true"
    style="height: 75vh; overflow: scroll; padding: 20px 5px 20px 5px"
  >
    <div class="pay_form_modal_body">
      <div class="form_action_navigations">
        <div class="form_item_group">
          <label>Category</label>
          <el-select size="mini" v-model="category" clearable placeholder="All Category">
            <el-option v-for="item in categories" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="form_item_group form_item_group_search">
          <el-input size="mini" v-model="search" placeholder="Search Form" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div v-for="(forms, category) in filteredForms" class="form_group">
        <h3>{{ category }}</h3>
        <div class="demo_form_cards">
          <div @click="createFromTemplate(form_name)" v-for="(demo_form, form_name) in forms" :key="Math.random()"
            class="demo_form_card">
            <div class="form_card_body">
              <img :src="demo_form.preview_image" title="Click to create this form" />
              <div class="demo_form_desc">
                <div v-if="demo_form.is_pro && !has_pro" class="desc_info">
                  <p v-html="demo_form.description"></p>
                  <el-button size="medium" >Unlock in Pro</el-button>
                </div>
                <div v-else class="desc_info">
                  <i class="el-icon-circle-plus"></i>
                  <p v-html="demo_form.description"></p>
                </div>
              </div>
            </div>
            <div class="form_card_footer">
              {{ demo_form.label }} <span v-if="demo_form.is_pro && !has_pro">(PRO)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
import each from "lodash/each";

export default {
  name: 'CreateForm',
  props: ['modalVisible', 'demo_forms', 'categories', 'form_type'],
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
    createForm() {
      this.submitting = true;
      // Send Request now
      this.$post('forms', {
        post_title: this.form_title,
        template: this.template
      })
          .then(response => {
             this.$notify.success({
                  title: 'Success',
                  message: response.message,
                  position: 'bottom-right'
              });
            if(this.form_type === '1') {
              this.$router.push({name: 'edit_form', params: {form_id: response.form_id}})
            } else {
              this.$router.push({name: 'quick_edit_form', params: {form_id: response.form_id}})
            }
          })
          .fail(error => {
             this.$notify.error({
                title: 'Oops!',
                message: error.responseJSON.message,
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
      this.createForm();
    },
    handleCreateClose() {
      window.location.hash = '/'
      this.isVisible = false;
    }
  }
}
</script>
