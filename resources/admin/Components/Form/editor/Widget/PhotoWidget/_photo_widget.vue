<template>
    <div class="wpf_photo_card">
        <div v-if="app_ready" class="wpf_photo_holder">
            <!-- <img :style="{ width: custom_width }" v-if="hasMultipleImage(product)" :src="product.photo[0].image_thumb"/> -->
            <el-popover
                placement="right"
                width="400"
                v-if="hasMultipleImage(product)"
                trigger="click">
                <el-row>
                    <el-col v-for="(photo, index) in product.photo" :key="index" :span="12" class="img-btn">
                        <img v-if="index !== 0" :style="{ width: '100%' }" :src="photo.image_thumb"/>
                        <i @click="deleteImage(index)" class="el-icon-close delete-img"></i>
                    </el-col>
                </el-row>
                <el-button slot="reference" class="img-btn">
                    <img :style="{ width: '100px', height: '100px' }" v-if="hasMultipleImage(product)" :src="product.photo[0].image_thumb"/>
                    <i @click="deleteImage(0)" class="el-icon-close delete-img"></i>
                </el-button>
            </el-popover>
            <div v-else class="single_default_image">
                <img :style="{ width: custom_width }" v-if="getSingleImageLink(product) === '/images/form/default_product.png'" :src="assetsUrl(default_img)"/>
                <img :style="{ width: custom_width }" v-else :src="getSingleImageLink(product) || assetsUrl(default_img)"/>
            </div>
        </div>
        <!-- <img @click="initUploader"  v-if="upload_image" class="upload-image" :src="assetsUrl('/images/form/upload_image.svg')" alt="" /> -->
        <!-- <el-button @click="initUploader"  type="text" size="medium">{{buttonText}} </el-button> -->
        <el-col :span="2" class="upload-btn">
            <div @click="initUploader">
                <Icon icon="wpf-plus"></Icon>
            </div>
        </el-col>
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
        props: ['product', 'custom_width', 'is_multiple', 'layout', 'upload_image'],
        data() {
            return {
                app_ready: false,
                buttonText: '+ Photo',
                default_img: 'images/form/default_product.png',
            }
        },
        methods: {
            assetsUrl(path) {
                return window.wpPayFormsAdmin.assets_url + path;
            },
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
                if (product?.photo) {
                    if (this.is_multiple && product?.photo[0]?.image_thumb) {
                        return product?.photo[0]?.image_thumb;
                    }
                    else if (this.is_multiple !== true && product?.photo.image_thumb) {
                        return product?.photo.image_thumb;
                    }
                }
                
                return '';
            },
            initUploader(event) {
                let that = this;
                // var send_attachment_bkp = wp.media.editor.send.attachment;
                // wp.media.editor.send.attachment = function (props, attachment) {
                //     that.product.photo['alt_text'] = attachment.alt || attachment.title;
                //     that.product.photo['image_full'] = attachment.url;
                //     that.product.photo['image_thumb'] = that.getThumb(attachment);
                //     console.log(send_attachment_bkp, 'send_attachment_bkp');
                //     wp.media.editor.send.attachment = send_attachment_bkp;
                // }
                // wp.media.editor.open();
                // this.buttonText = '~Change Photo';
                // return false;
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
                        that.product.photo = images;
                    } else {
                        that.product.photo['alt_text'] = attach.alt || attach.title;
                        that.product.photo['image_full'] = attach.url;
                        that.product.photo['image_thumb'] = that.getThumb(attach);
                        return;
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
        },
         mounted() {
            if (!this.product.photo || typeof this.product.photo != 'object') {
                this.$set(this.product, 'photo', {
                    'alt_text': '',
                    'image_full': '',
                    'image_thumb': ''
                });
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
.img-btn{
    position: relative;
}
.delete-img{
    position: absolute;
    top: 0;
    right: 1px;
    color: #ff7518;
    padding: 5px;
    border-radius: 50%;
    cursor: pointer;
}

.wpf_photo_card {
    display: flex;
    gap: 10px;
    height: 100%;
    width: 100%;
    .wpf_photo_holder {
        width: 42px;
        height: 40px;

        .single_default_image {
            width: 42px;
            height: 40px;

            img {
                width: 100%;
                border-radius: 4px;
                height: 100%;
                object-fit: cover;
                margin-bottom: 0;
            }
        }
    }

    .upload-btn {
        height: 40px;
        width: 42px;
    }
}
</style>
