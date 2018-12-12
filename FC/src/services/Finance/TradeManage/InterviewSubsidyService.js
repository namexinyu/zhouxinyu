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

let InterviewOrderService = {
    // 补贴审核记录
    getOneVerifyDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_OneVerifyDetail',
            params: params
        }, baseToDo);
    },
    // 查询面试名单
    getInterviewOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_InterviewList',
            params: params
        }, baseToDo);
    },
    // 手工结算
    setOrderSettle: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_SetOrderSettle',
            params: params
        }, baseToDo);
    },
    // 订单状态
    setOrderStep: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_SetOrderStep',
            params: params
        }, baseToDo);
    },
    // 会员补贴审核
    auditSubsidyApply: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_UserSubsidyApplyAudit',
            params: params
        }, baseToDo);
    },
    // 补贴订单列表
    getUserSubsidyApplyList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_UserSubsidyApplyList',
            params: params
        }, baseToDo);
    },
    // 异常补贴列表
    getSpecialPermitList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_SpecialPermitList',
            params: params
        }, baseToDo);
    },
    // 支付接口调用
    UserSubsidyToBank: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_UserSubsidyToBank',
            params: params
        }, baseToDo);
    },
    setSpecialPermit: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_SetSpecialPermit',
            params: params
        }, baseToDo);
    }
};

export function exportInterviewList(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OrderSettle/FIN_OS_InterviewListExport',
        params: params
    }, callToDo(callback));
}

export function exportUserSubsidyApplyList(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OrderSettle/FIN_OS_UserSubsidyApplyListExport',
        params: params
    }, callToDo(callback));
}

// 导出特批
export function exportSpecialPermitList(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OrderSettle/FIN_OS_SpecialPermitListExport',
        params: params
    }, callToDo(callback));
}

export default InterviewOrderService;