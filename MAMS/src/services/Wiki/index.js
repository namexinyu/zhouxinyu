import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
        return res;
    }
};
let LoginService = {
    GetCategories: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/wiki/GetCategories',
            params: params || {}
        }, baseToDo);
    },
    GetTopSearch: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/wiki/GetTopSearch',
            params: params || {}
        }, baseToDo, {needThrottleCheck: false});
    },
    GetQryDoc: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/wiki/QryDoc',
            params: params || {}
        }, baseToDo);
    },
    GetDocList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/wiki/GetDocList',
            params: params || {}
        }, baseToDo);
    },
    GetHotArticle: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/wiki/GetHotArticle',
            params: params || {}
        }, baseToDo);
    },
    getDocDetail: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/wiki/GetDoc',
            params: params || {}
        }, baseToDo);
    }
};
export default LoginService;