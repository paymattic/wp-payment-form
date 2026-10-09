/**
 * GiveWP → Paymattic Migrator — Vue 2 entry point.
 *
 * This is a standalone mini-SPA, completely separate from the main Paymattic
 * admin app (payforms-admin.js). It mounts its own Vue 2 instance on the
 * #wpf-givewp-migrator-app div rendered by app/Views/wppayform_migrator.php.
 *
 * Vue 2 and Element UI are available globally via the wppayform_boot bundle
 * (payforms-boot.js) which is enqueued as a dependency in MigratorPage::enqueueAssets().
 * We import them here so webpack can resolve the module graph for this bundle
 * without duplicating the payforms-boot.js registration.
 *
 * Element UI components (Button, Progress, Alert, etc.) are already registered
 * globally by Boot.js / elements.js — we just import Vue and mount the app.
 */
import Vue from 'vue';
import App from './App.vue';

document.addEventListener('DOMContentLoaded', function () {
    const mountEl = document.getElementById('wpf-givewp-migrator-app');

    // Guard: only mount when the dedicated div is present.
    // On any other admin page the div is absent and we exit silently.
    if (!mountEl) {
        return;
    }

    new Vue({
        el: '#wpf-givewp-migrator-app',
        render: function (h) {
            return h(App);
        },
    });
});
