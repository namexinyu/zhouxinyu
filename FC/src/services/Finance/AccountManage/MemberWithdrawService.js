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

function callToDo(callback) {
    return {
        successDo: (res) => {
            callback({res: res.Data || {}});
        },
        errorDo: (err) => {
            callback({err: err.Desc});
        }
    };
}

export function queryWithdrawRecords(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_QueryWithdrawRecords',
        params: params
    }, baseToDo);
}

// 导出
export function exportWithdrawRecords(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_ExportWithdrawRecords',
        params: params
    }, callToDo(callback));
}

// 批量审核
export function verifyWithdrawApplication(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_VerifyWithdrawApplication',
        params: params
    }, callToDo(callback));
}

// 批量退回
export function bankBack(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_BankBack',
        params: params
    }, callToDo(callback));
}

// 批量退回已处理
export function bankBackDeal(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_EnsureBankBack',
        params: params
    }, callToDo(callback));
}

export default {queryWithdrawRecords, exportWithdrawRecords, verifyWithdrawApplication, bankBack};
