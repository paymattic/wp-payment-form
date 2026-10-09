<template>
    <div style="background: #fff; padding: 20px; border-radius: 0 0 8px 8px;">
        <el-tabs type="card">
            <el-tab-pane :label="$t('PDF Contents')">
                <el-form v-if="feed.settings" label-position="left" label-width="205px" class="wpf_pdf_feed_form">
                    <!-- <field-mapper
                            :field="{ component: 'value_text', label: 'Feed Title', placeholder: 'Feed Title' }"
                            :editorShortcodes="editorShortcodes"
                            :errors="errors"
                            v-model="feed.name"
                    >
                    </field-mapper> -->
                    <el-form-item label="Feed title" class="pdf_feed_item">
                        <el-input type="text" size="medium" v-model="feed.name">
                         </el-input>
                    </el-form-item>
                    <el-form-item v-for="(field, index) in settings_fields" :key="index" class="pdf_feed_item"> 
                        <template slot="label">
                            {{field.label}}
                            <el-tooltip
                                v-if="field.tips"
                                class="item"
                                effect="light"
                                placement="bottom-start"
                            >
                                <div slot="content">
                                    <p v-html="field.tips"></p>
                                </div>
                                <i class="el-icon-info el-text-info"></i>
                            </el-tooltip>
                        </template>
                        <template v-if="field.type == 'admin_input'" >
                            <el-input
                                size="small"
                                v-model="feed.settings[field.key]"
                                :readonly="field.readonly"
                                :placeholder="field.placeholder"
                            ></el-input>
                        </template>
                        <template v-if="field.type == 'text'" >
                            <el-input
                                size="small"
                                :placeholder="field.placeholder"
                                v-model="feed.settings[field.key]"
                                :readonly="field.readonly"
                            ></el-input>
                        </template>
                        <template v-else-if="field.type == 'textarea'" >           
                            <el-input
                                :placeholder="field.placeholder"
                                size="small"
                                v-model="feed.settings[field.key]"
                            ></el-input>
                        </template>
                        <template v-else-if="field.type == 'wp-editor'" >
                           <wp-editor :height="250" :editorShortcodes="placeHolders" v-model="feed.settings[field.key]" />
                        </template>
                        <template v-else-if="field.type == 'checkbox-single'">
                            <el-checkbox v-model="feed.settings[field.key]">
                                {{field.checkbox_label}}
                            </el-checkbox>
                        </template>
                        <template v-if="field.type == 'radio_choice'">
                            <el-radio-group v-model="feed.settings[field.key]">
                                <el-radio
                                        v-for="(fieldLabel, fieldValue) in field.options"
                                        :key="fieldValue"
                                        :label="fieldValue"
                                >{{fieldLabel}}</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-else-if="field.type == 'image_widget'">
                            <div class="wpf_pdf_image_widget_wrap">
                                <photo-widget :product="getBridgeProduct(field.key, 'settings')" :is_multiple="false" />
                                <div class="pdf-image-actions">
                                    <span v-if="feed.settings[field.key]" class="pdf-image-action-btn" @click="removeImage(field.key)">
                                        <i class="el-icon-close"></i>
                                    </span>
                                </div>
                            </div>
                        </template>
                         <template v-else-if="field.type == 'value_text'">
                            <filed-general
                                :editorShortcodes="editorShortcodes"
                                v-model="feed.settings[field.key]"
                            />
                        </template>

                        <template v-else-if="field.type == 'value_textarea'">
                            <filed-general
                                field_type="textarea"
                                :editorShortcodes="editorShortcodes"
                                v-model="feed.settings[field.key]"
                            />
                        </template>
                    </el-form-item>
                    <!-- form iteration loop -->
                    <!-- <field-mapper
                            v-for="field in settings_fields"
                            :key="field.key"
                            :field="field"
                            :errors="errors"
                            :editorShortcodes="editorShortcodes"
                            v-model="feed.settings[field.key]"
                     /> -->
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$t('Appearance')">
                <el-form v-if="feed.appearance" label-position="left" label-width="205px">
                    <!-- <field-mapper
                            v-for="field in appearance_fields"
                            :key="field.key"
                            :field="field"
                            :errors="errors"
                            :editorShortcodes="editorShortcodes"
                            v-model="feed.appearance[field.key]"
                    /> -->
                    <el-form-item v-for="(field, index) of appearance_fields" :key="index" class="pdf_feed_item"> 
                        <template slot="label">
                            {{field.label}}
                            <el-tooltip
                                v-if="field.tips"
                                class="item"
                                effect="light"
                                placement="bottom-start"
                            >
                                <div slot="content">
                                    <p v-html="field.tips"></p>
                                </div>
                                <i class="el-icon-info el-text-info"></i>
                            </el-tooltip>
                        </template>
                        <template v-if="field.type == 'radio_choice'">
                            <el-radio-group v-model="feed.appearance[field.key]">
                                <el-radio
                                    v-for="(fieldLabel, fieldValue) in field.options"
                                    :key="fieldValue"
                                    :label="fieldValue"
                                >{{fieldLabel}}</el-radio>
                            </el-radio-group>
                        </template>

                        <template v-else-if="field.type == 'dropdown'">
                            <el-select v-model="feed.appearance[field.key]" :placeholder="field.label">
                                <el-option
                                    v-for="(item,itemValue) in field.options"
                                    :key="itemValue"
                                    :label="item"
                                    :value="itemValue">
                                </el-option>
                            </el-select>
                        </template>

                        <template v-else-if="field.type == 'dropdown-group'">
                            <el-select v-model="feed.appearance[field.key]" :placeholder="field.label">
                                <el-option-group v-for="(group,groupLabel) in field.options"
                                    :key="groupLabel"
                                    :label="groupLabel">
                                    <el-option
                                        v-for="(item,itemValue) in group"
                                        :key="itemValue"
                                        :label="item"
                                        :value="itemValue">
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </template>
                        <template v-else-if="field.type == 'number'">
                            <el-tooltip v-if="field.inline_tip"  :content="field.inline_tip" effect="light" placement="top">
                                <el-input-number size="medium" v-model="feed.appearance[field.key]"></el-input-number>
                            </el-tooltip>
                            <el-input-number size="medium" v-model="feed.appearance[field.key]" v-else></el-input-number>
                        </template>
                        <template v-else-if="field.type == 'color_picker'">
                            <el-color-picker v-model="feed.appearance[field.key]" />
                        </template>
                         <template v-if="field.type == 'text'" >
                            <el-tooltip v-if="field.inline_tip"  :content="field.inline_tip" effect="light" placement="top">
                                <el-input
                                    size="small"
                                    :placeholder="field.placeholder"
                                    v-model="feed.appearance[field.key]"
                                    :readonly="field.readonly"
                                ></el-input>
                            </el-tooltip>
                            <el-input
                                size="small"
                                :placeholder="field.placeholder"
                                v-model="feed.appearance[field.key]"
                                :readonly="field.readonly"
                                v-else
                            ></el-input>
                        </template>
                        <template v-else-if="field.type == 'checkbox'">
                            <el-tooltip v-if="field.inline_tip"  :content="field.inline_tip" effect="light" placement="top">
                                <el-checkbox v-model="feed.appearance[field.key]">
                                    {{field.checkbox_label}}
                                </el-checkbox>
                            </el-tooltip>
                            <el-checkbox v-model="feed.appearance[field.key]" v-else>
                                    {{field.checkbox_label}}
                            </el-checkbox>
                        </template>
                        <template v-else-if="field.type == 'image_widget'">
                            <div class="wpf_pdf_image_widget_wrap">
                                <photo-widget :product="getBridgeProduct(field.key, 'appearance')" :is_multiple="false" />
                                <div class="pdf-image-actions">
                                    <span v-if="feed.appearance[field.key]" class="pdf-image-action-btn" @click="removeImage(field.key)">
                                        <i class="el-icon-close"></i>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-button class="pull-right wpf_new_ui_button" size="small" type="primary" v-loading="saving" @click="saveFeed()">{{ $t('Save Feed') }}</el-button>
        </el-tabs>
    </div>
</template>

<script type="text/babel">

    import wpEditor from '../../Common/_wp_editor.vue';
    import FiledGeneral from '../Templates/_FieldGeneral';
    import PhotoWidget from '../editor/Widget/PhotoWidget/_photo_widget.vue';
    export default {
        components: { wpEditor, FiledGeneral, PhotoWidget },
        name: 'EditAddPdf',
        props: ['edit_id', 'form_id', 'editorShortcodes', 'placeHolders'],
        
        data() {
            return {
                loading: true,
                saving: false,
                feed: {},
                settings_fields: [],
                appearance_fields: [],
                bridgeSettingsLogo: { photo: { alt_text: '', image_full: '', image_thumb: '' } },
                bridgeAppearanceWatermark: { photo: { alt_text: '', image_full: '', image_thumb: '' } },
            }
        },
        computed: {},
        watch: {
            'bridgeSettingsLogo.photo': {
                handler(val) {
                    if (val && this.feed.settings) {
                        this.feed.settings['logo'] = val.image_full || '';
                    }
                },
                deep: true,
            },
            'bridgeAppearanceWatermark.photo': {
                handler(val) {
                    if (val && this.feed.appearance) {
                        this.feed.appearance['watermark_image'] = val.image_full || '';
                    }
                },
                deep: true,
            },
        },
        methods: {
            getFeed() {
                this.loading = true;
                this.$get('wppayform-pdf/get_feed',{
                    form_id: this.form_id,
                    feed_id: this.edit_id,
                })
                .then(response => {
                    this.feed = response.data.feed;
                    this.settings_fields = response.data.settings_fields;
                    this.appearance_fields = response.data.appearance_fields;
                    this.initBridgeProducts();
                })
                .fail((error) => {
                    console.log(error);
                })
                .always(() => {
                    this.loading = false;
                });
            },
            saveFeed() {
                this.saving = true;
                this.$post('wppayform-pdf/save_feed',{
                    form_id: this.form_id,
                    feed_id: this.edit_id,
                    feed: this.feed
                })
                .then(response => {
                    this.saving = false
                    this.$notify.success({
                        position: 'bottom right',
                        message: response.data.message
                    });
                })
                .fail((error) => {
                    this.$fail(error.responseJSON.data.message);
                })
                .always(() => {
                    this.saving = false;
                });
            },
            getBridgeProduct(fieldKey, target) {
                if (target === 'settings') return this.bridgeSettingsLogo;
                return this.bridgeAppearanceWatermark;
            },
            openWpMedia(fieldKey, target) {
                if (typeof wp === 'undefined' || !wp.media) {
                    this.$notify.error({ position: 'bottom right', message: this.$t('WordPress media library is not available.') });
                    return;
                }
                const frame = wp.media({
                    title: this.$t('Select or Upload Image'),
                    button: { text: this.$t('Use this image') },
                    library: { type: 'image' },
                    multiple: false,
                });
                frame.on('select', () => {
                    const attachment = frame.state().get('selection').first().toJSON();
                    const url = attachment.url;
                    if (target === 'settings') {
                        this.bridgeSettingsLogo.photo = { alt_text: attachment.alt || '', image_full: url, image_thumb: url };
                    } else {
                        this.bridgeAppearanceWatermark.photo = { alt_text: attachment.alt || '', image_full: url, image_thumb: url };
                    }
                });
                frame.open();
            },
            initBridgeProducts() {
                const logoUrl = this.feed.settings?.['logo'] || '';
                this.bridgeSettingsLogo.photo = {
                    alt_text: '',
                    image_full: logoUrl,
                    image_thumb: logoUrl,
                };
                const watermarkUrl = this.feed.appearance?.['watermark_image'] || '';
                this.bridgeAppearanceWatermark.photo = {
                    alt_text: '',
                    image_full: watermarkUrl,
                    image_thumb: watermarkUrl,
                };
            },
            removeImage(key = 'logo') {
                if (key === 'logo') {
                    this.feed.settings['logo'] = '';
                    this.bridgeSettingsLogo.photo = { alt_text: '', image_full: '', image_thumb: '' };
                } else if (key === 'watermark_image') {
                    this.feed.appearance['watermark_image'] = '';
                    this.bridgeAppearanceWatermark.photo = { alt_text: '', image_full: '', image_thumb: '' };
                }
                this.$forceUpdate();
            },
        },
        mounted() {
            this.getFeed();
        }
    }
</script>

<style>
   .pdf_feed_item {
        margin-bottom: 22px !important;
        .el-form-item__content{
            margin-right: 2px !important;
        }
    }
    
</style>
