jQuery(document).ready(function ($) {
    let sortKey = $('.wpf-user').attr('data-orderby');
    let sortType = true;
    let searchText = '';
    let form_id = $('.wpf-user').attr('data-form_id');
    let template_id = $('.wpf-donor-card-wrapper').attr('data-template');
    let perPage = $('.wpf-user').attr('data-per-page');
    let loadData = parseInt(perPage);
    let timeOut = null;
    let nodonorImage = window.wp_payform_leader_board.no_donor_image;
    console.log('nodonorImage.......', nodonorImage);
    let showName = $('.wpf-template-wrapper').attr('data-show-name');

    let showAvatar = $('.wpf-template-wrapper').attr('data-show-avatar').replace(/\s/g, '');
    let showTotal = $('.wpf-template-wrapper').attr('data-show-total').replace(/\s/g, '');

    $('.wpf-search-input').keyup(function () {
        searchText = $(this).val();
        clearTimeout(timeOut);

        timeOut =
            setTimeout(() => {
                getDonationList(searchText, sortKey, sortType, loadData);
            }, 1000);

    });

    $('.wpf-load-more').click(function () {
        loadData = +loadData + +perPage;
        $(this).text('Loading...');
        getDonationList(searchText, sortKey, sortType, loadData);
    });

    $('.wpf-radio-button').click(function () {
        const sortKey = $(this).attr('data-sort-key');
        const sortType = $(this).attr('key_value');
        getDonationList(searchText, sortKey, sortType, loadData);
    });

    function getDonationList(searchText, sortKey, sortType, perPage) {
        $('.wpf-user').css('opacity', 0.4);
        $('.wpf-leaderboard-loader span').attr('class', 'loader show');
        jQuery.post(window.wp_payform_leader_board.ajax_url, {
            action: 'wpf_leader_board_render',
            nonce: window.wp_payform_leader_board.nonce,
            searchText: searchText,
            sortKey: sortKey,
            sortType: sortType,
            form_id: form_id,
            perPage: perPage
        }).then(function (response) {
            response.data.has_more_data ? $('.wpf-load-more').removeClass('disabled') : $('.wpf-load-more').addClass('disabled');
            if (template_id == 'template_3') {
                renderTemplateThree(response);
            } else {
                renderData(response);
            }
        }).fail(function (xhr) {
            var responseJson = xhr && xhr.responseJSON;
            var message = (responseJson && responseJson.data && responseJson.data.message)
                || (responseJson && responseJson.message)
                || 'Unable to load donors. Please refresh the page and try again.';
            var $error = $('.wpf-leaderboard-error');
            if (!$error.length) {
                $error = $('<div class="wpf-leaderboard-error" role="alert" style="color:#b32d2e;margin:10px 0;"></div>');
                $('.wpf-user').before($error);
            }
            $error.text(message);
        }).always(function () {
            $('.wpf-user').css('opacity', 1);
            $('.wpf-leaderboard-loader span').attr('class', 'loader hide');
            $('.wpf-load-more').text('Load More');
        });
    }

    function renderTemplateThree(response) {

        const parentUser = $('.wpf-user');
        parentUser.empty();
        const load_more = $('.wpf-leaderboard-load-more-wrapper')[0];
       
        if ( response.data.donars.length === 0 ) {
            const isNoDonorFoundElementExist = $('.wpf-no-donor-found').length;
            if (isNoDonorFoundElementExist) {
                return;
            }
            const user = 
                `
                <div class="wpf-no-donor-found">
                    <img src=" ${nodonorImage} " alt="No Donor Found" class="wpf-no-donor-found-image" style="width: 280px">
                    <p style="background: inherit; color: #000; size: 20px;">No donor found!</p>
                </div>
                `
            parentUser.append(user);
            load_more.style.display = 'none';
        }
        for (const [key, value] of Object.entries(response.data.donars)) {
            const user =
                `
                <div class="wpf-donor-list three">
                ${showAvatar == 'true' ? `
                    <div class="wpf-donor-image">
                        <img src="https://secure.gravatar.com/avatar/${value.customer_email}?s=96&amp;d=mm&amp;r=g" alt="User Avatar">
                    </div>
                ` : ''}
        
                <div class="wpf-donor-info">
                    ${showName == 'true' ? `
                        <div class="wpf-donor-name three">
                            <h3>${value.customer_name}</h3>
                        </div>
                    ` : ''}
        
                    ${showTotal === 'true' ? `
                        <div class="wpf-donor-amount three">
                            <p>Donation Amount</p>
                            <span>${value.currency}${value.grand_total}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
                `
            parentUser.append(user);
            load_more.style.display = 'block';
        }
    }

    function renderData(response) {
        const parentUser = $('.wpf-user');
        parentUser.empty();
        const load_more = $('.wpf-leaderboard-load-more-wrapper')[0];
        if ( response.data.donars.length === 0 ) {
            const isNoDonorFoundElementExist = $('.wpf-no-donor-found').length;
            if (isNoDonorFoundElementExist) {
                return;
            }
            const user = 
                `
                <div class="wpf-no-donor-found">
                    <img src=" ${nodonorImage} " alt="No Donor Found" class="wpf-no-donor-found-image" style="width: 280px">
                    <p style="background: inherit; color: #000; size: 20px;">No donor found!</p>
                </div>
                `
            parentUser.append(user);
            load_more.style.display = 'none';
        }
        let donarIndex = 0;
        
        for (const [key, value] of Object.entries(response.data.donars)) {
            console.log(value)
            const dateObject = value.created_at;
            const formattedDate = new Date(dateObject.date + dateObject.timezone)  
                .toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })  
                .replace(',', '');  

            const user =
                `<div class="wpf-user-row ${ form_id === '' ? 'wpf-all-forms-user' : ''}">
                    <div class="wpf-user-serial">
                        <span class="wpf-user-serial-text">${++donarIndex}</span>
                    </div>
                    
                    <div class="wpf-user-avatar-name">
                        ${showAvatar == 'true' ? `
                        <div class="wpf-user-avatar">
                            <img src="https://secure.gravatar.com/avatar/${value.customer_email}?s=96&amp;d=mm&amp;r=g" alt="User Avatar">
                        </div>
                        ` : ''}
                        ${showName == 'true' ? `
                        <div class="wpf-user-name">
                            <span class="wpf-user-name-text">${value.customer_name}</span>
                        </div>
                        ` : ''}
                    </div>

                    ${showName == 'true' ? `
                        <span class="wpf-user-name-text">
                            <span class="wpf-user-name-text">${formattedDate}</span>
                        </span>
                        ` : ''}
                    ${showName == 'true' ? `
                        ${form_id ? `
                            <span class="wpf-user-donations">${value.donations_count} Donations </span>
                        ` : ''}
                    ` : ''}

                    ${showName == 'true' ? `
                    <div class="wpf-user-amount">
                        <span class="wpf-user-amount">
                            <span class="wpf-text-currency">${value.currency}</span>
                            <span class="wpf-text-amount">${value.grand_total}</span>
                        </span>
                    </div>
                    ` : ''}
                </div>`;
            parentUser.append(user);
            load_more.style.display = 'block';
        }
    };
});