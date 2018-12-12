import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;


let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};

let getEventService = {
    getEventEntry: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_AddEvent',
            params: params
        }, baseToDo);
    },
    getEventquery: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_COM_QueryEventList',
            params: params
        }, baseToDo);
    },
    // 获取事件详情
    getEventdetail: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_COM_QueryEvent',
            params: params
        }, baseToDo);
    },
    // 获取事件处理主管名称
    getManagerName: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_COM_GetManagerName',
            params: params
        }, baseToDo);
    },
    // 申请找主管
    applyUpManager: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_ApplyUpEvent',
            params: params
        }, baseToDo);
    },
    // 结案
    endingEvent: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_EndEvent',
            params: params
        }, baseToDo);
    },
    // 申请找体验官（告御状）
    applyJudge: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_ApplyJudge',
            params: params
        }, baseToDo);
    },
    // 回复
    replyEvent: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_ReplyEvent',
            params: params
        }, baseToDo);
    },
    // 评价
    ratingEvent: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_ChoseEndPoint',
            params: params
        }, baseToDo);
    },
    getEventEntryForExp: (params) => {// 体验官事件录入
        return HttpRequest.post({
            url: API_URL + '/BK_Event/BK_JJZX_AddEvent2TYG',
            params: params
        }, baseToDo);
    }
};
export default getEventService;