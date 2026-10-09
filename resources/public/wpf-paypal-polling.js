jQuery(() => {
    class PayPalPolling {
        constructor() {
            this.loader = jQuery('body').find('.wpf_paypal_delay_loader_check');
            this.vars = window.wpf_paypal_polling_vars || {};
            this.attempts = 0;
            this.maxAttempts = 5;
            this.init();
        }

        init() {
            if (!this.loader.length) {
                return;
            }

            if (!this.vars.ajax_url || !this.vars.submission_hash) {
                console.log('[Paymattic PayPal] Missing polling vars — aborting.');
                this.showFailure();
                return;
            }

            this.schedule();
        }

        schedule() {
            this.attempts++;
            console.log('[Paymattic PayPal] Attempt #' + this.attempts + ' — waiting ' + (this.vars.timeout / 1000) + 's before poll...');
            setTimeout(() => this.poll(), this.vars.timeout);
        }

        poll() {
            console.log('[Paymattic PayPal] Polling payment status for hash:', this.vars.submission_hash);

            // AJAX handler registered in wp-payment-form-pro/src/GateWays/PayPal/PayPal.php – checkPaymentStatus()
            jQuery.post(this.vars.ajax_url, {
                action: 'wpf_paypal_delayed_check',
                submission_hash: this.vars.submission_hash,
                nonce: this.vars.nonce
            }).then((response) => {
                console.log('[Paymattic PayPal] Response:', response);

                if (response.success && response.data.nextAction === 'reload') {
                    console.log('[Paymattic PayPal] Payment paid — reloading page.');
                    window.location.reload();
                } else if (this.attempts <= this.maxAttempts) {
                    console.log('[Paymattic PayPal] Still pending (status: ' + response.data.payment_status + ') — scheduling retry.');
                    this.schedule();
                } else {
                    console.log('[Paymattic PayPal] Max retries reached — showing failure message.');
                    this.showFailure();
                }
            }).catch((err) => {
                console.log('[Paymattic PayPal] Request failed:', err);
                if (this.attempts <= this.maxAttempts) {
                    this.schedule();
                } else {
                    this.showFailure();
                }
            });
        }

        showFailure() {
            this.loader.find('.wpf_paypal_loader_spinner').remove();
            this.loader.html(this.vars.onFailedMessage || 'Payment status could not be verified. Please contact us to confirm your payment.');
        }
    }

    new PayPalPolling();
});
