<template>
    <div>
        <div class="wpf-radio-with-Icon" v-if="field_options.enable_image === 'yes'">
            <ul style="list-style-type: none;">
                <li
                    v-for="(payment_method, key) in field_options.method_settings.payment_settings"
                    :key="key"
                    v-if="payment_method.enabled === 'yes'"
                    >
                    <!-- {{ payment_method }} {{ key }} -->
                    <input name="__wpf_selected_payment_method" type="radio" class="form-check-input" :id="key" :value="key" />
                    <label :for="key">
                    <img :src="getImageUrl(key)" :alt="key" />
                    </label>
                </li>
            </ul>
        </div>
        <div v-else>
            <ul style="list-style-type: none">
                <div v-for="(payment_method, key) in field_options.method_settings.payment_settings" style="margin-bottom: 7px;">
                    <li style="display: flex;" v-if="payment_method.enabled === 'yes'">
                        <input name="__wpf_selected_payment_method" type="radio"  :value="key" />
                        <LabelEditor style="margin-top: -6px;" v-model="payment_method.label" :nullable="false" />
                    </li>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
    import each from 'lodash/each';
    import LabelEditor from '../Widget/LabelEditor.vue';
    export default {
        name: 'PaymentMethodComponent',
        data() {
          return {
            availableMethods: window.wpPayFormsAdmin.payment_methods,
          }
        },
        components: {
            LabelEditor
        },
        props: ['field_options'],
        methods: {
          getImageUrl(name) {
            let logo = '';
            each(this.availableMethods, (method, key) => {
              if (key === name) {
                logo = method.svg;
              }
            });
            return logo;
          },
        },
        created() {
          this.availableMethods = window.wpPayFormsAdmin.payment_methods;
        },
    }

</script>

<style scoped lang="scss">
// .wpf-radio-with-Icon {
//   ul {
//     margin: 0px !important;
//     li {
//       display: inline-block;
//       margin: 0px -15px 0px 0px !important;
//       width: 60;
//       height: 60;
//       border-radius: 2%;
//       input {
//         width: 0;
//         height: 0;
//         opacity: 0;
//         margin: 0;
//       }
//     }
//   }

//   :checked + label {
//     border-color: #ddd;
//     &img {
//       transform: scale(0.9);
//       z-index: -1;
//     }
//     &:before {
//       content: "✓";
//       background-color: grey;
//       transform: scale(1);
//     }
//   }

//   input[type="radio"][id^="cb"] {
//     display: none;
//   }

//   label {
//     border: 1px solid #ccc;
//     border-radius: 3px;
//     display: block;
//     position: relative;
//     margin: 10px;
//     cursor: pointer;
//   }

//   label:before {
//     background-color: white;
//     color: white;
//     content: " ";
//     display: block;
//     border-radius: 50%;
//     border: 1px solid grey;
//     position: absolute;
//     top: -5px;
//     left: -5px;
//     width: 21px;
//     height: 21px;
//     text-align: center;
//     line-height: 19px;
//     transition-duration: 0.4s;
//     transform: scale(0);
//   }

//   label
//   {
//     img {
//       height: 46px;
//       width: 64px;
//       transition-duration: 0.2s;
//       transform-origin: 50% 50%;
//     }
//   }
// }
</style>