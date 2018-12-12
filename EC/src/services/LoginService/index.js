import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};
let LoginService = {
    getVerifyCode: (params) => {
        return HttpRequest.post({
            url: API_URL + '/CM_WorkbenchLogin/WD_COMM_AskVCode',
            params: params || {}
        }, baseToDo, {ignoreToken: true});
    },
    login: (params) => {
        return HttpRequest.post({
            url: API_URL + '/CM_WorkbenchLogin/WD_COMM_WorkbenchLogin',
            params: params || {}
        }, baseToDo, {ignoreToken: true});
    },
    GetEmpHubList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Home/WD_EHOM_GetEmpHubList',
            params: params || {}
        }, baseToDo);
    }
};
export default LoginService;