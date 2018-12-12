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

let ReportService = {
    RptGetPickUpList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetSummaryPreCheckinAddrV2',
            params: params
        }, baseToDo);
    },
    RptGetInterviewList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetSummaryInterviewV2',
            params: params
        }, baseToDo);
    },
    // 获取每日入职统计列表
    getDailyEmployedList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetSummaryEntry',
            params: params
        }, baseToDo);
    },
    // 导出每日入职统计
    exportDailyEmployed: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_ExportEntry',
            params: params
        }, baseToDo);
    },
    // 获取每日推荐统计列表
    getDailyRecommendList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetSummaryRecommend',
            params: params
        }, baseToDo);
    },
    // 导出每日推荐统计
    exportDailyRecommend: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_ExportRecommend',
            params: params
        }, baseToDo);
    },
    // 查询经纪人排班
    getBorkerScheduleList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_PlanWork/WD_GetPlanWorkInfoList',
            params: params
        }, baseToDo);
    },
    // 设置经纪人排班
    setBrokerSchedule: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_PlanWork/WD_SetOnePlanWorkInfo',
            params: params
        }, baseToDo);
    }
};
export default ReportService;