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

let IDCardService = {
    modalGetIDCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_GetAuditCert',
            params: params
        }, baseToDo);
    },
    modalAuditIDCardData: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_AuditCert',
            params: params
        }, baseToDo);
    },
    modalModifyIDCardData: (params) => {
        if (params && params.IDCardNum) params.IDCardNum = params.IDCardNum.replace('x', 'X');
        return HttpRequest.post({
            url: API_URL + '/AT_Cert/AT_CERT_ModifyCert',
            params: params
        }, baseToDo);
    }
};
export default IDCardService;