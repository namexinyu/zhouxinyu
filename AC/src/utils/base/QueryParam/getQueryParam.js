let getQueryParam = (hrefStr, param) => {
    let regStr = "/[\?|&]" + param + "=[a-zA-Z0-9%\.\_\-]*/g";
    let newReg = eval(regStr);
    if (typeof hrefStr !== 'string') {
        return false;
    }
    let paramStr = hrefStr.match(newReg);
    if (!paramStr) {
        return '';
    }
    let array = paramStr[0].split('=');
    return decodeURIComponent(array[array.length - 1]);
};
export default getQueryParam;