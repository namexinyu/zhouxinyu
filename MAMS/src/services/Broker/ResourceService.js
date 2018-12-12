import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let ResourceService = {
    // 取分配后无联系记录 需要Token
    GetNoHandleList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_GetNoHandleList', params
        }, baseToDo);
    },
    // 取已处理记录 需要Token
    getHandledList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_GetHandledList', params
        }, baseToDo);
    },
    // 取可申请资源数 需要Token
    getAvaCount: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_GetAvaCount', params
        }, baseToDo);
    },
    // 申请资源 需要Token
    resourceApply: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_ResourceApply', params
        }, baseToDo);
    }
};

export default ResourceService;