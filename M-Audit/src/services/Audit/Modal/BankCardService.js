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

let BankCardService = {
    modalGetBankCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_GetOneInfoByID',
            params: params
        }, baseToDo);
    },
    modalAuditBankCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_SetCheckStatus',
            params: params
        }, baseToDo);
    },
    modalModifyBankCardData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_ModifyInfo',
            params: params
        }, baseToDo);
    }
};
export default BankCardService;