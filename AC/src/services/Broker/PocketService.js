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

let PocketService = {
    getLatestPocketCase: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_GetUserLatestRecruitBasic',
            params: params
        }, baseToDo);
    },
    updatePocketCase: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_UpdateUserRecruitBasic',
            params: params
        }, baseToDo);
    },
    setPocketCase: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_GenerateRecruitBasicItem',
            params: params
        }, baseToDo);
    },
    setEstimatePick: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_SetPrePick',
            params: params
        }, baseToDo);
    },
    // 添加报名记录
    insertMemberEnrollRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitSrv/WD_JJZX_InsertRecruit',
            params: params || {}
        }, baseToDo);
    },
    // 修改报名记录
    updateMemberEnrollRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitSrv/WD_JJZX_ModifyRecruit',
            params: params || {}
        }, baseToDo);
    }
};
export default PocketService;
