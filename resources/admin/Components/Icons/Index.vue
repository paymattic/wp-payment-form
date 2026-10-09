<template>
    <div class="icon">
        <File v-if="icon == 'wpf-file'" />
        <EyeIcon v-if="icon === 'wpf-eye'" />
        <EditIcon v-if="icon === 'wpf-edit'"/>
        <DeleteIcon v-if="icon === 'wpf-delete'"/>
        <ToolsIcon v-if="icon === 'wpf-tools'" />
        <Plus v-else-if="icon == 'wpf-plus'" />
        <Preview v-else-if="icon == 'wpf-preview'" />
        <Premium v-else-if="icon == 'wpf-premium'" />
        <PlusCircle v-else-if="icon == 'wpf-plus-circle'" />
        <UploadIcon v-else-if="icon === 'wpf-upload'" />
        <Drag v-else-if="icon === 'wpf-drag'" />
        <EditorIcon v-else-if="icon === 'wpf-editor'" />
        <SettingsIcon v-else-if="icon === 'wpf-settings'" />
        <EntriesIcon v-else-if="icon === 'wpf-entries'" />
        <IntegrationsIcon v-else-if="icon === 'wpf-integrations' " />
        <NotificationsIcon v-else-if="icon === 'wpf-notifications' " />
        <AddIcon v-else-if="icon === 'wpf-add'" />
        <GoldEyeIcon v-else-if="icon === 'wpf-gold-eye'" />
        <BlackAdd v-else-if="icon === 'wpf-black-add'" />
        <Analytics v-else-if="icon === 'wpf-analytics'" />
        <ArrowRight v-else-if="icon === 'wpf-arrow-right'" />
        <ArrowLeft v-else-if="icon === 'wpf-arrow-left'" />
        <Elearning v-else-if="icon === 'wpf-elearning'" />
        <PinLocation v-else-if="icon === 'wpf-pin-location'" />
        <ChartBarLine v-else-if="icon === 'wpf-chart-bar-line'" />
        <Search v-else-if="icon === 'wpf-search'" />
        <Checkmark v-else-if="icon === 'wpf-checkmark'" />
        <Minus v-else-if="icon === 'wpf-minus'" />
        <Setting v-else-if="icon === 'wpf-setting'" />
        <TotalIcon v-else-if="icon === 'wpf-total'" />
        <PaidIcon v-else-if="icon === 'wpf-paid'" />
        <PendingIcon v-else-if="icon === 'wpf-pending'" />
        <RefundedIcon v-else-if="icon === 'wpf-refunded'" />
        <FailIcon v-else-if="icon === 'wpf-fail'" />
        <ProcessingIcon v-else-if="icon === 'wpf-processing'" />
        <DotIcon v-else-if="icon === 'wpf-dot'" />
        <DuplicateIcon v-else-if="icon === 'wpf-duplicate'" />
        <StatusIcon v-else-if="icon === 'wpf-status'" />
        <GreaterIcon v-else-if="icon === 'GreaterIcon'" />
        <BackIcon v-else-if="icon === 'wpf-back'" />
        <ForwardIcon v-else-if="icon === 'wpf-forward'" />
        <ExportIcon v-else-if="icon === 'wpf-export'" />
        <PaymentIcon v-else-if="icon === 'wpf-payment'" />
        <ActivityIcon v-else-if="icon === 'wpf-activity'" />
        <DottedIcon v-else-if="icon === 'wpf-dotted'" />
        <Active v-else-if="icon === 'wpf-active'" />
        <Cancelled v-else-if="icon === 'wpf-cancelled'" />
        <Stripe v-else-if="icon === 'wpf-stripe'" />
        <Offline v-else-if="icon === 'wpf-offline'" />
        <MasterCard v-else-if="icon === 'wpf-master-card'" />
        <Paypal v-else-if="icon === 'wpf-paypal'" />
        <AmericanExpress v-else-if="icon === 'wpf-american-express'" />
        <DiscoverCard v-else-if="icon === 'wpf-discover-card'" />
        <UnionPay v-else-if="icon === 'wpf-union-pay'" />
        <Jcb v-else-if="icon === 'wpf-jcb'" />
        <VisaCard v-else-if="icon === 'wpf-visa-card'" />
        <PrintIcon v-else-if="icon === 'wpf-print'" />
        <MailIcon v-else-if="icon === 'wpf-mail'" />
        <Money v-else-if="icon === 'wpf-money'" />
        <InactiveIcon v-else-if="icon === 'wpf-inactive'" />
        <ExpiredIcon v-else-if="icon === 'wpf-expired'" />
        <GridView v-else-if="icon === 'wpf-grid-view'" />
        <Tick v-else-if="icon === 'wpf-tick'" />
        <ProKeyIcon v-else-if="icon === 'wpf-pro'" />
        <Download v-else-if="icon === 'wpf-download'" />
        <Customers v-else-if="icon === 'wpf-customers'" />
        <ArrowDown v-else-if="icon === 'wpf-arrow-down'" />
        <ArrowUp v-else-if="icon === 'wpf-arrow-up'" />
        <Warning v-else-if="icon === 'wpf-warning'" />
        <Submissions v-else-if="icon === 'wpf-submissions'" />
        <MoneyBag v-else-if="icon === 'wpf-money-bag'" />
        <FormIcon v-else-if="icon === 'wpf-form'" />
        <LinkIcon v-else-if="icon === 'wpf-link'" />
        <UpIcon v-else-if="icon === 'wpf-up'" />
        <DownIcon v-else-if="icon === 'wpf-down'" />
        <CopyIcon v-else-if="icon === 'wpf-copy'" />
        <UploadFile v-else-if="icon === 'wpf-upload-file'" />
        <EmptyGraph v-else-if="icon === 'wpf-empty-graph'" />
        <Authorised v-else-if="icon === 'wpf-authorized'" />
        <UpgradeIcon v-else-if="icon === 'wpf-upgrade'" />
        <UpgradeWhite v-else-if="icon === 'wpf-upgrade-white'" />
        <Logo v-else-if="icon === 'wpf-logo'" />
        <WhiteCircle v-else-if="icon === 'wpf-circle'" />
        <DemoIcon v-else-if="icon === 'wpf-demo'" />
        <DocIcon v-else-if="icon === 'wpf-doc'" />
        <PlusForCreateForm v-else-if="icon === 'wpf-plus-form'" />
        <ProIcon v-else-if="icon === 'wpf-pro-icon'" />
        <GlobIcon v-else-if="icon === 'wpf-glob-icon'" />
        <GroupIcon v-else-if="icon === 'wpf-group-icon'" />
        <LockIcon v-else-if="icon === 'wpf-lock-icon'" />
        <DropDownIcon v-else-if="icon === 'wpf-drop-down-icon'" />
        <SyncIcon v-else-if="icon === 'wpf-sync'" />
        <RefundIcon v-else-if="icon === 'wpf-refund'" />
        <RefundDisableIcon v-else-if="icon === 'wpf-refund-disable'" />
        <ExternalLinkIcon v-else-if="icon === 'wpf-external-link'" />
    </div>
</template>

<script type="text/babel">
import File from './File.vue';
import EyeIcon from './EyeIcon.vue';
import EditIcon from './EditIcon.vue';
import DeleteIcon from './DeleteIcon.vue';
import ToolsIcon from './ToolsIcon.vue';
import Plus from './Plus.vue';
import Preview from './Preview.vue';
import Premium from './Premium.vue';
import PlusCircle from './PlusCircle.vue';
import UploadIcon from './UploadIcon.vue';
import Drag from './Drag.vue';
import EditorIcon from './EditorIcon.vue';
import SettingsIcon from './SettingsIcon.vue';
import EntriesIcon from './EntriesIcon.vue';
import IntegrationsIcon from './IntegrationsIcon.vue';
import NotificationsIcon from './NotificationsIcon.vue';
import AddIcon from './AddIcon.vue';
import GoldEyeIcon from './GoldEyeIcon.vue';
import BlackAdd from './BlackAdd.vue';
import Analytics from './Analytics.vue';
import ArrowRight from './ArrowRight.vue';
import ArrowLeft from './ArrowLeft.vue';
import PinLocation from './PinLocation.vue';
import ChartBarLine from './ChartBarLine.vue';
import Elearning from './Elearning.vue';
import Search from './Search.vue';
import Checkmark from './Checkmark.vue';
import Minus from './Minus.vue';
import Setting from './Setting.vue';
import TotalIcon from './TotalIcon.vue';
import PaidIcon from './PaidIcon.vue';
import PendingIcon from './PendingIcon.vue';
import RefundedIcon from './RefundedIcon.vue';
import FailIcon from './FailIcon.vue';
import ProcessingIcon from './ProcessingIcon.vue';
import DotIcon from './DotIcon.vue';
import DuplicateIcon from './DuplicateIcon.vue';
import StatusIcon from './StatusIcon.vue';
import GreaterIcon from './GreaterIcon.vue';
import BackIcon from './BackIcon.vue';
import ForwardIcon from './ForwardIcon.vue';
import ExportIcon from './ExportIcon.vue';
import PaymentIcon from './PaymentIcon.vue';
import ActivityIcon from './ActivityIcon.vue';
import DottedIcon from './DottedIcon.vue';
import Active from './Active.vue';
import Cancelled from './Cancelled.vue';
import Stripe from './Stripe.vue';
import MasterCard from './MasterCard.vue';
import Paypal from './Paypal.vue';
import DiscoverCard from './DiscoverCard.vue';
import Jcb from './Jcb.vue';
import VisaCard from './VisaCard.vue';
import UnionPay from './UnionPay.vue';
import AmericanExpress from './AmericanExpress.vue';
import PrintIcon from './PrintIcon.vue';
import MailIcon from './MailIcon.vue';
import Tick from './Tick.vue';
import Money from './Money.vue';
import InactiveIcon from './InactiveIcon.vue';
import ExpiredIcon from './ExpiredIcon.vue';
import GridView from './GridView.vue';
import ProKeyIcon from './ProKeyIcon.vue';
import Download from './Download.vue';
import Offline from './Offline.vue';
import Customers from './Customers.vue';
import ArrowDown from './ArrowDown.vue';
import ArrowUp from './ArrowUp.vue';
import Warning from './Warning.vue';
import Submissions from './Submissions.vue';
import MoneyBag from './MoneyBag.vue';
import FormIcon from './FormIcon.vue';
import LinkIcon from './LinkIcon.vue';
import UpIcon from './UpIcon.vue';
import DownIcon from './DownIcon.vue';
import CopyIcon from './CopyIcon.vue';
import UploadFile from './UploadFile.vue';
import EmptyGraph from './EmptyGraph.vue';
import Authorised from './Authorised.vue';
import UpgradeIcon from './UpgradeIcon.vue';
import UpgradeWhite from './UpgradeWhite.vue';
import Logo from './Logo.vue';
import WhiteCircle from './WhiteCircle.vue';
import DemoIcon from './DemoIcon.vue';
import DocIcon from './DocIcon.vue'
import PlusForCreateForm from './PlusForCreateForm.vue';
import ProIcon from './ProIcon.vue';
import GlobIcon from './GlobIcon.vue';
import GroupIcon from './GroupIcon.vue';
import LockIcon from './Lock.vue';
import DropDownIcon from './DropDownIcon.vue';
import SyncIcon from './SyncIcon.vue';
import RefundIcon from './RefundIcon.vue';
import RefundDisableIcon from './RefundDisableIcon.vue';
import ExternalLinkIcon from './ExternalLinkIcon.vue';

export default {
    name: 'Icon',
    components: {
        File,
        Plus,
        Preview,
        Premium,
        EyeIcon,
        EditIcon,
        DeleteIcon,
        ToolsIcon,
        PlusCircle,
        UploadIcon,
        Drag,
        EditorIcon,
        SettingsIcon,
        EntriesIcon,
        IntegrationsIcon,
        NotificationsIcon,
        AddIcon,
        GoldEyeIcon,
        BlackAdd,
        Analytics,
        ArrowRight,
        ArrowLeft,
        PinLocation,
        ChartBarLine,
        Elearning,
        Search,
        Checkmark,
        Minus,
        Setting,
        TotalIcon,
        PaidIcon,
        PendingIcon,
        RefundedIcon,
        FailIcon,
        ProcessingIcon,
        DotIcon,
        DuplicateIcon,
        StatusIcon,
        GreaterIcon,
        BackIcon,
        ForwardIcon,
        ExportIcon,
        PaymentIcon,
        ActivityIcon,
        DottedIcon,
        Active,
        Cancelled,
        Stripe,
        MasterCard,
        AmericanExpress,
        Jcb,
        UnionPay,
        VisaCard,
        DiscoverCard,
        Paypal,
        PrintIcon,
        MailIcon,
        Tick,
        Money,
        InactiveIcon,
        ExpiredIcon,
        GridView,
        ProKeyIcon,
        Download,
        Offline,
        Customers,
        ArrowDown,
        ArrowUp,
        Warning,
        Submissions,
        MoneyBag,
        FormIcon,
        LinkIcon,
        UpIcon,
        DownIcon,
        CopyIcon,
        UploadFile,
        EmptyGraph,
        Authorised,
        UpgradeIcon,
        UpgradeWhite,
        Logo,
        WhiteCircle,
        DemoIcon,
        DocIcon,
        PlusForCreateForm,
        ProIcon,
        GlobIcon,
        GroupIcon,
        LockIcon,
        DropDownIcon,
        SyncIcon,
        RefundIcon,
        RefundDisableIcon,
        ExternalLinkIcon
    },
    props: ['icon'],
}
</script>
