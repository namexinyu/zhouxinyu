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
let InterviewNameListService = {
    // 面试名单列表
    getInterviewList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_InterviewList',
            params: params
        }, baseToDo);
    },
    // 面试名单列表
    BindSubsidy: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_BindSubsidy',
            params: params
        }, baseToDo);
    },
    // 企业模板对应的补贴
    ListSubsidy: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ListSubsidy',
            params: params
        }, baseToDo);
    }
};
export default InterviewNameListService;