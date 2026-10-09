<template>
  <div>
    <table v-if="'table' === tableData.layout" class="wpf_regular_table">
      <thead>
        <tr>
          <th v-if="tableData.enable_image === 'yes'">
            <LabelEditor v-model="tableData.table_photo_label" />
          </th>
          <th>
            <LabelEditor v-model="tableData.table_item_label" />
          </th>
          <th>
            <LabelEditor v-model="tableData.table_price_label" />
          </th>
          <th>
            <LabelEditor v-model="tableData.table_quantity_label" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in tableData.products">
          <td v-if="tableData.enable_image === 'yes'">
            <photo-widget :product="product" :is_multiple="true" />
          </td>
          <td style="max-width: 350px;">
            <LabelEditor v-model="product.product_name" :nullable="false" class="wpf_tabular_editable" />
          </td>
          <td>
            <LabelEditor v-model="product.product_price" :nullable="false" />
          </td>
          <td>
            <input
              style="width: 70px"
              type="number"
              v-model="product.default_quantity"
            />
          </td>
        </tr>
      </tbody>
      <tfoot v-if="tableData.show_sub_total === 'yes'">
        <tr>
          <td
            :colspan="tableData.enable_image === 'yes' ? 3 : 2"
            style="text-align: right; font-weight: 600"
          >
            <LabelEditor
              v-model="tableData.table_subtotal_label"
              :nullable="false"
            />
          </td>
          <td style="font-weight: 600;">{{ subTotal }}</td>
        </tr>
      </tfoot>
    </table>
    <div v-else>
      <div
        class="wpf_tabular_filter_container"
        v-if="tableData.enable_search === 'yes'"
      >
        <div class="wpf_filter_input">
          <div class="wpf-search-icon">
            <Icon icon="wpf-search" />
          </div>
          <input
            class="input-elevated wpf_tab_search"
            type="text"
            placeholder="Search"
          />
        </div>
        <div class="wpf_categories">
          <div v-if="tableData.enable_feature === 'yes'">
          <select
            class="wpf_filter_select"
            label="Select data"
          >
            <option disabled selected>Filter by Categories</option>
            <option value="all">All</option>
            <option selected disabled>Sort By</option>
          </select>
        </div>
        <div>
          <select class="wpf_sort_select" style="min-height: 39px">
            <option selected disabled>Sort By</option>
            <option value="name_asce">Name A to Z</option>
            <option value="name_desce">Name Z to A</option>
            <option value="price_asce">Price Low To High</option>
            <option value="price_desce">Price High To Low</option>
          </select>
        </div>
        </div>
      </div>
      <div :class="getContainerClass(tableData)">
        <div
          v-for="(product, index) in tableData.products"
          :class="`${
            product.enable_product === 'yes' ? 'disabled ' : ''
          } wpf-product-card is-slider is-show-popup ${
            tableData.layout === 'row' && 'wpf-tabular-product-is-flex'
          }`"
          :key="index"
        >
          <span class="wpf-product-checkbox"></span>
          <div
            @click="setSliderIndex(`wpf_slide_${tabular_id}${index}`)"
            :class="`wpf-product-image ${
              tableData.layout === 'row' && ' wpf-image_row_wrapper'
            }`"
          >
            <img :src="getThumbnailImage(product)" alt="" />
            <div class="wpf-product-image-overlay">
              <span>View Image</span>
            </div>
          </div>

          <div
            :class="`wpf-product-body ${
              tableData.layout === 'row' && 'wpf-flex-body'
            }`"
          >
            <h3 class="wpf-product-title">
              <LabelEditor v-model="product.product_name" :nullable="false" />
            </h3>
            <p class="wpf-product-content">
              <LabelEditor
                :layout="tableData.layout"
                :isTextarea="true"
                v-model="product.product_description"
                :nullable="false"
              />
            </p>
            <span class="wpf-product-price">
              <LabelEditor v-model="product.product_price" :nullable="false" />
            </span>

            <div class="wpf-product-footer">
              <div class="wpf-product-quantity">
                <label for="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  v-model="product.default_quantity"
                />
              </div>
              <div
                v-for="category in product.product_size"
                class="wpf-product-size"
              >
                <label :for="category[0].label">
                  <LabelEditor v-model="category[0].label" :nullable="false" />
                </label>
                <select
                  :id="category[0].label"
                >
                  <option
                    v-for="option in category[0].options"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="wpf-product-dialog-box">
            <div class="wpf-product-dialog-content">
              <div class="close-dialog">+</div>

              <div class="wpf-product-dialog">
                <div class="slideshow-container">
                  <img
                    v-for="image in getSlidePhoto(product.photo)"
                    :class="`wpf_slide_${tabular_id}${index} fade`"
                    :src="image.image_full"
                  />
                  <a
                    class="prev"
                    style="position: absolute"
                    @click="plusSlides(-1, `wpf_slide_${tabular_id}${index}`)"
                    >❮</a
                  >
                  <a
                    class="next"
                    style="position: absolute"
                    @click="plusSlides(1, `wpf_slide_${tabular_id}${index}`)"
                    >❯</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LabelEditor from "../Widget/LabelEditor.vue";
import PhotoWidget from "../Widget/PhotoWidget/_photo_widget";
import Icon from '../../../Icons/Index.vue';
export default {
  components: {
    LabelEditor,
    PhotoWidget,
    Icon,
  },
  data() {
    return {
      subTotal: 0,
      slideIndex: 1,
      default_img:
        window.wpPayFormsAdmin.asset_url + "images/form/default_product.png",
    };
  },
  props: ["tableData", "tabular_id"],
  methods: {
    calculateSubTotal() {
      this.subTotal = 0;
      this.tableData.products.forEach((product) => {
        this.subTotal += product.product_price * product.default_quantity;
      });
    },
    getSlidePhoto(photo) {
      let productPhoto = [];
      if (!photo?.length) {
        return [
          {
            image_full: this.default_img,
            image_thumb: this.default_img,
          },
        ];
      }
      
      for (let i = 0; i < photo.length; i++) {
        if (!photo[i].image_full?.includes("http")) {
          productPhoto.push({
            image_full:
              window.wpPayFormsAdmin.asset_url + photo[i].image_full,
            image_thumb:
              window.wpPayFormsAdmin.asset_url + photo[i].image_thumb,
          });
        }else{
          productPhoto.push({
            image_full: photo[i].image_full,
            image_thumb: photo[i].image_thumb,
          });
        }
      }

      return [...productPhoto];
    },
    getContainerClass(product) {
      return product?.layout === "row"
        ? "wpf-product-cards-wrap d-grid gap-15"
        : "wpf-product-cards-wrap d-grid gap-15 grid-template-col-3";
    },
    productCardSlider() {
      let that = this;
      jQuery(document).ready(function ($) {
        $(document).on("click", ".wpf-product-image", function () {
          $(this).parent().removeClass("is-show-popup");
          $(this).parent().addClass("active");
          $("body").css({
            overflow: "hidden",
          });
        });
        $(document).on("click", ".close-dialog", function () {
          $(".wpf-product-cards-wrap .wpf-product-card.is-slider").addClass(
            "is-show-popup"
          );
          $(".wpf-product-cards-wrap .wpf-product-card.is-slider").removeClass(
            "active"
          );
          $("body").css({
            overflow: "inherit",
          });
        });
      });
    },
    plusSlides(n, id) {
      this.showSlides((this.slideIndex += n), id);
    },
    setSliderIndex(id) {
      this.showSlides(1, id);
    },
    getThumbnailImage(product) {
      if (product?.photo?.length) {
        if (!product?.photo[0]?.image_thumb?.includes("http")) {
          return (
            window.wpPayFormsAdmin.asset_url + product?.photo[0]?.image_thumb
          );
        }
        return product?.photo[0]?.image_thumb;
      } else {
        return this.default_img;
      }
    },
    showSlides(n, id) {
      var i;
      var slides = document.getElementsByClassName(`${id}`);
      if (n > slides.length) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = slides.length;
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[this.slideIndex - 1].style.display = "block";
    },
    checkHasProductMetaPriceKeyAndSetDefault() {
      this.tableData?.products?.map((product, prductIindex) => {
        for (let i = 0; i < product?.product_size.length; i++) {
          for (let j = 0; j < product.product_size[i][0]?.options.length; j++) {
            if (
              !product?.product_size[i][0]?.options[j].hasOwnProperty("price")
            ) {
              this.tableData.products[prductIindex].product_size[i][0].options[
                j
              ].price = 0;
            }
          }
        }
      });
    },
    preparedTabularData(data) {
      let tableDataPrepared = [];
      if (!this.tableData?.layout) {
        this.tableData["layout"] = "table";
        this.tableData?.products?.map((product, index) => {
          let productData = {
            product_name: product.product_name,
            default_quantity: product.default_quantity,
            min_quantity: product.min_quantity,
            max_quantity: product.max_quantity,
            product_price: product.product_price,
            product_description: "Product description",
            enable_product: "no",
            product_size: [
              [
                {
                  label: "Option Label Text",
                  options: [
                    {
                      label: "Option 1",
                      value: "Option 1",
                      price: 0,
                    },
                  ],
                },
              ],
            ],
          };
          tableDataPrepared.push(productData);
        });
        this.tableData.products = tableDataPrepared;
      } else {
        this.checkHasProductMetaPriceKeyAndSetDefault();
      }
    },
  },
  mounted() {
    this.preparedTabularData();
    this.productCardSlider();
    this.calculateSubTotal();
  },
};
</script>
<style scoped lang="scss">
// .wpf_regular_table {
//   width: 100%;
//   border-collapse: separate;
//   border-spacing: 0;
//   border-radius: 8px;
//   overflow: hidden;
// }

// .wpf_regular_table th,
// .wpf_regular_table td {
//   border-bottom: 1px solid #D6DAE1;
//   padding: 8px;
//   border-right: 1px solid #D6DAE1;
// }

// .wpf_regular_table th {
//   padding-top: 5px;
//   padding-bottom: 5px;
//   text-align: left;
//   background-color: #F5F6F7;
//   color: rgb(19, 18, 18);
// }

// .wpf_regular_table tbody td {

//   .wpf-label-editor {
//     .editable-lable {
//       overflow: hidden;
//       color: #2F3448 !important;
//       text-overflow: ellipsis;
//       font-weight: 400 !important;
//     }
//   }
// }

// .wpf_tabular_editable.wpf-label-editor {
//   .editable-lable {
//       overflow: hidden;
//       color: #2F3448 !important;
//       text-overflow: ellipsis;
//       font-weight: 400 !important;
//     }
// }

// .wpf_regular_table {
//   empty-cells: show;
//   font-size: 14px;
//   border: 1px solid #D6DAE1;
// }

.grid-template-col {
  &-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

// Grid Card css start
// .wpf-product-size {
//   margin-right: 4px;
// }

.d {
  &-flex {
    display: flex;
  }

  &-grid {
    display: grid;
  }
}

.gap {
  &-20 {
    gap: 20px;
  }

  &-8 {
    gap: 8px;
  }

  &-10 {
    gap: 10px;
  }

  &-15 {
    gap: 15px;
  }
}

// .wpf-product-cards-wrap {
//   .wpf-product-card {
//     border: 1px solid rgba(195, 202, 216, 0.5);
//     border-radius: 4px;
//     position: relative;

//     &:hover {
//       background: #f5f7fd;
//     }

//     .wpf-product-checkbox {
//       position: absolute;
//       top: 10px;
//       left: 10px;
//       z-index: 3;
//       border: 1px solid #c3cad8;
//       background: #fff;
//       width: 20px;
//       height: 20px;

//       &:before {
//         content: "";
//         width: 6px;
//         height: 10px;
//         border-bottom: 2px solid #fff;
//         border-right: 2px solid #fff;
//         position: absolute;
//         left: 6px;
//         transform: rotate(45deg);
//         top: 3px;
//       }
//     }

//     input[type="checkbox"] {
//       position: absolute;
//       width: 100%;
//       height: 100%;
//       top: 0;
//       border: none;
//       opacity: 0;
//       z-index: 1;

//       &:checked {
//         ~ .wpf-product-checkbox {
//           border-color: #4c71fb;
//           background: #4c71fb;
//         }

//         ~ .wpf-product-body {
//           background: #f5f7fd;
//         }
//       }
//     }

//     .wpf-product-image {
//       position: relative;
//       z-index: 2;

//       img {
//         max-height: 278px;
//         width: 100%;
//         min-height: 220px;
//         object-fit: cover;
//       }

//       &:hover {
//         .wpf-product-image-overlay {
//           opacity: 1;
//           visibility: visible;
//         }
//       }

//       .wpf-product-image-overlay {
//         position: absolute;
//         left: 0;
//         top: 0;
//         width: 100%;
//         height: 100%;
//         z-index: 1;
//         background: rgba(1, 118, 254, 0.5);
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         transition: 0.3s;
//         opacity: 0;
//         visibility: hidden;

//         span {
//           color: #fff;
//           display: block;
//           font-size: 15px;
//           cursor: pointer;
//         }
//       }
//     }

//     .wpf-product-body {
//       padding: 10px;

//       .wpf-product-title {
//         font-size: 16px;
//         margin: 0 0 5px 0;
//         letter-spacing: 0.2px;
//       }

//       .wpf-product-content {
//         font-size: 14px;
//         color: #2c3345;
//         opacity: 0.6;
//         margin: 0 0 8px 0;
//       }

//       .wpf-product-price {
//         color: #ff7518;
//         font-size: 14px;
//         font-weight: 700;
//         margin-bottom: 20px;
//         display: block;
//       }

//       label {
//         font-size: 0.75em;
//         color: #464d5f;
//       }

//       select {
//         border-color: #b8bdc9;
//         box-shadow: none;
//         border-radius: 4px;
//         padding: 5px 10px;
//         width: 100%;
//         -moz-appearance: none;
//         appearance: none;

//         background-image: linear-gradient(45deg, transparent 50%, gray 50%),
//           linear-gradient(135deg, gray 50%, transparent 50%);
//         background-position: calc(100% - 15px) calc(1em + -4px),
//           calc(100% - 10px) calc(1em + -4px), calc(100% - 2.5em) 0.5em;
//         background-size: 5px 5px, 5px 5px, 1px 1.5em;
//         background-repeat: no-repeat;

//         &:focus {
//           outline: none;
//           box-shadow: none;
//           border-color: #4c71fb;
//         }
//       }

//       .wpf_product_qty {
//         height: 33px;
//         border-color: #b8bdc9;
//         border-radius: 4px;
//       }

//       .wpf-product-footer {
//         z-index: 9;
//         display: flex;
//         align-items: center;
//         flex-wrap: wrap;
//         position: relative;
//       }
//     }

//     &.active {
//       .wpf-product-dialog-box {
//         display: flex;
//       }
//     }

//     .wpf-product-dialog-box {
//       position: fixed;
//       top: 0;
//       bottom: 0;
//       left: 0;
//       right: 0;
//       background: rgba(0, 0, 0, 0.1);
//       z-index: 20;
//       align-items: center;
//       justify-content: center;
//       display: none;

//       .wpf-product-dialog-content {
//         width: 100%;
//         max-width: 960px;
//         height: calc(100% - 20px);
//         max-height: calc(100% - 300px);
//         overflow-x: hidden;
//         margin: auto;
//         padding: 60px 70px 20px 70px;
//         background: #fff;
//         border-radius: 8px;
//         position: relative;

//         /* Next & previous buttons */
//         .prev,
//         .next {
//           cursor: pointer;
//           position: absolute;
//           top: 50%;
//           width: auto;
//           padding: 16px;
//           margin-top: -22px;
//           color: rgb(136, 32, 32);
//           font-weight: bold;
//           font-size: 18px;
//           transition: 0.6s ease;
//           border-radius: 0 3px 3px 0;
//           user-select: none;
//         }

//         /* Position the "next button" to the right */
//         .next {
//           right: 53px;
//           border-radius: 3px 0 0 3px;
//           text-decoration: none;
//         }

//         .prev {
//           text-decoration: none;
//         }

//         /* On hover, add a black background color with a little bit see-through */
//         .prev:hover,
//         .next:hover {
//           background-color: rgba(0, 0, 0, 0.8);
//         }

//         .close-dialog {
//           position: absolute;
//           color: #000;
//           background-color: #edeef5;
//           top: 10px;
//           right: 10px;
//           border-radius: 50%;
//           transform: rotate(-45deg);
//           cursor: pointer;
//           width: 45px;
//           height: 45px;
//           line-height: 45px;
//           text-align: center;
//           font-size: 22px;
//         }

//         img {
//           max-width: 100%;
//           max-height: 450px;
//           display: block;
//           margin: auto;
//           object-fit: cover;
//         }
//       }
//     }
//   }
// }
</style>
