import SupportAndDocumentation from "./Components/Supports/Support";
import GlobalView from "./Components/Global/index.vue";
import AllForms from "./Components/Forms/AllForms";
import Integrations from "./Components/Integrations/Integrations";
import IntegrationSettings from "./Components/Integrations/IntegrationSettings";
import EditGeneralIntegration from "./Components/Form/settings/IntegrationEditor";

import OldEditFormView from "./Components/Form/NewIndex.vue";
import EditFormView from "./Components/Form/NewIndex.vue";
import OldFormBuilder from "./Components/Form/FormBuilder";
import FormBuilder from "./Components/Form/NewFormBuilder";
import EasyDonationTemplate from "./Components/Form/editor/EasyDonationTemplate/DonationEditor.vue";
// Form Settings Components
import FormSettingsIndex from "./Components/Form/settings/index.vue";
import FormPaymentSettings from "./Components/Form/settings/ConfirmationSettings";
import FormCurrencySettings from "./Components/Form/settings/CurrencySettings";
import FormSchedulingSetting from "./Components/Form/settings/SchedulingSettings";
import FormCustomCssJs from "./Components/Form/settings/FormCustomCssJs";
import FormEmailSettings from "./Components/Form/EmailSettings/FormEmailSettings";
import FormDesignSettings from "./Components/Form/settings/FormDesignSettings";
import PaymentSettings from "./Components/Form/settings/PaymentSettings";
// import Leaderboard from "./Components/Form/settings/Leaderboard.vue";
import Leaderboard from "./Components/Form/settings/Leaderboard";
// Form Entries Components End
import FormEntries from "./Components/Form/FormEntries/FormEntries";
import Entries from "./Components/Entries/Entries";
import Entry from "./Components/Form/FormEntries/Entry";
// import Slack from "./Components/Form/settings/Slack";
// import Zapier from "./Components/Form/settings/Zapier";
// import Webhook from "./Components/Form/settings/Webhook/Webhook";
import Integration from "./Components/Form/settings/Integration";
import Gateways from "./Components/Settings/Payments/Gateways.vue";
import Reports from "./Components/Reports/Reports.vue";
import Customers from "./Components/Customers/Customers.vue";
import Customer from './Components/Customers/Customer/Customer.vue';
import FormConfirmation from "./Components/Forms/FormConfirmation.vue";
import PdfFeeds from "./Components/Form/PdfFeeds/PdfFeeds.vue";

const formEditorChildrenRoutes = window.WPPayForms.applyFilters(
    "wpf_main_children_routes", [{
            path: "confirmation_settings",
            name: "confirmation_settings",
            component: FormPaymentSettings,
        },
        {
            path: "currency_settings",
            name: "form_currency_settings",
            component: FormCurrencySettings,
        },
        {
            path: "design_options",
            name: "design_options",
            component: FormDesignSettings,
        },
        {
            path: "payment_settings",
            name: "payment_settings",
            component: PaymentSettings,
        },
        {
            path: "scheduling_settings",
            name: "scheduling_settings",
            component: FormSchedulingSetting,
        },
        // {
        //     path: "slack",
        //     name: "slack",
        //     component: Slack,
        // },
        // {
        //     path: "zapier",
        //     name: "zapier",
        //     component: Zapier,
        // },
        // {
        //     path: "webhook",
        //     name: "webhook",
        //     component: Webhook,
        // },
        {
            path: "custom-css-js",
            name: "custom_css_js",
            component: FormCustomCssJs,
        },
        {
            path: "leaderboard_settings",
            name: "leaderboard_settings",
            component: Leaderboard,
        },
        {
            path: "pdf-feeds",
            name: "pdf-feeds",
            component: PdfFeeds,
        },
    ]
);

const formEditRoutes = window.WPPayForms.applyFilters(
    "wpf_edit_children_routes", [{
            path: "form-builder",
            name: "edit_form",
            component: FormBuilder,
        },
        {
            path: "settings",
            component: FormSettingsIndex,
            children: formEditorChildrenRoutes,
        },
        {
            path: "email_settings",
            name: "email_settings",
            component: FormEmailSettings,
        },
        {
            path: "form_entries",
            name: "form_entries",
            component: FormEntries,
        },
        {
            path: "entries/:entry_id/view",
            name: "entry",
            component: Entry,
        },
        {
            path: "integrations",
            name: "integration",
            component: Integration,
        },
        {
            path: "/edit-form/:form_id/settings/integrations/:integration_id/:integration_name",
            name: "edit_integration",
            component: EditGeneralIntegration,
        },
    ]
);

const extraModuleRoutes = window.WPPayForms.applyFilters(
    'wpf_extra_module_routes', [{
    path: 'pdf',
    name: 'pdf',
    component: Integrations
    }]
);


const oldFormEditRoutes = window.WPPayForms.applyFilters(
    "wpf_edit_children_routes", [{
        path: "form-builder",
        name: "old_edit_form",
        component: OldFormBuilder,
    }]
);

const GatewaysChildRoutes = window.wpPayFormsAdmin.payment_routes;


export const routes = [{
        path: "/",
        component: GlobalView,
        children: [{
                path: "/",
                name: "forms",
                component: AllForms,
            },
            {
                path: "/new-form",
                name: "new-form",
                component: FormConfirmation,
                meta: {
                    active: 'borrow'
                }
            },
            {
                path: "entries",
                name: "entries",
                component: Entries,
                props: true,
            },
            {
                path: "/reports",
                name: "reports",
                component: Reports,
            },
            {
                path: "/customers",
                name: "customers",
                component: Customers,
                props: true,
            },
            {
                path: "/customers/:email_id/",
                name: "customer",
                component: Customer,
            },
            {
                path: "/quick-form-builder/:form_id/",
                name: "quick_edit_form",
                component: EasyDonationTemplate,
            },
            {
                path: "/integrations",
                name: "integrations",
                component: Integrations,
                children: extraModuleRoutes
            },
            {
                path: '/integrations/:integrationName',
                component: Integrations,
                props: true  // This passes route params as props to the component
            },
            {
                path: "/gateways/",
                name: "gateways",
                component: Gateways,
                children: GatewaysChildRoutes,
            },
            {
                path: "/support",
                name: "support",
                component: SupportAndDocumentation,
            },
        ],
    },
    {
        path: "/edit-form/:form_id/",
        component: EditFormView,
        props: true,
        children: formEditRoutes,
    },
    {
        path: "/old-edit-form/:form_id/",
        component: OldEditFormView,
        props: true,
        children: oldFormEditRoutes,
    }
];