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
let LaborOrderService = {
    // 查询劳务订单
    getLaborOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_LaborOrderList_Interface',
            params: params
        }, baseToDo);
    },
    // 获得劳务订单明细列表
    getLaborUserOrderDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_LaborUserList_Interface',
            params: params
        }, baseToDo);
    },
    // 劳务订单财务审核
    auditLaborOrder: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_AccountCheckManager/FIN_ACMS_LaborOrderFinanceAudit',
            params: params
        }, baseToDo);
    },
    // 劳务订单导出
    laborOrderListExport: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_LaborList_Export',
            params: params
        }, baseToDo);
    }
};
export default LaborOrderService;