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
let DispatchOrderService = {
    // 查询报销订单
    getDispatchOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_DEAL/FIN_DEAL_DispatchOrderClaim',
            params: params
        }, baseToDo);
    },
    // 导出推荐费订单
    exportDispatchOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_DEAL/FIN_DEAL_DispatchOrderClaimExport',
            params: params
        }, baseToDo);
    }
};
export default DispatchOrderService;