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
    // 查询催结算名单
    getLaborOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborWarning/BZ_LW_LaborUserOrderTotal',
            params: params
        }, baseToDo);
    },
    // 查询催结算名单明细
    getLaborOrderTotal: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_LaborWarning/BZ_LW_LaborUserOrderDetail',
            params: params
        }, baseToDo);
    },
    // 劳务订单导出
    laborOrderListExport: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_LaborOrderListExport',
            params: params
        }, baseToDo);
    }

};
export default LaborOrderService;