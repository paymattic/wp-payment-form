const paymentStatusIcon = (status) => {
    if (status) {
        // icon format is wpf-{status}, ex: wpf-pending, wpf-completed, wpf-failed
        return 'wpf-' + status.toLowerCase();
    }
    return '';
}

const paymentMethodIcon = (method) => {
    if (method) {
        // icon format is wpf-{method}, ex: wpf-paypal, wpf-stripe, wpf-razorpay. note: many icons are not available
        return 'wpf-' + method.toLowerCase();
    }
    return '';
}

const paymentCardIcon = (card) => {
    if (card === 'visa') {
        return 'wpf-visa-card';
    }else if(card === 'mastercard') {
        return 'wpf-master-card';
    } else if(card === 'discover'){
        return 'wpf-discover-card';
    } else if (card === 'amex'){
        return 'wpf-american-express';
    } else if (card === 'unionpay') {
        return 'wpf-union-pay';
    } else if (card === 'payoneer') {
        return 'wpf-payoneer';
    }
    return '';
}

export { paymentStatusIcon, paymentMethodIcon, paymentCardIcon };