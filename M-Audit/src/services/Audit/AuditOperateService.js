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

let AuditListService = {
    getIdCardUnAuditRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_GetUnAuditCert',
            params: params
        }, baseToDo);
    },
    getIdCardUnAuditCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_GetUnAuditCount',
            params: params
        }, baseToDo);
    },
    auditIdCard: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_AuditCert',
            params: params
        }, baseToDo);
    },
    getBankCardUnAuditRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_GetOneUncheckedInfo',
            params: params
        }, baseToDo);
    },
    getBankCardUnAuditCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_GetUncheckedCount',
            params: params
        }, baseToDo);
    },
    auditBankCard: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_SetCheckStatus',
            params: params
        }, baseToDo);
    },
    getAttendanceUnAuditRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_GetUnauditedRecord',
            params: params
        }, baseToDo);
    },
    getAttendanceUnAuditCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_GetUnauditedNum',
            params: params
        }, baseToDo);
    },
    auditAttendance: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_AuditRecord',
            params: params
        }, baseToDo);
    },
    getWorkerCardUnAuditRecord: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_GetUnauditedRecord',
            params: params
        }, baseToDo);
    },
    getWorkerCardUnAuditCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_GetUnauditedNum',
            params: params
        }, baseToDo);
    },
    auditWorkerCard: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_AuditRecord',
            params: params
        }, baseToDo);
    },
    getExamplePictureRecords: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntSample/AT_ENSA_GetSampleList',
            params: params
        }, baseToDo);
    },
    editExamplePicture: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntSample/AT_ENSA_BuildOrModifySample',
            params: params
        }, baseToDo);
    }
};
export default AuditListService;