import {HttpRequest, env} from 'mams-com';

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
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

// 服务费账单列表
export function getBillDetailList(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_LaborMonthBillOrderList',
        params: params
    }, baseToDo);
}

// 服务费账单列表
export function exportMonthBill(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_ExportMonthBill',
        params: params
    }, callToDo(callback));
}

// 服务费账单明细
export function exportBillDetail(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_ExportLaborMonthBillOrderList',
        params: params
    }, callToDo(callback));
}

// 开票金额
export function invoiceHandle(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_InvoiceHandle',
        params: params
    }, callToDo(callback));
}

// 服务费账单列表
export function getServiceBillList(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_LaborMonthBillList',
        params: params
    }, baseToDo);
}

// 结算异常列表
export function getAbnormalList(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_AbnormalList',
        params: params
    }, baseToDo);
}

// 导入开票金额
function laborMonthBillImport(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_LaborMonthBillImport',
        params: params
    }, baseToDo);
}

// 保存导入
function laborMonthBillSave(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_BalanceManage/FIN_OS_LaborMonthBillSave',
        params: params
    }, baseToDo);
}

export default {
    getBillDetailList,
    invoiceHandle,
    getServiceBillList,
    getAbnormalList,
    laborMonthBillImport,
    laborMonthBillSave
};