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
let Service = {
    getOneLaborPayList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_OneLaborPayList',
            params: params || {}
        }, baseToDo);
    },
    // 获取企业列表(模糊下拉匹配列表)
    getRecruitSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetAllRecruitList',
            params: params || {}
        }, baseToDo);
    },
    // 获得大老板列表(模糊下拉匹配列表) (应该是使用CommonAction调用)
    getLaborBossSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborBossList',
            params: params
        }, baseToDo);
    },
    // 取劳务公司列表(模糊下拉匹配列表) (应该是使用CommonAction调用)
    getLaborSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborIDNameList',
            params: params
        }, baseToDo);
    },
    getEmployeeList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetSalesEmployeeList',
            params: params
        }, baseToDo);
    },
    getEnterpriseSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetEnterpriseList',
            params: params
        }, baseToDo);
    },
    // 体验中心下拉列表
    getHubList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_TrackVisit/BK_TRVI_GetHubList',
            params: params
        }, baseToDo);
    }
};
export default Service;