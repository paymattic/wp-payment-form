jQuery(document).ready(function($) {
    var deactivateButton = $('a[id="deactivate-wp-payment-form"]');
    const skipButton =  jQuery('#wpf-skip-deactivate');
    function openForm() {
        document.getElementById("wpf-feedback").style.display = "block";
    }
    function toggleErrorMessage(display = "block") {
        document.querySelector(".validation-message").style.display = display;
    }

    function closeForm() {
        document.getElementById("wpf-feedback").style.display = "none";
    }
    jQuery('#wpf-btn-close').on('click', function(e) {
        closeForm();
    });

    skipButton.attr('href', deactivateButton.attr('href'));

    skipButton.on('click', function(e) {
        e.preventDefault();
        const formData = {
            message: 'No feedback submitted!',
            others: [],
            nonce: 'nononce',
            better_plugin_name: '',
            feature_missing: ''
        }
        wpfFeedbackMakeAjaxRequest(JSON.stringify(formData));
    });

    deactivateButton.on('click', function(e) {
        e.preventDefault();
        openForm();
        jQuery('input[name="reason"]').on('change', function() {
            if (jQuery('input[name="reason"]:checked').length > 0) {
                toggleErrorMessage("none");
            }
            if(jQuery('#wpf_feature_missing').is(':checked')) {
                jQuery('.wpf_feature_missing').removeClass('wpf-hide');
            } else {
                jQuery('.wpf_feature_missing').addClass('wpf-hide');
            }
            if(jQuery('#wpf_better_plugin_name').is(':checked')) {
                jQuery('.wpf_better_plugin_name').removeClass('wpf-hide');
            } else {
                jQuery('.wpf_better_plugin_name').addClass('wpf-hide');
            }

            if(jQuery("#wpf_other_option").is(':checked')) {
                jQuery('.wpf_other_message').removeClass('wpf-hide');
            } else {
                jQuery('.wpf_other_message').addClass('wpf-hide');
            }
        });
        let wpfFeedbackForm = document.getElementById("wpf-feedback");
        wpfFeedbackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let description = document.getElementById("wpf-feedback-description").value.trim();
            let better_plugin_name = "";
            let feature_missing = "";
            let validationError = false;

            if(jQuery('#wpf_better_plugin_name').is(':checked')) {
                better_plugin_name = jQuery('input[name="wpf_better_plugin_name"]').val().trim();
                if (!better_plugin_name) {
                    alert("Please specify the name of the better plugin.");
                    validationError = true;
                }
            }
            if(jQuery('#wpf_feature_missing').is(':checked')) {
                feature_missing = jQuery('input[name="wpf_feature_missing"]').val().trim();
                if (!feature_missing) {
                    alert("Please specify the missing feature name.");
                    validationError = true;
                }
            }
            if(jQuery("#wpf_other_option").is(':checked') && !description) {
                alert("Please provide additional details in the message box.");
                validationError = true;
            }
            
            if (validationError) {
                return;
            }

            const reasons = document.getElementsByName('reason');
            const paymattic_deactivation_nonce = document.getElementsByName('paymattic_deactivation_nonce'); 
            const nonceVal = jQuery(paymattic_deactivation_nonce).attr('value');
            const values = [];
            for (let i = 0; i < reasons.length; i++) {
                if (reasons[i].checked) {
                    values.push(reasons[i].value);
                }
            }
            if (values.length === 0) {
                toggleErrorMessage();
                return;
            }

            const formData = {
                message: description,
                others: values,
                nonce: nonceVal,
                better_plugin_name,
                feature_missing
            }

            wpfFeedbackMakeAjaxRequest(JSON.stringify(formData));
        });
    });

    function wpfFeedbackMakeAjaxRequest(formData) {
        // deactivate submit btn
        jQuery('#wpf-feedback-submit').attr('disabled', true);
        jQuery('#wpf-feedback-submit').text('Submitting...');
        // deactivate skip btn
        jQuery('#wpf-skip-deactivate').attr('disabled', true).css('pointer-events', 'none').css('color', 'gray').on('click', function(e) {
            e.preventDefault();
        });
        jQuery.ajax({
            url: `https://demo.paymattic.com/?feedback-collector=yes&route=collect-feedback`,
            type: "POST",
            data: formData,
            success: function(data) {
                document.getElementById("wpf-feedback").style.display = "none";
                var redirectUrl = deactivateButton.attr('href');
                window.location.href = redirectUrl;
            },
            error: function(error) {
                document.getElementById("wpf-feedback").style.display = "none";
                var redirectUrl = deactivateButton.attr('href');
                window.location.href = redirectUrl;
            },
        })
    }
});