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
let UserOrderService = {
    // 查询会员订单
    getOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_UserList_Interface',
            params: params
        }, baseToDo);
    },
    // 会员订单导出
    exportOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_OrderListExport',
            params: params
        }, baseToDo);
    },
    // 批量设置订单面试状态
    setInterview: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_InterviewSet',
            params: params
        }, baseToDo);
    }
};
export default UserOrderService;