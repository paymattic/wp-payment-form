const resetMessages = (form, $formNoticeWrapper) => {
    form?.removeClass('wpf_form_has_errors');
    form?.parent().find('.wpf_form_restrictuon_errors').remove();
    $formNoticeWrapper?.removeClass('wpf_form_notice_error wpf_form_notice_success wpf_form_notice_info')
    $formNoticeWrapper?.html('').hide();
}


export default resetMessages;