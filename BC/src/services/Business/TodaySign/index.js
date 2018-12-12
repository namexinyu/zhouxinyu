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
let TodaySignService = {
    // 获取签到统计信息
    getStatisticInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_SGIN/BZ_SGIN_GetStatisticInfo',
            params: params
        }, baseToDo);
    },
    // 获取今日签到报告列表
    getReportList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_SGIN/BZ_SGIN_GetReportList',
            params: params
        }, baseToDo);
    }
};
export default TodaySignService;