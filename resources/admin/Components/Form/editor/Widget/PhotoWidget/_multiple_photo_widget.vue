<template>
    <div class="wpf_photo_card" style="height: 100%; width: 100%;">
        <div v-if="app_ready" class="wpf_photo_holder">
            <!-- <img :style="{ width: custom_width }" v-if="hasMultipleImage(product)" :src="product.photo[0].image_thumb"/> -->
            <el-row>
                <el-col v-for="(photo, index) in product.photo" :key="index" :span="2" class="img-btn">
                    <img class="multiple-image" :src="imageSrc(photo)" alt="not found"/>
                    <i @click="deleteImage(index)" class="el-icon-close delete-img"></i>
                </el-col>
                <el-col :span="2" class="upload-btn">
                    <div @click="initUploader">
                        <Icon icon="wpf-plus"></Icon>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/babel">
    import each from 'lodash/each';
    import Icon from '../../../../Icons/Index.vue';
    export default {
        name: 'photo_widget',
        components: {
            Icon
        },
        props: ['product', 'custom_width', 'is_multiple', 'layout'],
        data() {
            return {
                app_ready: false,
                buttonText: '+ Photo',
                default_img: 'images/form/default_product.png',
            }
        },
        methods: {
            hasMultipleImage(product) {
                if (this.is_multiple && this.layout === 'grid' && product?.photo?.length > 1) {
                    return true;
                }
                return false;
            },
            deleteImage(index) {
                this.product.photo.splice(index, 1);
            },
            getSingleImageLink(product) {
                if (this.is_multiple && product?.photo[0]?.image_thumb) {
                    return product?.photo[0]?.image_thumb;
                }
                else if (this.is_multiple !== true && product?.photo?.image_thumb) {
                    return product?.photo?.image_thumb;
                }
                return '';
            },
            initUploader(event) {
                let that = this;
                const upload = wp
                .media({
                    title: "Choose Image", //Title for Media Box
                    multiple: true, //For limiting multiple image
                })
                .on("select", () => {
                    const select = upload.state().get("selection");
                    const attach = select.first().toJSON();
                    if (that.is_multiple) {
                        let images = [];
                        select.toJSON()?.map((item) => {
                            let image = {
                                'alt_text': item.alt || item.title,
                                'image_full': item.url,
                                'image_thumb': that.getThumb(item)
                            }
                            images.push(image);
                        })
                        // console.log(images, 'images', that.product.photo );
                        // that.product.photo = that.product.photo?.concat(images);

                        // Combine the existing and new images
                        let combinedImages = that.product.photo?.concat(images) || images;

                        // Remove images with URL ending in 'default_product'
                        that.product.photo = combinedImages.filter((image) => {
                            const imgUrl = image.image_full.split('/');
                            const lastSegment = imgUrl[imgUrl.length - 1];
                            return !lastSegment.includes('default_product');
                        });
                    }
                })
                .open();
            },
            getThumb(attachment) {
                let highestSize = attachment.width;
                let maybeUrl = attachment.url;
                let finalUrl = false;
                each(attachment.sizes, (image, name) => {
                    if(name == this.preferedThum) {
                        finalUrl = image.url;
                    }
                    if(!finalUrl || image.width > 300) {
                        if (image.width < 400) {
                            finalUrl = image.url;
                        } else if (image.width < highestSize) {
                            highestSize = image.width;
                            maybeUrl = image.url;
                        }
                    }
                });
                return finalUrl || maybeUrl;
            },
            assetsUrl(path) {
                return window.wpPayFormsAdmin.assets_url + path;
            },
            imageSrc(photo) {
                return photo.image_full === '/images/form/default_product.png'
                ? this.assetsUrl(this.default_img)  : photo.image_full;
            }
        },
         mounted() {
            if (!this.product.photo || typeof this.product.photo != 'object') {
                this.$set(this.product, 'photo', [{
                    'alt_text': 'default product image',
                    'image_full': this.default_img,
                    'image_thumb': this.default_img
                }]);
            }

            if(this.product.photo.image_thumb) {
              this.buttonText = 'Change Image';
            }

            if(!window.wpActiveEditor) {
                window.wpActiveEditor = null;
            }

            this.app_ready = true;
        }
    }
</script>
<style scoped lang="scss">
// .img-btn{
//     position: relative;
//     // float: none;
// }
// .delete-img{
//     position: absolute;
//     top: 0;
//     right: 1px;
//     color: #ff7518;
//     padding: 5px;
//     border-radius: 50%;
//     cursor: pointer;
// }
// .multiple-image{
//     width: 94%;
//     margin: 0px 5px;
//     // min-width: 100px;
//     // object-fit: cover;
//     // max-height: 90px;
//     height: 90px;
//     object-fit: cover;
//     display: block;
// }
</style>
