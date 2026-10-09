<template>
    <div>
        <photo-widget :custom_width="'100%'" :product="field_options.pricing_details.image_url[0]" v-if="field_options.enable_image == 'yes'"/>
        <div v-if="field_options.pricing_details.show_statistic === 'yes'" style="display: flex;margin-bottom: 10px;">
            <div style="width: 33%; text-align: center;">
                <h4> {{currencySign}}0</h4>
                <h4 class="margin-donation">Raised</h4>
            </div>
            <div style="width: 33%;text-align: center;">
                <h4>{{currencySign}}0</h4>
                <h4 class="margin-donation">Donation</h4>
            </div>
            <div style="width: 33%; text-align: center;">
                <h4>{{currencySign}}{{field_options.pricing_details.donation_goals}}</h4>
                <h4 class="margin-donation">Goal</h4>
            </div>
        </div>
        <div v-if="field_options.pricing_details.progress_bar === 'yes' && field_options.pricing_details.show_statistic === 'yes'" style="margin: 20px 0">
            <el-progress :percentage="50" color="#065d95" :stroke-width="18"></el-progress>
        </div>
        <div style="display: flex">
            <div class="donation-button">{{currencySign}}</div>
            <input class="donation-input" type="text" value="100" />
        </div>
        <div style="display: flex">
            <label
                style="margin: 7px;
                margin-left: 0px;"
                class="donation-button"
                v-for="product in field_options.pricing_details.multiple_pricing"
                :key="product.value"
            ><span v-if="!product.label">{{ currencySign }}</span>{{ product.label || product.value }}</label>
            <label
                style="margin: 7px; margin-left: 0px;"
                class="donation-button"
                v-if="field_options.pricing_details.allow_custom_amount === 'yes' && has_pro"
            >Custom amount</label>
        </div>
        <div v-if="field_options.pricing_details.allow_recurring === 'yes' && has_pro" style="display: flex; margin-top: 10px">
            <input style="margin-top: 2px;" type="checkbox" />
            <!-- <p style="margin:0">I would like to recurring donation</p> -->
            <LabelEditor
                style="margin-right: 4px; border: none; font-size: 14px;"
                v-model="field_options.pricing_details.interval_label"
                :nullable="true"
                :placeholder="field_options.pricing_details.interval_label"
            />
        </div>

        <div v-if="field_options.pricing_details.allow_recurring === 'yes'">
            <div v-if="field_options.pricing_details.interval_display_type === 'dropdown'" style="display: flex; margin-top: 10px">  
                <LabelEditor
                        class="wpf_interval_text_dropdown"
                        style="margin-right: 4px; border: none; font-size: 14px;"
                        v-model="field_options.pricing_details.interval_text"
                        :nullable="true"
                        :placeholder="field_options.pricing_details.interval_text"
                    />
                <el-select v-model="selectedInterval" placeholder="Select">
                    <el-option v-for="interval in field_options.pricing_details.intervals"
                        :key="interval" :label="intervalDisplayLabel(interval)" :value="interval">
                    </el-option>
                </el-select>
            </div>
            <div v-if="field_options.pricing_details.interval_display_type === 'button'" style="margin-top: 10px">
                <LabelEditor
                        style="margin-right: 4px; border: none; font-size: 14px;"
                        v-model="field_options.pricing_details.interval_text"
                        :nullable="true"
                        :placeholder="field_options.pricing_details.interval_text"
                    />
                <el-row>
                    <el-button v-for="interval in field_options.pricing_details.intervals" :key="interval" size="mini" style="font-weight: 400;">
                        {{ intervalDisplayLabel(interval) }}
                    </el-button>
                </el-row>
            </div>

        </div>
        
    </div>
</template>

<script>
import PhotoWidget from '../Widget/PhotoWidget/_photo_widget';
import LabelEditor from '../Widget/LabelEditor.vue';
export default {
      props: ['field_options', 'currencySign'],
      data() {
        return {
          has_pro: window.wpPayFormsAdmin.has_pro || false,
          selectedInterval: null
        };
      },
      components: {
        PhotoWidget,
        LabelEditor
    },
    created() {
        const pricing_details = this.field_options.pricing_details;

        if (!pricing_details.interval_label) {
            this.$set(pricing_details, 'interval_label', 'I would like to recurring donation');
        }
        if(!pricing_details.interval_text) {
            this.$set(pricing_details, 'interval_text', 'Bill my every');
        }
    },
    methods: {
        intervalDisplayLabel(interval) {
            const defaults = {
                day: 'Day', week: 'Week', fortnight: 'Fortnight', month: 'Month',
                quarter: 'Quarter', half_year: 'Half Year', year: 'Year'
            };
            const custom = this.field_options.pricing_details.interval_custom_labels
                && this.field_options.pricing_details.interval_custom_labels[interval];
            if (custom && String(custom).trim() !== '') {
                return custom;
            }
            return defaults[interval] || interval;
        }
    }
}
</script>

<style scoped>
    .donation-button {
        background-color: #f1f1f1;
        border: 1px solid #e4e7ea;
        padding: 8px;
        min-width: 50px;
        text-align: center;
        font-size: 16px;
    }
    .donation-input {
        width: 200px;
        padding: 8px;
        border: 1px solid #e4e7ea;
        margin-left: -2px;
    }
    .donation-select {
        margin-left: 10px;
        padding: 5px 20px;
        border: 1px solid #e4e7ea;
    }
    input[type=text]:focus {
        border-color: #0850ae !important;
    }
    .margin-donation {
        margin: -10px !important;
    }
    .wpf_interval_text_dropdown.wpf-label-editor {
        width: fit-content !important;
        font-size: 13px;
    }

</style>