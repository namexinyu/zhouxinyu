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
    // 查看会员考勤
    // complainCheckInFlowInfo: (params) => {
    //     return HttpRequest.post({
    //         url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ComplainCheckInFlowInfo',
    //         params: params
    //     }, baseToDo);
    // },
    // 申诉处理
    complainHandle: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ComplainHandle',
            params: params
        }, baseToDo);
    },
    // 获得申诉处理信息
    // complainHandleInfo: (params) => {
    //     return HttpRequest.post({
    //         url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ComplainHandleInfo',
    //         params: params
    //     }, baseToDo);
    // },
    // 申诉列表
    getComplainList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ComplainList',
            params: params
        }, baseToDo);
    },
    // 申诉数量统计
    getComplainTotal: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ComplainTotal',
            params: params
        }, baseToDo);
    },
    // 申诉列表导出
    complainListExport: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_ComplainListExport',
            params: params
        }, baseToDo);
    }
};
export default ComplainOrderService;