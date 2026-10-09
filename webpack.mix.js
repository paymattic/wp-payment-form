let mix = require('laravel-mix');
const path = require('path');

mix.setPublicPath('assets');
mix.setResourceRoot('../');

mix.webpackConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'resources/'),
        '@admin': path.resolve(__dirname, 'resources/admin') // Adjust this path to match your project structure
      },
    },
  });
  

require('laravel-mix-polyfill');

mix
    .js('resources/admin/Boot.js', 'assets/js/payforms-boot.js')
    .js('resources/admin/wppayform_deactivate.js', 'assets/js/wppayform_deactivate.js')
    .js('resources/admin/main.js', 'assets/js/payforms-admin.js')
    .js('resources/public/user_dashboard.js', 'assets/js/payforms-user_dashboard.js')
    .js('resources/admin/Components/Settings/settings.js', 'assets/js/settings-app.js')
    .js('resources/public/publicv2.js', 'assets/js/payforms-publicv2.js')
    //leaderboard design
    .js('resources/public/leaderboard-template/template_1.js', 'assets/js/leaderboard.js')
    .js('resources/public/razorpay_handler.js', 'assets/js/razorpay-handler.js')
    .js('resources/public/payrexx_handler.js', 'assets/js/payrexx-handler.js')
    .js('resources/public/paystack_handler.js', 'assets/js/paystack-handler.js')
    .js('resources/public/moneris_handler.js', 'assets/js/moneris-handler.js')
    .js('resources/public/menu_handler.js', 'assets/js/menu-handler.js')
    .js('resources/public/dynamic_calculation.js', 'assets/js/dynamic-calculation.js')
    .js('resources/public/fee-recovery.js', 'assets/js/fee-recovery.js')
    .js('resources/public/Community/CustomerDashboard.js', 'assets/js/Community/CustomerDashboard.js')
    .js('resources/public/SubscriptionCard/UpdateCard.js', 'assets/js/SubscriptionCard/UpdateCard.js')
    .js('resources/public/paymentItem_handler.js', 'assets/js/paymentItem-handler.js')
    .js('resources/public/fileupload.js', 'assets/js/fileupload.js')
    .js('resources/public/tabular_template.js', 'assets/js/tabular_template.js')
    .js('resources/public/wpf-paypal-polling.js', 'assets/js/wpf-paypal-polling.js')
    .js('resources/integrations/tinymce.js', 'assets/js/tinymce.js')
    .sass('resources/scss/admin/wppayform_deactivate.scss', 'assets/css/wppayform_deactivate.css')
    .sass('resources/scss/admin/app.scss', 'assets/css/payforms-admin.css')
    .sass('resources/scss/public/user_dashboard.scss', 'assets/css/wppayform_user_dashboard.css')
    .sass('resources/scss/admin/gutenBlock.scss', 'assets/css/payforms-gutenblock.css')
    .sass('resources/scss/admin/payforms-print.scss', 'assets/css/payforms-print.css')
    .sass('resources/scss/public/public.scss', 'assets/css/payforms-public.css')
    .sass('resources/scss/public/quick_checkout.scss', 'assets/css/quick_checkout.css')
    .sass('resources/scss/public/frameless.scss', 'assets/css/frameless.css')
    .sass('resources/scss/public/leaderboard.scss', 'assets/css/leaderboard.css')
    .sass('resources/scss/public/twenty-twenty-one-fix.scss', 'assets/css/twenty-twenty-one-fix.css')
    .copy('resources/images', 'assets/images')
    .copy('resources/integrations/tinymce_icon.png', 'assets/js/tinymce_icon.png')
    .copy('resources/libs', 'assets/libs')

    .polyfill({
        enabled: true,
        useBuiltIns: "usage",
        targets: { "firefox": "50", "ie": 11 }
    });

mix.react('resources/integrations/gutenBlock.js', 'assets/js/wpf-gutenblock-build.js');
