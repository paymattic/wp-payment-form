<template>
    <div class="ninja_intro_welcome">
        <div class="ninja_intro_header">
            <div class="ninja_intro_logo">
                <div class="circle_icon">
                    <Icon icon="wpf-circle"></Icon>
                    <div class="logo_icon">
                        <Icon icon="wpf-logo" />
                    </div>
                </div>
            </div>
            <h2>{{ $t('Welcome to Paymattic') }}</h2>
            <p>{{ $t('Thank you for installing Paymattic – Simplifying WordPress Payments and Donations.') }}</p>
            <div class="ninja_actions">
                <router-link class="payform_action" to="/new-form">
                    <el-button class="wpf_new_ui_button" type="primary" size="medium">
                        <Icon icon="wpf-plus" />
                        {{ $t('Create a Form' ) }}
                    </el-button>
                </router-link>
            </div>
        </div>
        <div class="ninja_docs">
            <ul>
                <li>
                    <Icon icon="wpf-demo" />
                    <a target="_blank"
                       href="https://demo.paymattic.com/">
                        {{ $t('View Available Demos')}}
                    </a>
                </li>
                <li>
                    <Icon icon="wpf-doc" />
                    <a target="_blank"
                       href="https://paymattic.com/docs/paymattic-introduction/">
                        {{ $t('View Available Documentation')}}
                    </a>
                </li>
                <li>
                    <Icon icon="wpf-setting" />
                    <a target="_blank"
                       href="https://paymattic.com/docs/how-to-create-your-first-payment-form-in-a-minute-and-accept-payments-with-paymattic/">
                        {{ $t('Setting up a Form in a minute and accept payments')}}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Icon from "../Icons/Index.vue";
    export default {
        name: "Welcome",
        components: {
            Icon
        },
        data() {
            return {
                docs: []
            }
        },
        methods: {
            create() {
                this.$emit('create', true);
            }
        }
    }
</script>
