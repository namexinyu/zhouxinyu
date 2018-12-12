import {HttpRequest, env} from 'mams-com';
import { fn } from 'moment';

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};

// 企业详情
export function getEntInfo(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntManager/BZ_EntManager_GetEntInfo',
        params: params
    });
}

export function editEnt(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntManager/BZ_EntManager_EditEnt',
        params: params
    });
}

export function editEntAll(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntManager/BZ_EntManager_EditEntAll',
        params: params
    });
}

export function newEnt(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntManager/BZ_EntManager_EditEntNew',
        params: params
    });
}

export function getEntTmpInfo(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntManager/BZ_EntManager_GetEntTmpInfo',
        params: params
    });
}

export function checkEnt(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntCheck/BZ_Ent_CheckEnt',
        params: params
    });
}

// 设置企业（企业）显示状态
export function setEntStatus(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_EntManager/BZ_EntManager_SetEntStatus',
        params: params || {}
    }, baseToDo);
}

export default {
    // 企业列表
    getEntList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_EntManager/BZ_EntManager_GetEntList',
            params: params
        }, baseToDo);
    },
    // 企业审核列表
    getCheckList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_EntCheck/BZ_Ent_GetCheckList',
            params: params
        }, baseToDo);
    }
};