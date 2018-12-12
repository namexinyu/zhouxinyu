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

let BrokerService = {
    GetNeedDoAllList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_Brokers/BA_BROK_GetScheduleList',
            params: params
        }, baseToDo);
    },
    GetNeedDoList: (params) => {
        console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_WaitDo/WD_BWAT_WaitDolist',
            params: params
        }, baseToDo);
    },
    GetHaveDoneList: (params) => {
        console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_WaitDo/WD_BWAT_AlreadyDo',
            params: params
        }, baseToDo);
    },
    // 排班
    GetAttendanceList: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BA_Brokers/BA_BROK_GetHubBrokerAttendance',
            params: params
        }, baseToDo);
    },
    // 新增排班
    CreateAttendanceData: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BA_Brokers/BA_BROK_CreateHubBrokerAttendance',
            params: params
        }, baseToDo);
    },
    // 删除排班
    DeleteAttendanceData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_Brokers/BA_BROK_DeleteHubBrokerAttendance',
            params: params
        }, baseToDo);
    },
    // 绩效列表
    GetPerformanceList: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_GetBrokerPerformance',
            params: params
        }, baseToDo);
    },
    // 导出绩效信息
    ExportPerformanceData: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_ExportBrokerPerformance',
            params: params
        }, baseToDo);
    },
    // 绩效详情
    GetPerformanceDetailZxxMD: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_PerformanceOrderZXX',
            params: params
        }, baseToDo);
    },
    GetPerformanceDetailZxx90: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_Performance90',
            params: params
        }, baseToDo);
    },
    GetPerformanceDetailZxx150: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_Performance150',
            params: params
        }, baseToDo);
    },
    GetPerformanceDetailZxxLz: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_ZXXMonthLeave',
            params: params
        }, baseToDo);
    },
    GetPerformanceDetailWD: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_PerformanceOrderWoda',
            params: params
        }, baseToDo);
    },
    GetPerformanceDetailBJS: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_BrokerPerfDetail',
            params: params
        }, baseToDo);
    },
    // BA_WorkSheet/BA_GetSummaryInterview_PreCheckinAddr
    GetSignInterviewCount: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetSummaryInterview_PreCheckinAddr',
            params: params
        }, baseToDo);
    },
    GetPerformancePKList: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BA_General/GetAllBrokerMonthScore',
            params: params
        }, baseToDo);
    },
    ExportPKList: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BA_General/GetAllBrokerMonthScore_ExportList',
            params: params
        }, baseToDo);
    }
};
export default BrokerService;