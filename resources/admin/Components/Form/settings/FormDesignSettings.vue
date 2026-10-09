<template>
    <div class="no_shadow">
        <div v-loading="fetching" class="edit_form_warpper">
            <div class="all_payforms_wrapper payform_section wpf_form_layout_design">
                <el-form ref="layout_settings" :label-position="labelPosition" :model="layout_settings" label-width="220px">
                    <AppCard>
                        <template slot="header">
                            <div class="payform_section_header">
                                <!-- <h3 class="payform_section_title">
                                    {{ $t('Form Design Settings') }}
                                </h3>
                                <div class="payform_section_actions">
                                    <el-button v-loading="saving" @click="saveSettings()" class="payform_action wpf_new_ui_button" size="medium"
                                                type="primary">
                                        {{ $t('Save Design Settings') }}
                                    </el-button>
                                </div> -->
                                <div class="sub_section_header">
                                    <h3>{{ $t('Form Layout')}}</h3>
                                </div>
                            </div>
                        </template>
                        <template slot="body">
                            <div class="payform_section_body">
                                <!-- <el-form ref="layout_settings" :label-position="labelPosition" :model="layout_settings" label-width="220px"> -->
                                    <div class="sub_section_body">
                                        <!--Label placement-->
                                        <el-form-item>
                                            <template slot="label">
                                                {{ $t('Label Alignment')}}
                                                <el-tooltip class="item" placement="bottom-start" effect="light">
                                                    <div slot="content">
                                                        <h3>Form Label Placement</h3>

                                                        <p>
                                                            Select the default label placement. Labels can be <br>
                                                            top aligned above a field, left aligned to the <br>
                                                            left of a field, or right aligned to the right of a field.
                                                        </p>
                                                    </div>

                                                    <i class="el-icon-info"></i>
                                                </el-tooltip>
                                            </template>

                                            <el-radio class="el_radio_dashed_button" size="medium" v-for="(labelOption, optionName) in labelPlacementOptions"
                                                        v-model="layout_settings.labelPlacement" :label="optionName"
                                                        :key="optionName">
                                                {{ labelOption }}
                                            </el-radio>
                                        </el-form-item>

                                        <!--Required asterisk mark position -->
                                        <el-form-item>
                                            <template slot="label">
                                                {{ $t('Asterisk Position')}}

                                                <el-tooltip class="item" placement="bottom-start" effect="light">
                                                    <div slot="content">
                                                        <h3>Required Asterisk Position</h3>

                                                        <p>
                                                            {{ $t('The asterisk marker position for the required elements')}}
                                                        </p>
                                                    </div>

                                                    <i class="el-icon-info"></i>
                                                </el-tooltip>
                                            </template>

                                            <el-radio class="el_radio_dashed_button" size="medium" v-for="(option, optionName) in asteriskPlacementMock"
                                                        v-model="layout_settings.asteriskPlacement" :label="optionName"
                                                        :key="optionName">{{ option }}
                                            </el-radio>
                                        </el-form-item>

                                        <!--Submit Button Position -->
                                        <el-form-item>
                                            <template slot="label">
                                                {{ $t('Submit Button Position')}}

                                                <el-tooltip class="item" placement="bottom-start" effect="light">
                                                    <div slot="content">
                                                        <h3>{{ $t('Submit Button Position')}}</h3>
                                                        <p>
                                                            {{ $t('Choose where you want to show your submit button')}}
                                                        </p>
                                                    </div>
                                                    <i class="el-icon-info"></i>
                                                </el-tooltip>
                                            </template>
                                            <el-radio-group v-model="layout_settings.submit_button_position">
                                                <el-radio class="el_radio_dashed_button" size="medium" label="left">{{ $t('Left')}}</el-radio>
                                                <el-radio class="el_radio_dashed_button" size="medium" label="center">{{ $t('Center')}}</el-radio>
                                                <el-radio class="el_radio_dashed_button" size="medium" label="right">{{ $t('Right')}}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </div>
                                <!-- </el-form> -->
                            </div>
                        </template>
                    </AppCard>

                    <AppCard>
                        <template slot="header">
                            <div class="sub_section_header">
                                <h3>{{ $t('Form Element Stylings')}}</h3>
                            </div>
                        </template>
                        <template slot="body">
                            <div class="sub_section_body">
                                <!-- <el-form label-position="top" label-width="100px"> -->
                                    <!--Label placement-->
                                    <el-form-item>
                                        <template slot="label">
                                            {{ $t('Form Labels Font Weight')}}
                                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                                <div slot="content">
                                                    <h3>{{ $t('Form Labels Font Weight')}}</h3>
                                                    <p>
                                                        {{ $t('Select how you want to show the form labels. To make the form labels as bold check this option.')}}
                                                    </p>
                                                </div>

                                                <i class="el-icon-info"></i>
                                            </el-tooltip>
                                        </template>
                                        <el-checkbox true-label="yes" false-label="no" v-model="layout_settings.extra_styles.wpf_bold_labels">{{ $t('Make Labels as bold')}}</el-checkbox>
                                    </el-form-item>

                                    <!--Input Styling Option-->
                                    <el-form-item>
                                        <template slot="label">
                                            {{ $t('Input Item Styles')}}
                                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                                <div slot="content">
                                                    <h3>{{ $t('Input Item Styles')}}</h3>
                                                    <p>
                                                        {{ $t('uncheck this, if you want to use default theme styles!')}}
                                                    </p>
                                                </div>

                                                <i class="el-icon-info"></i>
                                            </el-tooltip>
                                        </template>
                                        <el-checkbox true-label="yes" false-label="no" v-model="layout_settings.extra_styles.wpf_default_form_styles">{{ $t('Enable Default form styles')}}</el-checkbox>
                                    </el-form-item>
                            </div>
                        </template>
                    </AppCard>
                </el-form>
                <div class="wpf_form_setting_btn">
                    <el-button v-loading="saving" @click="saveSettings()" class="payform_action" size="medium"
                                type="primary">
                        {{ $t('Save Design Settings') }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
import AppCard from '../../Common/AppCard.vue';
    export default {
        name: 'form_design_settings',
        components: { 
            AppCard
        },
        props: ['form_id'],
        data() {
            return {
                layout_settings: {
                    extra_styles: {}
                },
                labelPosition: 'top',
                labelPlacementOptions: {
                    'top': 'Top',
                    'left': 'Left',
                    'right': 'Right'
                },
                asteriskPlacementMock: {
                    'none': 'None',
                    'left': 'Left to Label',
                    'right': 'Right to Label'
                },
                fetching: false,
                saving: false
            }
        },
        methods: {
            saveSettings() {
                this.saving = true;
                this.$post(`form/${this.form_id}/settings/design`,{
                    // route: 'update_design_settings',
                    layout_settings: this.layout_settings
                })
                    .then(response => {
                         this.$notify.success({
                            title: 'Success!',
                            message: response.message,
                            position: 'bottom-right'
                        });
                    })
                    .fail((error) => {
                        this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.data.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            getSettings() {
                this.fetching = true;

                // FormController@designSettings
                this.$get(`form/${this.form_id}/settings/design`, {})
                    .then((response) => {
                        this.layout_settings = response.layout_settings;
                    })
                    .fail(error => {
                         this.$notify.error({
                            title: 'Oops!',
                            message: error.responseJSON.message,
                            position: 'bottom-right'
                        });
                    })
                    .always(() => {
                        this.fetching = false;
                    });
            }
        },
        mounted() {
            this.getSettings();
            window.WPPayFormsBus.$emit('site_title', 'Design Settings');
            if(window.outerWidth < 500) {
                this.labelPosition = "top";
            }
        }
    }
</script>