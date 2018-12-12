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

let DailyService = {
    // 详情
    getMemberDetailInfo: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberDetail',
            params: params || {}
        }, baseToDo);
    },
    // 关注
    getMemberFollowedRecruitList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberFollowedRecruits',
            params: params || {}
        }, baseToDo);
    },
    // 推荐
    getMemberRecommendList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberRecommendRecord',
            params: params || {}
        }, baseToDo);
    },
    // 待办
    getMemberScheduleMessageList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetScheduleMsgList',
            params: params || {}
        }, baseToDo);
    },
    // 工作历程
    getMemberWorkHistory: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberCareerList',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员状态历程
    getMemberStatusRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberWorkFlow',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员的联系记录
    getMemberContactRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberCallRecord',
            params: params || {}
        }, baseToDo);
    },
    // 标签
    getMemberTags: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetUserTags',
            params: params || {}
        }, baseToDo);
    },
    // 口袋
    getLatestPocketCase: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitSrv/WD_JJZX_ListRecruit',
            params: params
        }, baseToDo);
    }
};
export default DailyService;