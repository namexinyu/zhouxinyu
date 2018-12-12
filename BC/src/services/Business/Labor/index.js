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
    // 获得大老板列表(模糊下拉匹配列表) (应该是使用CommonAction调用)
    getLaborBossSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborBossList',
            params: params
        }, baseToDo);
    },
    // 取劳务公司列表
    getLaborList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborList',
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
    // 取劳务报价列表
    getLaborPriceList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborOrder/BZ_LAOR_GetLaborOrderList',
            params: params
        }, baseToDo);
    },
    // 导出劳务报价列表
    exportLaborPriceList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborOrder/BZ_LAOR_ExportLaborOrderList',
            params: params
        }, baseToDo);
    },
    // 修改劳务报价
    modifyLaborPriceList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborOrder/BZ_LAOR_ModifyLaborOrderList',
            params: params
        }, baseToDo);
    },
    // 获取大老板列表
    getLaborBossPassList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_GetWorkLaborBossList',
            params: params
        }, baseToDo);
    },
    getLaborBossCheckList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_GetAuditLaborBossList',
            params: params
        }, baseToDo);
    },
    editLaborBossInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_EditLaborBoss',
            params: params
        }, baseToDo);
    },
    createLaborBossInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_EditLaborBoss',
            params: params
        }, baseToDo);
    },
    checkLaborBoss: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_AuditLaborBoss',
            params: params
        }, baseToDo);
    },
    getLaborBossCompanyList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_GetLaborCompanyList',
            params: params
        }, baseToDo);
    },
    modifyLaborBossTeamworkStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_ModCooperStatus',
            params: params
        }, baseToDo);
    },
    exportLaborBossWorkList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborBoss/BZ_LABS_ExportWorkLaborBossList',
            params: params
        }, baseToDo);
    }
}
    ;
export default Service;