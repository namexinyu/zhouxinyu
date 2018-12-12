import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};

let WorkCardService = {
    modalGetWorkCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_GetAuditRecord',
            params: params
        }, baseToDo);
    },
    modalAuditWorkCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_AuditRecord',
            params: params
        }, baseToDo);
    },
    modalModifyWorkCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_ModifyRecord',
            params: params
        }, baseToDo);
    }
};
export default WorkCardService;