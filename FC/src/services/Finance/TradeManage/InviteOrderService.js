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

let InviteOrderService = {
    // 查询推荐费订单
    getInviteFeeOrderList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_InviteFee/FIN_DEAL_InviteFeeOrder',
            params: params
        }, baseToDo);
    }
};

export function inviteFeeOrderExport(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_InviteFee/FIN_DEAL_InviteFeeOrderExport',
        params: params
    }, callToDo(callback));
}

export function inviteFeeBatchPay(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_InviteFee/FIN_DEAL_InviteFeeBatchPay',
        params: params
    }, callToDo(callback));
}

export function inviteFeeAbandon(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_InviteFee/FIN_DEAL_InviteFeeAbandon',
        params: params
    }, callToDo(callback));
}

export default InviteOrderService;