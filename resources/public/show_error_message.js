import resetMessages from './helpers';
const showMessages = (messages, type, heading, form, $formNoticeWrapper) => {
    resetMessages(form, $formNoticeWrapper);

    let html = '';
    if (heading) {
        html += '<p class="wpf_alert_heading">' + heading + '</p>';
    }

    if (typeof messages == 'string' && messages) {
        html += messages;
    }

    if (typeof messages == 'object' && messages) {
        html += '<ul class="wpf_alert_ietms">';
        jQuery.each(messages, (index, message) => {
            html += '<li>' + message + '</li>';
        });
        html += '</ul>';
    }
    if (html) {
        $formNoticeWrapper?.addClass('wpf_form_notice_' + type);
        $formNoticeWrapper?.html(html).show();
        if (type == 'error') {
            form?.parent().addClass('wpf_form_has_errors');
        }
    }
}

export default showMessages;