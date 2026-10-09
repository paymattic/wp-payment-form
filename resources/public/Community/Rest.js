const request = function(method, route, data = {}) {
    const url = `${window.wpPayFormsDashboard.rest.url}/${route}`;
    const headers = {'X-WP-Nonce': window.wpPayFormsDashboard.rest.nonce};

    if (['PUT', 'PATCH', 'DELETE'].indexOf(method.toUpperCase()) !== -1) {
        headers['X-HTTP-Method-Override'] = method;
        method = 'POST';
    }

    if (method !== 'GET' && method !== 'UPLOAD') {
        data = JSON.stringify(data);
    }

    if (method === 'UPLOAD') {
        return window.jQuery.ajax({
            url: url,
            type: "POST",
            data: data,
            contentType: false,
            cache: false,
            processData: false
        });
    }

    return window.jQuery.ajax({
        url: url,
        type: method,
        data: data,
        headers: headers,
        contentType: 'application/json'
    });
}

export default {
    $get(route, data = {}) {
        return request('GET', route, data);
        // window.jQuery.get();
    },
    $post(route, data = {}) {
        return request('POST', route, data);
    },

    // $get(options = {}) {
    //     console.log('options', options, 'ajaxurl', window.wpPayFormsDashboard.ajaxurl);
    //     return window.jQuery.get(window.wpPayFormsDashboard.ajaxurl, options);
    // },
    // $post(options = {}) {
    //     return window.jQuery.post(window.wpPayFormsDashboard.ajaxurl, options);
    // }
}

jQuery(document).ajaxSuccess((event, xhr, settings) => {
    const nonce = xhr.getResponseHeader('X-WP-Nonce');
    if (nonce) {
        window.wpPayFormsDashboard.rest.nonce = nonce;
    }
});