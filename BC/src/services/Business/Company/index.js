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
    getCompanyList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborList',
            params: params
        }, baseToDo);
    },
    checkCompany: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_AuditLabor',
            params: params
        }, baseToDo);
    },
    modifyCompanyTeamworkStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_ModCooperationStatus',
            params: params
        }, baseToDo);
    },
    editCompanyInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_CreateModLabor',
            params: params
        }, baseToDo);
    },
    createCompanyInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_CreateModLabor',
            params: params
        }, baseToDo);
    },
    getCompanyCheckList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborAuditList',
            params: params
        }, baseToDo);
    },
    getCompanyDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborDetail',
            params: params
        }, baseToDo);
    },
    getCheckCompanyDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborAuditDetail',
            params: params
        }, baseToDo);
    },
    editCheckCompanyInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_ModLaborAudit',
            params: params
        }, baseToDo);
    },
    getCompanyAccountInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetAccountDetail',
            params: params
        }, baseToDo);
    },
    getLaborBossContactInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_GetLaborBossDetail',
            params: params
        }, baseToDo);
    },
    exportCompanyList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_ExportLaborList',
            params: params
        }, baseToDo);
    },
    exportCompanyAuditList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Labor/BZ_LABO_ExportLaborAuditList',
            params: params
        }, baseToDo);
    }
};
export default Service;