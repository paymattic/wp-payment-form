import validateData from './form_validation';
import resetMessages from './helpers';
class StepForm {

    step_form_handler(form, $formNoticeWrapper) {
        var base_color = "rgb(230,230,230)";
        var active_color = "#ff7518";
        var child = 1;
        var length = form.find(".wpf_step_section").length - 1;
        const $formWrapper = form.parent();
        // $formButton.on('click', function (e) {
        //     var id = jQuery(this).attr("id");
        //     console.log(id);
        // });
        $formWrapper.find("#wpf_step_prev").addClass("wpf_step_disabled");

        form.find(".wpf_step_section").not(".wpf_step_section:nth-of-type(1)").hide();
        form.find(".wpf_step_section").not(".wpf_step_section:nth-of-type(1)").css('transform', 'translateX(100px)');

        form.find('#wpf_svg_form_time rect').css('fill', base_color);
        form.find('#wpf_svg_form_time circle').css('fill', base_color);
        form.find("circle:nth-of-type(1)").css("fill", active_color);
        form.find(".step-form-item:nth-of-type(1)").addClass("active");
        let error = false;
        $formWrapper.find(".wpf_step_button").off('.wpfStep');
        form.find(".wpf-step-header-btn").off('.wpfStep');
        $formWrapper.find(".wpf_step_button").on('click.wpfStep', async function() {
            let formData = form.find(`#wpf_step_section_${child}`);
            await resetMessages(formData,$formNoticeWrapper);
            await validateData(formData, $formNoticeWrapper).
            then(function () {
                error = false;
            }).
            catch(function () {
                error = true;
            });
            var id = jQuery(this).attr("id");
            if (id == "wpf_step_next") {
                if (error) {
                    form.find(`.step-form-item:nth-of-type(${child})`).addClass("error");
                    return;
                } else {
                    form.find(`.step-form-item:nth-of-type(${child})`).removeClass("error"); 
                }
                $formWrapper.find("#wpf_step_prev").removeClass("wpf_step_disabled");
                if (child >= length) {
                    jQuery(this).addClass("wpf_step_disabled");
                    jQuery('#submit').removeClass("wpf_step_disabled");
                }
                if (child <= length) {
                    for (let i = 1; i <= child; i++) {
                        form.find(`.step-form-item:nth-of-type(${i})`).removeClass("active");
                        form.find(`.step-form-item:nth-of-type(${i+1})`).addClass("active");
                        form.find(`.step-form-item:nth-of-type(${i})`).addClass("success");
                    }
                    child++;
                }
            } else if (id == "wpf_step_prev") {
                await resetMessages(formData,$formNoticeWrapper);
                $formWrapper.find("#wpf_step_next").removeClass("wpf_step_disabled");
                form.find(`.step-form-item:nth-of-type(${child})`).removeClass("error");
                jQuery('#submit').addClass("wpf_step_disabled");
                if (child <= 2) {
                    jQuery(this).addClass("wpf_step_disabled");
                }
                form.find(`.step-form-item:nth-of-type(${child})`).removeClass("active");
                if (child > 1) {  
                    child--;
                    form.find(`.step-form-item:nth-of-type(${child})`).removeClass("success");
                }
                form.find(`.step-form-item:nth-of-type(${child})`).addClass("active");
            }
            
            jQuery([document.documentElement, document.body]).animate({
                scrollTop: jQuery("#wpf_svg_wrap").offset().top
            }, 1000);

            changeStepComponent();
        });

        form.find(".wpf-step-header-btn").on('click.wpfStep', async function() {
            let error = false;
            var id = jQuery(this).attr("id");
            child = id;
            let formData = form.find(`#wpf_step_section_${child - 1}`);
            await resetMessages(formData,$formNoticeWrapper);
            await validateData(formData, $formNoticeWrapper).
            then(function () {
                error = false;
            }).
            catch(function () {
                error = true;
            });
            if (error) {
                form.find(`.step-form-item:nth-of-type(${ child -1 })`).addClass("error");
                child = child - 1;
                return;
            } else {
                form.find(`.step-form-item:nth-of-type(${ child - 1 })`).removeClass("error"); 
            }
            if (child > 1) {
                $formWrapper.find("#wpf_step_prev").removeClass("wpf_step_disabled");
            }
            if (child == 1) {
                $formWrapper.find("#wpf_step_prev").addClass("wpf_step_disabled");
                $formWrapper.find("#wpf_step_next").removeClass("wpf_step_disabled");
                $formWrapper.find('#submit').addClass("wpf_step_disabled");
            } else if (child == length + 1 ) {
                $formWrapper.find("#wpf_step_next").addClass("wpf_step_disabled");
                form.find("#wpf_step_prev").removeClass("wpf_step_disabled");
                $formWrapper.find('#submit').removeClass("wpf_step_disabled");
            } else {
                $formWrapper.find("#wpf_step_next").removeClass("wpf_step_disabled");
                $formWrapper.find("#wpf_step_prev").removeClass("wpf_step_disabled");
                $formWrapper.find('#submit').addClass("wpf_step_disabled");
            }
            for (let i = 1; i <= length + 1; i++) {
                form.find(`.step-form-item:nth-of-type(${i})`).removeClass("active");
                form.find(`.step-form-item:nth-of-type(${i})`).removeClass("success");
            }
            for (let i = 1; i <= child; i++) {
                form.find(`.step-form-item:nth-of-type(${i-1})`).removeClass("active");
                form.find(`.step-form-item:nth-of-type(${i-1})`).addClass("success");
                form.find(`.step-form-item:nth-of-type(${i})`).addClass("active");
            }
            changeStepComponent() ;
        })

        function changeStepComponent() {
            var currentSection = form.find(".wpf_step_section:nth-of-type(" + child + ")");
            currentSection.fadeIn();
            currentSection.css('transform', 'translateX(0)');
            currentSection.prevAll('.wpf_step_section').css('transform', 'translateX(-100px)');
            currentSection.nextAll('.wpf_step_section').css('transform', 'translateX(100px)');
            form.find('.wpf_step_section').not(currentSection).hide();
        }

    }

}

export default StepForm;