import App from "../../views/App";

const AppSetting = require('CONFIG/AppSetting');
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {browserHistory} from 'react-router';
import env from 'CONFIG/envs';
import QueryParam from 'UTIL/base/QueryParam';

import MD5 from 'UTIL/MD5';

let defaults = {
    method: 'GET',
    headers: {
        // 'content-type': 'application/json'
    },
    ignoreAuthorization: false
};
let getToDoObj = function (todo) {
    if (typeof todo === 'undefined') {
        return {
            successDo: (res) => {
                return res;
            },
            errorDo: (res) => {
                return res;
            }
        };
    }
    if (typeof todo === 'function') {
        return {
            successDo: todo,
            errorDo: todo
        };
    }
    if (typeof todo === 'object') {
        return {
            successDo: todo.successDo,
            errorDo: todo.errorDo
        };
    }
};
let goToLogin = (extraParam, noReturn) => {
    let url = env.mams_url + '/login/index';
    if (noReturn) {
        window.location.href = url;
    } else {
        window.location.href = QueryParam.setQueryParam(url, Object.assign({
            r: window.location.href
        }, (extraParam || {})));
    }
};

function requestStatus(code) {
    if (code === 0 || code === '0') {
        return 'SUCCESS';
    }
    if (code === 900000 || code === '900000') {
        // TODO tips friendly.
        return 'UNKNOW_ERROR';
    }
    if (code === 900001 || code === '900001' || code === 900002 || code === '900002' || code === 900003 || code === '900003' || code === 900004 || code === '900004') {
        // TODO go to login
        return 'FAILED_AUTHORIZATION';
    }
    // other errors will reject to page.
    return false;
}

const throttlePool = {};
let throttleCheck = (apiUrl) => {
    const nowTmp = new Date().getTime();
    const lastTmp = throttlePool[apiUrl];
    // console.log(throttlePool[apiUrl], nowTmp - lastTmp);
    if (nowTmp - lastTmp < 500) {
        return false;
    }
    throttlePool[apiUrl] = nowTmp;
    return true;
};
const emptyObj = {error: 'badRequest'};
emptyObj.then = () => ({Data: null});

let doRequest = (url, options, todoObj) => {
    if (throttleCheck(url) == false) return emptyObj;
    let promise = new Promise((resolve, reject) => {
        delete options.headers.Authorization;
        fetch(url, options).then(
            (response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        let status = requestStatus(data.Code);
                        if (status === 'FAILED_AUTHORIZATION') {
                            goToLogin();
                        }
                        if (status === 'SUCCESS') {
                            resolve(todoObj.successDo(data));
                        }
                        if (status === false) {
                            console.log('error data', todoObj, data);
                            reject(todoObj.errorDo(data));
                        }
                    }, () => {
                        console.log('error');
                        // to json error
                        // friendly tips
                    });
                } else {
                    console.log('error');
                    reject(todoObj.errorDo({
                        Code: '777701',
                        Desc: response.status
                    }));
                    // http status is not 200.
                    // TODO friendly tips
                }
            },
            () => {
                reject(todoObj.errorDo({
                    Code: '777702',
                    Desc: 'Error'
                }));
                console.log('error');
                // request error
                // TODO friendly tips
            }
        ).catch(() => {
            console.log('error');
            // fetch error
            // TODO friendly tips
        });
    });
    return promise;
};

function trimp(param) {
    let type = typeof param;
    if (type === 'string') {
        let p_trim = param.trim();
        // 临时代码 全角替换半角 start
        const len = p_trim.length;
        if ((len === 11 || len === 16 || len === 18 || len === 19)
            && p_trim.match(/[\uff00-\uffff]/)) {
            let p_trim_arr = p_trim.split('');
            let p_trim_res = '';
            for (const ch of p_trim_arr) {
                const ch_code = ch.charCodeAt();
                if (ch_code > 65280 && ch_code < 65375) {
                    p_trim_res += String.fromCharCode(ch_code - 65248);
                } else {
                    p_trim_res += ch;
                }
            }
            // console.log('全角转化', p_trim, p_trim_res);
            p_trim = p_trim_res;
        }
        // 临时代码 全角替换半角 end
        return p_trim;
    } else if (type === 'object' || type === 'array') {
        for (let key in param) {
            param[key] = trimp(param[key]);
        }
        return param;
    } else {
        return param;
    }
}

function translatePostData(params, opts) {
    let token = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('token') || '';
    let employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '';
    let accountList = JSON.parse(AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountList') || '[]');
    if (!token || !employeeId || !accountList || !accountList.length) {
        goToLogin();
        return false;
    }
    let p = trimp(params) || {};
    // if (!opts.EmployeeMapID) {
    //     p.EmployeeMapID = accountList;
    // }
    let dataStr = JSON.stringify(p);
    let nowTmp = Math.round((new Date()).getTime() / 1000);

    return {
        AppVer: AppSetting.AppVersion,
        TimeStamp: nowTmp,
        Lang: 'CN',
        DeviceName: window.navigator.userAgent,
        DeviceType: 'web',
        Token: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('token'),
        AppKey: AppSetting.AppKey,
        Sign: getSign(dataStr, nowTmp.toString()),
        Data: dataStr,
        Uid: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId')
    };
}

function getSign(dataStr, TimeStampStr) {
    if (typeof dataStr !== 'string' || typeof TimeStampStr !== 'string') {
        throw Error('Arguments type must be string. dataStr & timeStampStrt');
    }
    let AppKey = AppSetting.AppKey.toString();
    let AppSecret = AppSetting.AppSecret.toString();
    return MD5(AppKey + TimeStampStr + dataStr + AppSecret, 32);
}

let HttpRequest = {
    post: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'POST';
        if (!options.body) {
            options.body = JSON.stringify(translatePostData(requestObj.params, options));
        }
        let url = requestObj.url;
        return doRequest(url, options, getToDoObj(todo));
    },
    put: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'PUT';
        if (!options.body) {
            options.body = JSON.stringify(requestObj.params);
        }
        let url = requestObj.url;
        return doRequest(url, options, getToDoObj(todo));
    },
    get: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'GET';
        let url = requestObj.url;
        let keys = Object.keys(requestObj.params);
        for (var i = 0; i < keys.length; i++) {
            let currentKey = keys[i];
            if (i === 0 && url.indexOf('?') != -1) {
                url = url + '&' + currentKey + '=' + requestObj.params[currentKey];
            } else {
                url = url + (i === 0 ? '?' : '&') + currentKey + '=' + requestObj.params[currentKey];
            }
        }
        return doRequest(url, options, getToDoObj(todo));
    },
    delete: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'DELETE';
        if (!options.body) {
            options.body = JSON.stringify(requestObj.params);
        }
        let url = requestObj.url;
        return doRequest(url, options, getToDoObj(todo));
    }
};
export default HttpRequest;
export {goToLogin};
