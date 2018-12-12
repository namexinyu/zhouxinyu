let removeQueryParam = (hrefStr, param) => {
    let regStr = "/[\?|&]" + param + "=[a-zA-Z0-9%\.\_\-]*/g";
    let newReg = eval(regStr);
    if (typeof hrefStr !== 'string') {
        return false;
    }
    let paramStr = hrefStr.match(newReg);
    if (!paramStr) {
        return hrefStr;
    }
    let urlStr = paramStr[0].substring(1, paramStr[0].length);
    let resUrl = hrefStr.replace(urlStr, '').replace(/\&\&/g, '\&').replace(/\?\&/g, '\?').replace(/\&$/g, '').replace(/\?$/g, '');
    return resUrl;
};
export default removeQueryParam;