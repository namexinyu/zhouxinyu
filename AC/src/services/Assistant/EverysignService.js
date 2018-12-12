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

let EverysignService = {
    GetInterviewList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetSummaryInterviewV3',
            params: params
        }, baseToDo);
    },
    // 导出经纪人每日面试统计数
    exportEverysign: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_ExportInterview',
            params: params
        }, baseToDo);
    }
};
export default EverysignService;