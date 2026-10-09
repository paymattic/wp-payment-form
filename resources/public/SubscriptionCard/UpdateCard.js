/**
 * Paymattic — customer-initiated card swap for a live Stripe subscription.
 *
 * Standalone bundle: resources/public/SubscriptionCard/UpdateCard.js
 *                 -> assets/js/SubscriptionCard/UpdateCard.js
 * Deliberately NOT part of the payforms-user_dashboard.js bundle.
 *
 * ---------------------------------------------------------------------------
 * THE SERVER SIDE OF THIS FILE LIVES IN THE PRO PLUGIN (wp-payment-form-pro).
 *
 *   enqueue + Stripe.js   WPPayFormPro\Classes\Dashboard\Render::localizedScript()
 *   POST wpf_update_subscription_card    -> UpdateSubscriptionCard::handle()
 *   POST wpf_subscription_card_attempts  -> UpdateSubscriptionCard::attempts()
 *   both registered in wp-payment-form-pro.php, gated on WPPAYFORM_VERSION
 *
 * Nothing in lite renders this view or these actions: the [wppayform_dashboard]
 * shortcode is pro-only, so lite alone never loads this file. Same split as the
 * existing wpf_cancel_subscription / wpf_sync_subscription calls in
 * user_dashboard.js — pro has no JS build step, so its JS ships from lite.
 *
 * A lite change here therefore needs the matching pro change deployed with it.
 * ---------------------------------------------------------------------------
 *
 * Depends on the wppayform_user_dashboard handle for window.wpPayFormsDashboard,
 * and on stripe_elements for window.Stripe. Both are declared in
 * Render::localizedScript(), so both exist by the time this runs.
 */
jQuery(document).ready(function ($) {
    if (!window.wpPayFormsDashboard || !window.Stripe) {
        return;
    }

    const mounted = {};
    const stripeByKey = {};

    const elementStyle = {
        base: {
            fontSize: '15px',
            color: '#32325d',
            '::placeholder': { color: '#aab7c4' }
        },
        invalid: { color: '#e5424d' }
    };

    const i18n = window.wpPayFormsDashboard.i18n || {};
    const t = (key, fallback) => i18n[key] || fallback;

    // Show how many rounds are left BEFORE the customer spends their last one. A cap of 3 with
    // no forewarning is hostile to someone working through expired cards — each card Stripe
    // accepts but then declines burns a slot, and the wall arrives with no notice.
    //
    // Read-only, and failures are swallowed on purpose: this is advisory decoration. If the
    // endpoint is unreachable the modal must still work — the throttle is enforced server-side
    // regardless of whether this note rendered.
    function renderRemaining($modal, subscriptionId) {
        const $notice = $modal.find('.wpf-rate-limit-notice');

        if (!$notice.length) {
            return;
        }

        // Monotonic token. Every ended attempt fires a fresh read, and two reads can be in flight
        // at once (rapid re-submit) with no ordering guarantee across separate HTTP requests. An
        // older "1 more time" landing after a newer "0 remaining" would put the stale number back
        // on screen next to the error contradicting it — the exact bug this note exists to avoid.
        // Last read issued wins; earlier ones drop their response on the floor.
        const seq = ($modal.data('wpfNoticeSeq') || 0) + 1;
        $modal.data('wpfNoticeSeq', seq);

        jQuery.post(window.wpPayFormsDashboard.ajaxurl, {
            action: 'wpf_subscription_card_attempts',
            nonce: window.wpPayFormsDashboard.nonce,
            subscription_id: subscriptionId
        }).then((res) => {
            if ($modal.data('wpfNoticeSeq') !== seq) {
                return; // a newer read has already been issued — this response is stale
            }

            const remaining = res?.data?.remaining;

            if (remaining === undefined || remaining === null) {
                return;
            }

            if (remaining > 0) {
                const times = remaining === 1
                    ? t('more time today', 'more time today')
                    : t('more times today', 'more times today');
                $notice
                    .removeClass('wpf-rate-limit-notice--warning')
                    .text(`${t('You can update your card', 'You can update your card')} ${remaining} ${times}.`)
                    .prop('hidden', false);
                return;
            }

            // Nothing left. If an error is already on screen it has just said the same thing in a
            // more immediate register ("Too many card verification attempts…"), so stacking the
            // note under it is two sentences for one fact. Keep the note for the case that needs
            // it — opening the modal already exhausted, with no error yet.
            if ($modal.find('.wpf-card-error').text().trim()) {
                $notice.prop('hidden', true);
                return;
            }

            $notice
                .addClass('wpf-rate-limit-notice--warning')
                .text(t(
                    'You have reached your 24 hours limit for updating card. Please try again tomorrow.',
                    'You have reached your 24 hours limit for updating card. Please try again tomorrow.'
                ))
                .prop('hidden', false);
        }).fail(() => {
            // Advisory only — stay silent and leave the modal usable.
        });
    }

    // Mount a card Element per row, using that row's own publishable key. The dashboard
    // aggregates subscriptions across forms, and a form may use a custom Stripe account —
    // one global key would mint the PaymentMethod under the wrong account.
    $('.wpf-update-card-button').click(function () {
        const modalId = $(this).data('modal_id');
        const pubKey = $(this).data('pubkey');
        const subscriptionId = $(this).data('subscription_id');
        const $modal = $(`#${modalId}`);

        // Open it ourselves. modalToggle() in user_dashboard.js only binds
        // '.wpf_toal_amount_btn, .wpf-cancel-confirm-button' — our button is not in that
        // selector, and we are no longer part of that bundle.
        $modal.css('display', 'block');
        $('body').css({ overflow: 'hidden' });
        $modal.find('.wpf-card-error').text('');

        // Re-read on every open: a previous attempt in this same session may have spent a slot.
        renderRemaining($modal, subscriptionId);

        if (mounted[modalId]) {
            return;
        }

        // One Stripe instance per publishable key, not per modal. Stripe() is expensive — it
        // boots its own machinery and iframes — and this dashboard lists every subscription a
        // customer owns, so the same key recurs across many rows. Keyed by pubkey because rows
        // from forms on custom Stripe accounts genuinely need their own instance.
        if (!stripeByKey[pubKey]) {
            stripeByKey[pubKey] = Stripe(pubKey);
        }
        const stripe = stripeByKey[pubKey];
        const elements = stripe.elements();

        // Three separate Elements, not one combined 'card'. Each mounts into its own labelled
        // field. The row index is in the ids because the dashboard renders one modal per
        // subscription and Stripe mounts by selector — a shared id would mount every card
        // number into the first row's modal.
        const suffix = modalId.replace('wpf_update_card_modal', '');

        const cardNumber = elements.create('cardNumber', { style: elementStyle, showIcon: true });
        const cardExpiry = elements.create('cardExpiry', { style: elementStyle });
        const cardCvc = elements.create('cardCvc', { style: elementStyle });

        cardNumber.mount(`#wpf_card_number${suffix}`);
        cardExpiry.mount(`#wpf_card_expiry${suffix}`);
        cardCvc.mount(`#wpf_card_cvc${suffix}`);

        // Resolve the error slot once. `change` fires on every keystroke, and $modal.find() would
        // re-walk the DOM each time — on a dashboard rendering one modal per subscription that is
        // real work for nothing.
        const $error = $modal.find('.wpf-card-error');

        // One error slot for all three: Stripe reports per-element, so the last event wins.
        // Clearing on a valid change would wipe a sibling's still-live error, so only write
        // when this element has something to say.
        [cardNumber, cardExpiry, cardCvc].forEach((el) => {
            el.on('change', function (event) {
                if (event.error) {
                    $error.text(event.error.message);
                } else if (event.complete) {
                    $error.text('');
                }
            });
        });

        // createPaymentMethod only needs the cardNumber element — Stripe pulls expiry and cvc
        // from the sibling Elements it was created alongside.
        mounted[modalId] = { stripe: stripe, card: cardNumber };
    });

    // Our own close classes — NOT .wpf-close / .wpf-cancel.
    // modalToggle() (user_dashboard.js:136-140) does `$(".wpf-close, .wpf-cancel").click(...)`:
    // a DIRECT binding, made at document-ready, against a shared module-level `modal` var.
    // Our modal is server-rendered, so it is in the DOM at ready — reusing those classes
    // would match that binding too, and delegation cannot cancel it (direct target-phase
    // handlers run first). Result would be `modal.css is not a function` when `modal` is
    // still "", or silently re-hiding whatever modal was opened earlier in the session.
    $('.wpf-update-card-modal').on('click', '.wpf-card-close, .wpf-card-cancel', function () {
        $(this).closest('.wpf-update-card-modal').css('display', 'none');
        $('body').css({ overflow: 'visible' });
    });

    $('.wpf-confirm-card-update').click(async function () {
        const $btn = $(this);
        const $modal = $btn.closest('.wpf-update-card-modal');
        const $error = $modal.find('.wpf-card-error');
        const modalId = $modal.attr('id');
        const subscriptionId = $btn.data('subscription_id');
        const ctx = mounted[modalId];

        if (!ctx) {
            return;
        }

        // Every path that ends a failed attempt goes through here. The note is fetched when the
        // modal opens, and a submit can spend a slot — so without re-reading it, the stale count
        // sits on screen contradicting the error right above it ("You can update your card 1 more
        // time today." next to "Too many card verification attempts."). The server is the only
        // source of truth for the count; never decrement it client-side.
        const endAttempt = (message) => {
            $error.text(message || '');
            $btn.prop('disabled', false);
            renderRemaining($modal, subscriptionId);
        };

        const post = (payload) => jQuery.post(window.wpPayFormsDashboard.ajaxurl, Object.assign({
            action: 'wpf_update_subscription_card',
            nonce: window.wpPayFormsDashboard.nonce,
            subscription_id: subscriptionId
        }, payload));

        $error.text('');
        $btn.prop('disabled', true);

        // The try covers createPaymentMethod too. Stripe.js normally REPORTS failures as
        // {error} rather than throwing, but it can still reject — a network drop, or an
        // internal error. Outside the try, that rejection escapes this async handler and the
        // button stays disabled with no message: the modal is dead and the user has no idea why.
        try {
            const { paymentMethod, error } = await ctx.stripe.createPaymentMethod({
                type: 'card',
                card: ctx.card
            });

            if (error) {
                // Client-side card validation — no slot spent, but re-read anyway: one rule, no
                // exceptions to reason about, and another tab may have moved the count.
                endAttempt(error.message);
                return;
            }

            let res = await post({
                verification_status: 'verify',
                payment_method_id: paymentMethod.id
            });

            if (res?.data?.requires_action) {
                const confirmation = await ctx.stripe.confirmCardSetup(res.data.client_secret, {
                    payment_method: paymentMethod.id
                });

                if (confirmation.error) {
                    // 3DS failed. The 'verify' POST already spent a slot — the count moved.
                    endAttempt(confirmation.error.message);
                    return;
                }

                // Send only the SetupIntent id — the server derives the payment method from it.
                res = await post({
                    verification_status: 'verified',
                    setup_intent_id: res.data.setup_intent_id
                });
            }

            if (res?.success) {
                // Reload rather than patching the row: the server is the source of truth for
                // brand/last4 (persist can soft-fail), and a reload re-renders every row from it.
                location.reload();
                return;
            }

            // Defensive only. Every server-side failure — declines, throttle rejections, gate
            // refusals — goes through fail(), which returns 423/429/403/405; jQuery rejects any
            // non-2xx, so those land in the catch below, not here. This branch would only fire if
            // the endpoint ever returned a 2xx with success:false.
            endAttempt(res?.data?.message || t('Something went wrong. Please try again.', 'Something went wrong. Please try again.'));
        } catch (err) {
            // Two shapes land here: a jQuery rejection carrying our JSON error (declines, "Too
            // many card verification attempts", gate refusals), or a raw throw from Stripe.js.
            // The fallback matters — without it the button re-enables with an empty error slot,
            // which looks identical to "nothing happened".
            endAttempt(
                err?.responseJSON?.data?.message
                || t('Something went wrong. Please try again.', 'Something went wrong. Please try again.')
            );
        }
    });
});
