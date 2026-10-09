<template>
    <div>
        <!--Confirmation Type-->
        <el-form-item>
            <template slot="label">
                {{ $t('Confirmation Type')}}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>{{ $t('Confirmation Type')}}</h3>
                        <p>
                           {{ $t('After submit, where the page will redirect to.')}}
                        </p>
                    </div>
                    <i class="el-icon-info" />
                </el-tooltip>
            </template>
            <el-radio class="el_radio_dashed_button" v-for="(redirectOption, optionName) in redirectToOptions"
                      v-model="confirmation.redirectTo" :label="optionName" :key="optionName"
            >
                {{ redirectOption }}
            </el-radio>
        </el-form-item>

        <!--Additional fields based on the redirect to selection-->
        <!--Same page-->
        <div v-if="confirmation.redirectTo === 'samePage'" class="conditional-items">
            <!--Message to show-->
            <el-form-item>
                <template slot="label">
                    {{ $t('Message to show')}}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>{{ $t('Confirmation Message Text')}}</h3>
                            <p>
                                {{ $t('Enter the text you would like the user to')}} <br>
                                {{ $t('see on the confirmation page of this form.')}}
                            </p>
                        </div>

                        <i class="el-icon-info" />
                    </el-tooltip>
                </template>

                <wp-editor editor_id="wp_confirmation_editor_1" :height="250" :editor-shortcodes="editorShortcodes" v-model="confirmation.messageToShow" />
            </el-form-item>

            <!--After form submission behavior-->
            <el-form-item>
                <template slot="label">
                    {{ $t('After Form Submission')}}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>{{ $t('After Form Submission Behavior')}}</h3>
                            <p>
                                {{ $t('Select the behavior after form submission,')}} <br>
                                {{ $t('whether you want to hide or reset the form.')}}
                            </p>
                        </div>
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </template>

                <el-radio class="el_radio_dashed_button" v-model="confirmation.samePageFormBehavior"
                          label="hide_form">{{ $t('Hide Form')}}
                </el-radio>

                <el-radio class="el_radio_dashed_button" v-model="confirmation.samePageFormBehavior"
                          label="reset_form">{{ $t('Reset Form')}}
                </el-radio>
            </el-form-item>
        </div>

        <!--Custom page-->
        <el-form-item v-else-if="confirmation.redirectTo === 'customPage'"
                      class="conditional-items"
        >
            <template slot="label">
               {{ $t('Select Page')}}

                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>{{ $t('Redirect Form to Page')}}</h3>

                        <p>
                           {{ $t('Select the page you would like the user to be')}} <br>
                           {{ $t('redirected to after they have submitted the form.')}}
                        </p>
                    </div>

                    <i class="el-icon-info" />
                </el-tooltip>
            </template>

            <el-select v-model="confirmation.customPage" filterable placeholder="Select">
                <el-option
                    v-for="page in pages"
                    :key="page.ID"
                    :label="page.post_title"
                    :value="page.ID"
                />
            </el-select>
            <p>{{ $t('Add the following shortcode to the page to show payment receipt')}}: <code>[wppayform_reciept]</code></p>
        </el-form-item>
        <!-- Custom Post -->
        <el-form-item v-else-if="confirmation.redirectTo === 'customPost'"
                      class="conditional-items"
        >
            <template slot="label">
               {{ $t('Select Post')}}

                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>{{ $t('Redirect Form to Post')}}</h3>

                        <p>
                           {{ $t('Select the post you would like the user to be')}} <br>
                           {{ $t('redirected to after they have submitted the form.')}}
                        </p>
                    </div>

                    <i class="el-icon-info" />
                </el-tooltip>
            </template>

            <el-select v-model="confirmation.customPage" filterable placeholder="Select">
                <el-option
                    v-for="post in posts"
                    :key="post.ID"
                    :label="post.post_title"
                    :value="post.ID"
                />
            </el-select>
            <p>{{ $t('Add the following shortcode to the post to show payment receipt')}}: <code>[wppayform_reciept]</code></p>
        </el-form-item>
        <!--Custom URL-->
        <el-form-item class="conditional-items" v-else-if="confirmation.redirectTo == 'customUrl'">
            <template slot="label">
                {{ $t('Custom URL')}}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>{{ $t('Redirect Form to URL')}}</h3>
                        <p>
                           {{ $t('Enter the URL of the webpage you would')}} <br>
                            {{ $t('like the user to be redirected to after')}} <br>
                            {{ $t('they have submitted the form.')}}
                        </p>
                    </div>
                    <i class="el-icon-info" />
                </el-tooltip>
            </template>

            <el-input size="medium" placeholder="Redirect URL" v-model="confirmation.customUrl">
                <popover
                    @command="(code) => { confirmation.customUrl += code }"
                    slot="suffix" :data="editorShortcodes"
                    btnType="text"
                    buttonText='' class="wpf_custom_redirect_url">
                </popover>
            </el-input>
            <p>{{ $t('Add the following shortcode to the page to show payment receipt:')}} <code>[wppayform_reciept]</code></p>
        </el-form-item>
    </div>
</template>

<script>
    import wpEditor from '../../Common/_wp_editor';
    import popover from '../../Common/input-popover-dropdown.vue';

    export default {
        name: 'AddConfirmation',
        components: {
            wpEditor,
            popover
        },
        props: ['pages', 'posts', 'editorShortcodes', 'confirmation'],
        computed: {
            inputsFirstShortcodes() {
                return this.editorShortcodes;
            }
        },
        data() {
            return {
                redirectToOptions: {
                    samePage: this.$t('Same Page'),
                    customPage: this.$t('To a Page'),
                    customPost: this.$t('To a Post'),
                    customUrl: this.$t('To a Custom URL'),
                }
            }
        },
        mounted() {

        }
    }
</script>