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

let FeeService = {
    // 收退费列表
    interviewFeeList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_InterviewFeeList',
            params: params
        }, baseToDo);
    },
    // 劳务结底价列表
    userOrderSettleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_UserOrderSettleList',
            params: params
        }, baseToDo);
    },
    // 结底价导入
    importSettleLaborCharge: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_SettleLaborChargeImport',
            params: params
        }, baseToDo);
    },
    // 提交结底价
    saveSettleLaborCharge: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_SettleLaborChargeSave',
            params: params
        }, baseToDo);
    },
    feeTotalBillList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_InterviewFeeTotalBillList',
            params: params
        }, baseToDo);
    }
};

export function exportInterviewFee(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_ExportInterviewFee',
        params: params
    }, callToDo(callback));
}

export function batchSettleLaborCharge(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_BatchSettleUserOrder',
        params: params
    }, callToDo(callback));
}

// 交账审核
export function interviewFeeAudit(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_ChargeAndReturn/FIN_OS_InterviewFeeTotalBillAudit',
        params: params
    }, callToDo(callback));
}

export default FeeService;