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
    // 申诉财务审核
    appealComplainOrder: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_AccountCheckManager/FIN_ACMS_ComplainFinanceAudit',
            params: params
        }, baseToDo);
    },
    // 获取考勤
    getComplainCheck: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_ComplainCheck_Interface',
            params: params
        }, baseToDo);
    },
    // 导出申诉订单
    exportComplainOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_Complain_Export',
            params: params
        }, baseToDo);
    },
    // 申诉列表
    getComplainOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_Complain_Interface',
            params: params
        }, baseToDo);
    },

    // 劳务记录导出
    exportComplainRecordList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_Complain_Record_Export',
            params: params
        }, baseToDo);
    },
    // 劳务记录列表
    getComplainRecordList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_Order/FIN_Complain_Record_Interface',
            params: params
        }, baseToDo);
    }
};
export default ComplainOrderService;