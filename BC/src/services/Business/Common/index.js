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
    getCommonEnumMapping: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FacePlate/GetEnum_Interface',
            params: params
        }, baseToDo);
    },
    getIndustryList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_GetCategoryList',
            params: params
        }, baseToDo);
    },
    getUserMobileNumber: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_UserMobile',
            params: params
        }, baseToDo);
    },
    getEntTagList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_EntManager/BZ_EntManager_GetEntTagList',
            params: params || {}
        }, baseToDo);
    },
    getGiftInfoList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetGiftInfoList',
            params: params
        }, baseToDo);
    },
    getEntTmpList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_EntManager/BZ_EntManager_GetEntTmpList',
            params: params
        }, baseToDo);
    },
    getEntLevelCfg: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/GetEntLevelCfg',
            params: params
        });
    },
    sendMessage: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/MyNotify/WD_MN_AddNotify',
            params: params
        });
    },
    sendNotify: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/MyNotify/WD_MN_NextOneNotify',
            params: params
        });
    },
    // 获取事件回复的消息
    getEventMessage: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/MyNotify/WD_MN_GetNewNotifyList',
            params: params
        });
    }
};
export default Service;