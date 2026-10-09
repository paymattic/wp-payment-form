import PayFormHandler from './FormHandler';

var wpPayformApp = {};
window.recaptchInstances = {};

(function ($) {
    wpPayformApp = {
        forms: {},
        general: window.wp_payform_general,
        formData: {},
        init() {
            let body = $(document.body);
            this.forms = $('.wpf_form');
            $.each(this.forms, function ($form) {
                let form = $(this);
                let formInstance = form.attr('wpf_form_instance');
                let formSettings = window['wp_payform_' + formInstance];
                let formId = form.attr('data-wpf_form_id');
                let formHandler = new PayFormHandler(form, formSettings);
                formHandler.initForm();

                body.trigger('wpPayFormProcessFormElements', [form, formSettings]);
                body.trigger('wp_payform_inited_'+ formInstance, [form, formSettings]);
                body.trigger('wp_payform_inited_'+ formId, [form, formSettings]);
            });

            // this.initDatePiker(); now we are initing datepicker on dateComponent
            this.initLightBox();
            this.initOther();
            this.loadReInitScript();
        },
        loadReInitScript() {
            $(document).on('wpf_reinit', function (e, formItem) {
                let form = $(formItem);
                let formInstance = form.attr('wpf_form_instance');
                if (!formInstance) {
                    return false;
                }
                let formSettings = window['wp_payform_' + formInstance];
                let formId = form.attr('data-wpf_form_id');
                let formHandler = new PayFormHandler(form, formSettings);
                formHandler.initForm();
            });
        },
        initLightBox() {
            if ($('.wpf_form .wpf_lightbox').length) {
                $('.wpf_form .wpf_lightbox').on('click', lity);
            }
        },
        // initDatePiker() {
        //     let dateFields = $('.wpf_form input.wpf_date_field');
        //     if (dateFields.length) {
        //         flatpickr.localize(window.wp_payform_general.date_i18n);
        //         dateFields.each(function (index, dateField) {
        //             let config = $(this).data('date_config');
        //             flatpickr(dateField, config);
        //         });
        //     }
        // },
        initOther() {
            $('.wpf_form input').on('keypress', function (e) {
                return e.which !== 13;
            });
            let $inputs = $('.wpf_form').find('input[data-required="yes"][data-type="input"],textarea[data-required="yes"],select[data-required="yes"]');
            $inputs.on('keypress blur', function (e) {
                if ($(this).val()) {
                    $(this).removeClass('wpf_has_error');
                }
            });

            // Enforce min/max on number fields when user types manually
            $('.wpf_form input[type="number"]').on('blur', function () {
                var $input = $(this);
                var val = $input.val();
                if (val === '') return;
                var num = parseFloat(val);
                if (isNaN(num)) return;
                var min = $input.attr('min');
                var max = $input.attr('max');
                var msg = '';
                if (min !== undefined && min !== '' && num < parseFloat(min)) {
                    $input.val(min).trigger('change');
                    msg = 'Minimum value is ' + min;
                } else if (max !== undefined && max !== '' && num > parseFloat(max)) {
                    $input.val(max).trigger('change');
                    msg = 'Maximum value is ' + max;
                }
                if (msg) {
                    var $hint = $('<span class="wpf_number_hint">' + msg + '</span>');
                    $hint.css({ color: '#e74c3c', fontSize: '12px', display: 'block', marginTop: '4px' });
                    $input.after($hint);
                    setTimeout(function () { $hint.fadeOut(300, function () { $hint.remove(); }); }, 2000);
                }
            });
        }
    };

    window.wpPayformAppLoaded = false;
    $(window).on('load', function () {
        if (!window.wpPayformAppLoaded) {
            wpPayformApp.init();
        }
        window.wpPayformAppLoaded = true;
    });

}(jQuery));

window.wpf_onload_recaptcha_callback = function () {
    jQuery(document).ready(function ($) {
        var $forms = $('.wpf_has_recaptcha');
        $.each($forms, (index, form) => {
            var $form = $(form);
            let formId = $form.attr('data-wpf_form_id');
            let key = $form.attr('data-recaptcha_site_key');
            var recaptchaVersion = $form.attr('data-recaptcha_version');
            if (recaptchaVersion == 'v2') {
                let recaptchaIstanceId = grecaptcha.render('wpf_recaptcha_' + formId, {
                    'sitekey': key
                });
                recaptchInstances['form_' + formId] = recaptchaIstanceId;
                $form.on('refresh_recaptcha', function () {
                    grecaptcha.reset(recaptchaIstanceId);
                });
            } else {
                grecaptcha.execute(key, { action: 'payform/' + formId }).then(function (token) {
                    $form.find('#wpf_recaptcha_' + formId).html('<input type="hidden" name="g-recaptcha-response" value="' + token + '" />')
                });
                $form.on('refresh_recaptcha', function () {
                    grecaptcha.execute(key, {action: 'payform/' + formId}).then(function (token) {
                        $form.find('#wpf_recaptcha_' + formId).html('<input type="hidden" name="g-recaptcha-response" value="' + token + '" />')
                    });
                });
            }
        });
    });
}