let setQueryParam = (baseUrl, paramObj) => {
    let url = baseUrl;
    let keys = Object.keys(paramObj);
    for (var i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        if (i === 0 && url.indexOf('?') != -1) {
            url = url + '&' + currentKey + '=' + encodeURIComponent(paramObj[currentKey]);
        } else {
            url = url + (i === 0 ? '?' : '&') + currentKey + '=' + encodeURIComponent(paramObj[currentKey]);
        }
    }
    return url;
};
export default setQueryParam;