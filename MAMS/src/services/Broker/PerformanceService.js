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
        }, baseToDo, {ignoreBrokerID: true});
    },
    GetPerformanceDetailZxx90: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_Performance90',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    GetPerformanceDetailZxx150: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_Performance150',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    GetPerformanceDetailZxxLz: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_ZXXMonthLeave',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    GetPerformanceDetailWD: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_PerformanceOrderWoda',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    GetPerformanceDetailBJS: (params) => {
        // console.log('params', params);
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_BrokerPerfDetail',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    }
};
export default BrokerService;