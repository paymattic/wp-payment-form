import priceFormat from '../../../../common/formatPrice.js';

const getFormattedMoney = (amount, currency) => {
    if (!amount) {
        return 'n/a';
    }
    return priceFormat(amount, currency);
}

const subscriptionHumanText = (plan) => {
    if (!plan) {
        return '';
    }
    if (parseInt(plan.bill_times)) {
        return 'Customer will be billed '+ plan.bill_times +' times in total';
    } else {
        return 'Customer will be billed until cancelled';
    }
}

const getSubscriptionUrl = (subscription) => {
    if (!subscription) {
        return '';
    }
    const submission = subscription.submission;
    if(submission?.payment_method == 'stripe') {
        if(submission.payment_mode == 'test') {
            return 'https://dashboard.stripe.com/test/subscriptions/' + subscription.vendor_subscriptipn_id;
        }
        return 'https://dashboard.stripe.com/subscriptions/' + subscription.vendor_subscriptipn_id;
    }
}

export  { getFormattedMoney, subscriptionHumanText, getSubscriptionUrl };