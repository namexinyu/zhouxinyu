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
let ComplainOrderService = {
    // 获取结算列表
    getSettlementReport: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_SettlementReport',
            params: params
        }, baseToDo);
    },
    // 导出
    SettlementReportExport: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_SettlementReportExport',
            params: params
        }, baseToDo);
    }
};
export default ComplainOrderService;