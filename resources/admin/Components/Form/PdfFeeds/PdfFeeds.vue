<template>
    <div v-loading="loading">
        <div class="all_payforms_wrapper payform_section">
            <div class="payform_section_header_2">
                <div class="payform_section_title" style="max-width: 70%;">
                    <span style="display: flex; flex-direction: column; gap: 8px;">
                        <h2 style="margin: 0;">{{ $t('PDF Feeds') }}</h2>
                        <p style="margin: 0;">{{ $t('Create PDF template feed and you can download the PDFs from each submission') }}</p>
                    </span>
                </div>
                <div class="payform_section_actions">
                    <el-button v-if="selectedId" @click="discard()" class="pull-right" icon="el-icon-arrow-left"
                        size="small">Back
                    </el-button>
                    <el-button v-else @click="addVisible = true" class="payform_action wpf_new_ui_button" size="medium" type="primary">
                        <Icon icon="wpf-add"/> {{ $t('Add PDF Feed') }}
                    </el-button>
                </div>
            </div>

            <!-- Notification Table: 1 -->
            <div v-if="!selectedId" class="payform_section_body" style="border-radius: 0 0 8px 8px; overflow: hidden;">
                <el-table :element-loading-text="$t('Fetching Notifications...')" :data="pdf_feeds" stripe class="el-fluid">
                    <el-table-column prop="name" :label="$t('Name')"></el-table-column>

                    <el-table-column prop="template_key" :label="$t('Template')"></el-table-column>

                    <el-table-column width="160" label="Actions" class-name="action-buttons">
                        <template slot-scope="scope">
                            <el-button @click="edit(scope.row.id)" icon="el-icon-setting"
                                size="mini" style="margin-right: 7px;"></el-button>
                            <remove @on-confirm="remove(scope.row.id)">
                                <p style="font-size: 12px;" slot="info">
                                    {{ $t('All the seetings of this') }}<br />
                                    {{ $t('this pdf setup will be deleted.') }}<br />
                                    {{ $t('Are you sure to delete this?') }}
                                </p>
                                <el-button size="mini" icon="el-icon-delete">
                                    <slot></slot>
                                </el-button>
                            </remove>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <feed-editor v-else :edit_id="selectedId" :editorShortcodes="editorShortcodes" :placeHolders="placeHolders"
                :form_id="form_id" ref="feedRef">
            </feed-editor>

            <el-dialog v-loading="creating" :element-loading-text="$t('Creating Feed. Please wait...')"
                :title="$t('Create new PDF Feed')" :visible.sync="addVisible" width="60%">

                <h3>{{ $t('Please Select a Template') }}</h3>

                <el-row :gutter="20">
                    <el-col class="wpf_each_template" v-for="(template, templateIndex) in templates" :key="templateIndex"
                        :span="6">
                        <div @click="createFeed(templateIndex)" class="wpf_card">
                            <img :src="template.preview" />
                            <div class="wpf_template_label">{{ template.name }}</div>
                        </div>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button plain size="small" @click="addVisible = false">{{ $t('Cancel') }}</el-button>
                </span>
                <div v-if="fontBaselineMissing">
                    <p style="color: rgb(201, 109, 109); font-size: 12px;">{{ $t('Font installation incomplete!! Incomplete font installation will cause error on pdf/invoice generation.') }}</p>
                    <h4>{{ $t('Please go to') }} <span><a :href="fluent_pdf_dashboard_url">{{ $t('Fluent PDF/Dashboard') }}</a></span> {{ $t('to finish the font setup.') }}</h4>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import remove from "../../pieces/confirmation";
import FeedEditor from './PdfFeed';
import Icon from "../../Icons/Index.vue";

export default {
    name: "PdfSettings",
    props: ["form_id", "inputs", "has_pdf"],
    components: {
        remove,
        FeedEditor,
        Icon
    },
    data() {
        return {
            creating: false,
            loading: false,
            addVisible: false,
            selectedId: null,
            saving: false,
            pdf_feeds: [],
            templates: {},
            has_pro: window.wpPayFormsAdmin.has_pro,
            editorShortcodes: [],
            placeHolders: [],
            fontBaselineMissing: window.wpPayFormsAdmin.fluent_pdf_fonts_ready !== 'yes',
            fluent_pdf_dashboard_url: window.wpPayFormsAdmin.fluent_pdf_dashboard_url,
        };
    },
    methods: {
        createFeed(templateName) {
            this.creating = true;
            this.$post('wppayform-pdf/create_feed', {
                form_id: this.form_id,
                template: templateName
            })
                .then(response => {
                    this.selectedId = response.data.feed_id;
                    this.$notify.success({
                        title: 'Success!',
                        offset: 30,
                        message: response.data.message,
                        position: 'bottom-right'
                    });
                    this.addVisible = false;
                })
                .fail((error) => {
                    this.$notify.error({
                        title: 'Error!',
                        offset: 30,
                        message: error.data.message,
                        position: 'bottom-right'
                    });
                })
                .always(() => {
                    this.creating = false;
                });
        },
        saveSettings() {
            const childComponentInstance = this.$refs.feedRef;
            // Call the method defined in the child component
            if (childComponentInstance) {
                childComponentInstance.saveFeed();
            }
        },
        edit(selectedId) {
            this.selectedId = selectedId;
        },
        remove(id) {
            this.$post('wppayform-pdf/delete_feed', {
                form_id: this.form_id,
                feed_id: id
            })
                .then(response => {
                    this.$notify.success({
                        message: response.data.message
                    });
                    this.fetchPdfFeeds();
                })
                .fail(() => {
                    this.fetchPdfFeeds();
                })
                .always(() => {

                });
        },
        discard() {
            this.fetchPdfFeeds();
            this.selectedId = null;
        },
        fetchPdfFeeds() {
            this.loading = true;
            this.$get('wppayform-pdf/get_feeds', { form_id: this.form_id })
                .then(response => {
                    this.pdf_feeds = response.data.pdf_feeds;
                    this.templates = response.data.templates;
                    this.editorShortcodes = response.data.editor_shortcodes;
                    // this.placeHolders = response.data.placeholders;

                    this.placeHolders[0] = response.data.placeholders.input;
                    this.placeHolders[1] = response.data.placeholders.payment;
                    this.placeHolders[2] = response.data.placeholders.submission;
                    this.placeHolders[3] = response.data.placeholders.wp;
                    this.placeHolders[4] = response.data.placeholders.other

                    if (response.data.placeholders.pdf) {
                        this.placeHolders[5] = response.data.placeholders.pdf
                    }

                })
                .fail(e => {
                    console.log(e);
                })
                .always(() => {
                    this.loading = false;
                });
        }
    },
    mounted() {
        this.fetchPdfFeeds();
        jQuery("title").text("PDF Feeds - Paymattic");
    }
};
</script>

