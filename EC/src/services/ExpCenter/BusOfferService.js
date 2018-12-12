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

let BusOfferService = {
    // 查询报价列表
    getBusOfferRouteList: (params) => {
        // openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BFFMG_QryBusRouteList',
            params: params
        }, baseToDo);
    },
    // 查询当前路线报价列表
    getCurrentBusOfferList: (params) => {
        // openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BFFMG_QryBusFixedFeeList',
            params: params
        }, baseToDo);
    },
    // 添加报价
    addBusOffer: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BFFMG_AddBusFixedFee',
            params: params
        }, baseToDo);
    },
    // 设置是否合作
    setCooperation: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BFFMG_SetCooperate',
            params: params
        }, baseToDo);
    },
    // 删除单条报价
    delBusoffer: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BFFMG_DelBusFixedFee',
            params: params
        }, baseToDo);
    }
};
export default BusOfferService;