jQuery(document).ready(function($) {
    
    $(".wpf_tabular_multiple_option").map(function() {
        let selectedClass = $(this).attr('id');
        let selectedValue = $(`#${selectedClass}`).find(":selected").val();
        $(`.${selectedClass}`).val(selectedValue);
    }).get();

    $(document).on('click', '.wpf-product-checkbox_input, .wpf-product-checkbox', function() {
        let currentCheckbox = $(this).hasClass('wpf-product-checkbox_input') 
                            ? $(this)
                            : $(this).siblings('.wpf-product-checkbox_input');
        let is_checked;
        if(!$(this).hasClass('wpf-product-checkbox_input')){
            is_checked = currentCheckbox.prop("checked", currentCheckbox.prop("checked"));
        } else {
            is_checked = currentCheckbox.prop("checked");
        }
        
        let minimumValue = currentCheckbox.parent().find('.wpf_tabular_qty').attr('mini');
        let val = currentCheckbox.parent().find('.wpf_tabular_qty').val();
        let defValue = currentCheckbox.parent().find('.wpf_tabular_qty').attr('def');
        defValue = Math.max(defValue, minimumValue, val);
    
        if (is_checked) {
            currentCheckbox.parent().find('.wpf_tabular_qty').val(defValue).attr('min', minimumValue);
        } else {
            currentCheckbox.parent().find('.wpf_tabular_qty').val(defValue).attr('min', 0);
        }
        if(!$(this).hasClass('wpf-product-checkbox_input')){  
            currentCheckbox.trigger('change');  
        }  
    });
    
    $(document).on('change', '.wpf_tabular_multiple_option', function() {
        let inputClassName = `.${$(this).attr('id')}`;
        let inputValue = $(this).val();
        $(inputClassName).val(inputValue)
    })
    $(document).on('click', '.wpf-product-image', function() {
        showSlides(1, $(this).attr('id'));
        $(this).parent().removeClass('is-show-popup');
        $(this).parent().addClass('active');
        $('body').css({
            'overflow': 'hidden'
        })
    })
    $(document).on('click', '.close-dialog', function() {
        $('.wpf-product-cards-wrap .wpf-product-card.is-slider').addClass('is-show-popup');
        $('.wpf-product-cards-wrap .wpf-product-card.is-slider').removeClass('active');
        $('body').css({
            'overflow': 'inherit'
        })
    })

    //carousal event handler
    $(document).on('click', '.slideshow-container .slideshow-trigger', function() {
        plusSlides($(this).data('action'), $(this).data('product_id'));
    });

    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n, id) {
        showSlides(slideIndex += n, id);
    }

    function showSlides(n, id = "wpf_slide_tabular_products0") {
        let i;
        slideIndex = n;
        let slides = document.getElementsByClassName(id);
        if (n > slides.length) {
            slideIndex = 1
        }
        if (n < 1) {
            slideIndex = slides.length
        }
        if (slides?.length > 0) {
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[slideIndex - 1].style.display = "block";
        }
    }

    function showErrorMessage ($searchAbleProduct, wpf_empty_message_wrapper) {
        if ( $searchAbleProduct === 0 ) {
            jQuery(wpf_empty_message_wrapper).removeClass( 'hide' );
        } else {
            jQuery(wpf_empty_message_wrapper).addClass( 'hide' );
        }
    }
    // Product filter by categories start 
    let forms = $('.wpf_form');
    jQuery.each(forms, function (index, form) {
        $(form).find("div#wpf_tabular_items").each(function (index, product) {
            let productId = $(product).attr('tabular_item_id');
            let search_input = '.wpf_tab_search_input_' + productId;
            var productWrapper = '.wpf_tab_product_title_' + productId;
            var productContainer = '.wpf_container_' + productId;
            var productFilter = '.wpf_filter_input_' + productId;
            var productSort = '.wpf_sort_input_' + productId;
            let wpf_empty_message_wrapper = '.wpf_empty_message_wrapper_' + productId + ' img';

            // search product
            jQuery(search_input).on( 'keyup', function() {
                var $searchString = jQuery(this).val()?.toLowerCase();
                let title = '.wpf_tab_product_title_' + productId + '[data-wpf_tabular_name*="' + $searchString + '"]';
                var $searchAbleProduct = jQuery(title);
                if ( $searchString == '' ) {
                    jQuery(productWrapper).removeClass( 'wpf-search-hidden' );
                    showErrorMessage(1, wpf_empty_message_wrapper);   
                } 
                else {
                    jQuery(productWrapper).addClass( 'wpf-search-hidden' );
                    $searchAbleProduct.removeClass( 'wpf-search-hidden' );
                    showErrorMessage($searchAbleProduct?.length, wpf_empty_message_wrapper);
                }
            });
            // filter product
            jQuery(productFilter).on( 'change', function() {
                var $selectedCategory = jQuery(this).find(":selected").val();
                let filter = '.wpf_tab_product_title_' + productId + '[data-wpf_tabular_category*="' + $selectedCategory + '"]';
                var $filterAbleProduct = jQuery(filter);
                if ( $selectedCategory == 'all' ) {
                    jQuery(productWrapper).removeClass( 'wpf-is-hidden' );
                    showErrorMessage(1, wpf_empty_message_wrapper);   
                } 
                else {
                    jQuery(productWrapper).addClass( 'wpf-is-hidden' );
                    $filterAbleProduct.removeClass( 'wpf-is-hidden' );
                    showErrorMessage($filterAbleProduct?.length,wpf_empty_message_wrapper);
                }
            });
            // Sort product
            // Product Sort start
            jQuery(productSort).on( 'change', function() { 
                var sortBy = jQuery(this).find(":selected").val();
                var rows = [];
                jQuery(productWrapper).each(function (index, row) {
                    rows.push(jQuery(row).detach());
                });
                rows.sort(function (a, b) {
                    var aValue = '',
                        bValue = '';
                    if (sortBy === 'name_desce' || sortBy === 'name_asce') {
                        aValue = jQuery(a).find('.wpf-product-title').text();
                        bValue = jQuery(b).find('.wpf-product-title').text();
                    } else {
                        aValue = parseFloat(jQuery(a).find('.wpf-product-price').data('value')) || 0;
                        bValue = parseFloat(jQuery(b).find('.wpf-product-price').data('value')) || 0;
                    }
                    if (sortBy === 'price_desce' || sortBy === 'name_desce') {
                        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                    } else {
                        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                    }
                });
                jQuery.each(rows, function (index, row) {
                    jQuery(productContainer).append(row);
                });
            });
        });
    });
});