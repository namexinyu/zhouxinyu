import {HttpRequest, env} from 'mams-com';

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};

// 获取UGC当前最新值
export function getUGCCurrentInfo(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_UserGeneratedContent/BZ_UGC_GetCurrentInfo',
        params: params || {}
    }, baseToDo);
}

// UGC审核
export function updateUGCInfo(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_UserGeneratedContent/BZ_UGC_UpdateInfo',
        params: params || {}
    }, baseToDo);
}

export default {
    // UGC列表
    getUGCList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserGeneratedContent/BZ_UGC_GetList',
            params: params
        }, baseToDo);
    }
};