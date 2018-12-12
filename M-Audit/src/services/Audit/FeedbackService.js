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

let CallbackService = {
    // 获取400反馈列表
    getFeedbackList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_DHFK_GetList',
            params: params
        }, baseToDo);
    },
    // 导出反馈列表
    exportFeedbackList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_EXCEL_PhoneFeedbackList',
            params: params
        }, baseToDo);
    },
    // 获取反馈详情
    getFeedbackDetail: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_DHFK_GetOneInfo',
            params: params
        }, baseToDo);
    },
    // 录入反馈信息
    addFeedbackInfo: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_DHFK_AddData',
            params: params
        }, baseToDo);
    },
    // 手机号查会员
    getUserInfoByMobile: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_DHFK_FindUserInfoByMobile',
            params: params
        }, baseToDo);
    },
    // 更新反馈数据
    updateFeedbackInfo: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_DHFK_ModifyData',
            params: params
        }, baseToDo);
    }

};
export default CallbackService;