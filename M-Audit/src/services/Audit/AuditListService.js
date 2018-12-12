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
    getAttendanceList: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_GetRecordList',
            params: params
        }, baseToDo);
    },
    getWorkCardList: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_AuditWorkCard/AT_ATWC_GetRecordList',
            params: params
        }, baseToDo);
    },
    getIDCardList: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_GetAuditCertList',
            params: params
        }, baseToDo);
    },
    getBankCardList: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_QueryInfoList',
            params: params
        }, baseToDo);
    },
    modifyIDCard: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_ModifyCert',
            params: params
        }, baseToDo);
    }
};
export default AuditListService;