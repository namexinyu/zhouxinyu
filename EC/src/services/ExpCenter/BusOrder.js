import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
        // maybe you could dialog the res.message
        return res;
    }
};

let BusOrder = {
    // 查询
    GetBusOrderList: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/GetBusOrderList',
            params: params
        }, baseToDo);
    },
    // 详情
    GetBusOrderDetail: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/GetBusOrderDetail',
            params: params
        }, baseToDo);
    },
    // 确认订单
    SetSettleStatus: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/SetSettleStatus',
            params: params
        }, baseToDo);
    },
    // 修改
    GetModifyBusOrder: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/ModifyBusOrder',
            params: params
        }, baseToDo);
    }
};
export default BusOrder;