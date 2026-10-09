jQuery(document).ready(function ($) {
    translateMenuItems($);
    tabRender($);
    modalToggle($)
    syncSubscriptionData($)
    cancelSubscription($)
    paymentStatusFilter($)
    subscriptionStatusFilter($)
    initEmptyStates($)
    mobileMenuToggle($)
})

function mobileMenuToggle($) {
    const $toggle = $('#wpf-mobile-menu-toggle');
    const $menu = $('#wpf-sidebar-menu');

    $toggle.on('click', function () {
        const isOpen = $menu.hasClass('open');
        $menu.toggleClass('open', !isOpen);
        $toggle.toggleClass('open', !isOpen);
        $toggle.attr('aria-expanded', String(!isOpen));
    });

    // Close menu when a menu item is clicked on mobile
    $menu.on('click', '.wpf-menu-item', function () {
        if (window.innerWidth <= 768) {
            $menu.removeClass('open');
            $toggle.removeClass('open');
            $toggle.attr('aria-expanded', 'false');
        }
    });
}

function initEmptyStates($) {
    // Submissions table
    const submissionRows = $('.wpf-submission-table:not(:has(.wpf-subscription-filter-wrap)) .wpf-user-dashboard-table__rows');
    const visibleSubmissions = submissionRows.find('.wpf-user-dashboard-table__row').length;
    submissionRows.find('.wpf-table-empty-state').css('display', visibleSubmissions === 0 ? 'flex' : 'none');

    // Subscription table
    const subscriptionRows = $('.wpf-subscription-rows');
    const visibleSubscriptions = subscriptionRows.find('.wpf-user-dashboard-table__row').length;
    subscriptionRows.find('.wpf-table-empty-state').css('display', visibleSubscriptions === 0 ? 'flex' : 'none');
}

function translateMenuItems($) {
    $('.wpf-menu-name[data-translate]').each(function() {
        const key = $(this).data('translate');
        const translated = window.wpPayFormsDashboard?.i18n?.[key] || key;
        $(this).text(translated);
    });
}

function cancelSubscription($) {
    $('.wpf-confirm-subscription-cancel').click(function () {
        let submissionHash = $(this).data('submission_hash');
        let formId = $(this).data('form_id');
        let subscription_id = $(this).data('subscription_id');
        $('.wpf-user-dashboard-table').addClass('loading');
        $('.wpf-user-dashboard-loader').addClass('loading');
        const ajax_url = window.wpPayFormsDashboard.ajaxurl;
        jQuery.post(ajax_url, {
            action: 'wpf_cancel_subscription',
            route: 'validate',
            nonce: window.wpPayFormsDashboard.nonce,
            form_id: formId,
            submission_hash: submissionHash,
            subscription_id: subscription_id
        }).then((res) => {
            $('.wpf-user-dashboard-table').removeClass('loading');
            $('.wpf-user-dashboard-loader').removeClass('loading');
            location.reload();
        })
        .fail((err) => {
            if (!err?.responseJSON?.success) {
                window.alert(err?.responseJSON?.data?.message);
            }
            $('.wpf-user-dashboard-table').removeClass('loading');
            $('.wpf-user-dashboard-loader').removeClass('loading');
        })
    })
}

function syncSubscriptionData($) {
    $('.wpf-sync-subscription-btn').click(function () {
        let submissionHash = $(this).data('submission_hash');
        let formId = $(this).data('form_id');

        $('.wpf-user-dashboard-table').addClass('loading');
        $('.wpf-user-dashboard-loader').addClass('loading');

        const ajax_url = window.wpPayFormsDashboard.ajaxurl;
        jQuery.post(ajax_url, {
            action: 'wpf_sync_subscription',
            route: 'validate',
            nonce: window.wpPayFormsDashboard.nonce,
            form_id: formId,
            submission_hash: submissionHash,
        }).then((res) => {
            $('.wpf-user-dashboard-table').removeClass('loading');
            $('.wpf-user-dashboard-loader').removeClass('loading');
            location.reload();
        }).fail((err) => {
            if (!err?.responseJSON?.success) {
                window.alert(err?.responseJSON?.data?.message);
            }
            $('.wpf-user-dashboard-table').removeClass('loading');
            $('.wpf-user-dashboard-loader').removeClass('loading');
        })
    })
}

function modalToggle($) {
    let modal = "";
    $('.wpf-cancel-subscription-btn').click(function () {
        let classList = $(this).next('.wpf-cancel-confirm-button').attr('class')
        if (classList.includes('active')) {
            $('.wpf-cancel-confirm-button').removeClass('active');
        } else {
            $('.wpf-cancel-confirm-button').removeClass('active');
            $(this).next('.wpf-cancel-confirm-button').addClass('active');
        }
    });

    $('.wpf-cancel-confirm-button').click(function () {
        $('.wpf-cancel-confirm-button').removeClass('active');
    });

    $(".wpf_toal_amount_btn, .wpf-cancel-confirm-button").click(function () {
        let modalId = $(this).data('modal_id');
        $("body").css({ "overflow": "hidden" });
        console.log(modalId)
        modal = $(`#${modalId}`);
        modal.css("display", "block");
    })

    var span = $(".wpf-close, .wpf-cancel");
    span.click(function () {
        modal.css("display", "none");
        $("body").css({ "overflow": "visible" });
    });

    $(window).click(function (event) {
        if (event.target == modal[0]) {
            modal.css("display", "none");
            $("body").css({ "overflow": "visible" });
        }
    });

    // $(window).click(function (event) {
    //     $('.wpf-cancel-confirm-button').removeClass('active');
    // });
}

function paymentStatusFilter($) {
    const $select = $('#wpf-payment-status-select');

    // Toggle dropdown open/close
    $select.find('.wpf-custom-select__trigger').on('click', function (e) {
        e.stopPropagation();
        const isOpen = $select.hasClass('open');
        $select.toggleClass('open', !isOpen);
        $(this).attr('aria-expanded', String(!isOpen));
    });

    // Close on outside click
    $(document).on('click.wpf-payment-filter', function () {
        $select.removeClass('open');
        $select.find('.wpf-custom-select__trigger').attr('aria-expanded', 'false');
    });

    // Option selection — navigate to URL so backend applies the filter with
    // correct pagination counts instead of hiding rows on the current page only.
    $select.find('.wpf-custom-select__item').on('click', function (e) {
        e.stopPropagation();
        const filter = $(this).attr('data-filter');
        const url = new URL(window.location.href);
        if (filter === 'all') {
            url.searchParams.delete('wpf_status');
        } else {
            url.searchParams.set('wpf_status', filter);
        }
        url.searchParams.delete('wpf_page'); // reset to page 1
        window.location.href = url.toString();
    });
}

function subscriptionStatusFilter($) {
    const $select = $('#wpf-subscription-status-select');

    // Toggle dropdown open/close
    $select.find('.wpf-custom-select__trigger').on('click', function (e) {
        e.stopPropagation();
        const isOpen = $select.hasClass('open');
        $select.toggleClass('open', !isOpen);
        $(this).attr('aria-expanded', String(!isOpen));
    });

    // Close on outside click
    $(document).on('click.wpf-subscription-filter', function () {
        $select.removeClass('open');
        $select.find('.wpf-custom-select__trigger').attr('aria-expanded', 'false');
    });

    // Option selection
    $select.find('.wpf-custom-select__item').on('click', function (e) {
        e.stopPropagation();
        const filter = $(this).attr('data-filter');
        const label = $(this).find('span').text();

        $select.find('.wpf-custom-select__label').text(label);
        $select.find('.wpf-custom-select__item').removeClass('active').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');
        $select.removeClass('open');
        $select.find('.wpf-custom-select__trigger').attr('aria-expanded', 'false');

        const container = $('.wpf-subscription-rows');
        const rows = container.find('.wpf-user-dashboard-table__row');
        let visibleCount = 0;

        rows.each(function () {
            const status = $(this).attr('data-subscription-status');
            const visible = filter === 'all' || status === filter;
            $(this).css('display', visible ? '' : 'none');
            if (visible) visibleCount++;
        });

        const subEmptyState = container.find('.wpf-table-empty-state');
        if (visibleCount === 0) {
            const msg = filter === 'all'
                ? (window.wpPayFormsDashboard?.i18n?.no_subscriptions || 'You have no subscriptions yet.')
                : (window.wpPayFormsDashboard?.i18n?.no_subscriptions_filter || 'No subscriptions found for the selected filter.');
            subEmptyState.find('.wpf-empty-state-msg').text(msg);
            subEmptyState.css('display', 'flex');
        } else {
            subEmptyState.css('display', 'none');
        }
    });
}

function tabRender($) {
    var activeTab = localStorage.getItem('activeTab');
    // Set the default active tab if none is stored
    if (!activeTab) {
        activeTab = $('.wpf-menu-item:first').attr('id');
    }

    // Set the initial active tab and content
    $('#' + activeTab).addClass('active');
    $('#content-' + activeTab).addClass('active');

    $('.wpf-menu-item').click(function () {
        $('.wpf-menu-item').each((menuIndex, menuItem) => {
            $(menuItem).removeClass('active');
        })

        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        let activeId = $(this).attr('id');

        $('.wpf-content').each((contentIndex, contentItem) => {
            if ($(contentItem).attr('id') == 'content-' + activeId) {
                $(contentItem).addClass('active');
            } else {
                $(contentItem).removeClass('active');
            }
        })

        // Store the active tab in local storage
        localStorage.setItem('activeTab', activeId);
    });
}