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
export default {
    // 获取分配信息统计 
    GetAllotStatisticsList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_AllotStatisticsList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 保存分配信息
    SaveHubRecAllot: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SaveHubRecAllot',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 获取分配信息
    GetHubRecAllot: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_HubRecAllot',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 获取报价劳务与剩余名额 
    GetLaborListAndRemainNumber: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_LaborListAndRemainNumber',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 请求分配列表
    GetAllotList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_AllotList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 作废接口
    DeleteHubRecAllot: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_DeleteHubRecAllot',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    }
};