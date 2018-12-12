import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};
let baseToDoNoSpinner = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let transferQueryParams = (data) => {
    let params = Object.assign({}, data);
    if (params.QueryParams && Object.keys(params.QueryParams).length > 0) {
        params.QueryParams = Object.keys(params.QueryParams).map((key) => {
            let value = params.QueryParams[key];
            // if (value === parseInt(value, 10)) value = value + '';
            return {key: key, value: value};
        });
        params.QueryParams = params.QueryParams.filter((item) => item.value != null && item.value != undefined && item.value != '');
    }
    return params;
};

let DispatchService = {
    // 获取派单跟踪列表
    getDispatchList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_OrdersToday',
            params: params || {}
        }, baseToDo);
    },
    getDispatchClaimCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_StatisticsOfClaimsToday',
            params: params || {}
        }, baseToDo);
    },
    getDispatchHistoryList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_OrdersHistory',
            params: params || {}
        }, baseToDo);
    },
    getDispatchHistoryClaimCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_StatisticsOfClaimsHistory',
            params: params || {}
        }, baseToDo);
    },
    addDispatchClaim: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_Claim',
            params: params || {}
        }, baseToDo);
    },
    // EC_Header/WD_ECHD_ChangeOrderStatus
    editDispatchData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_ChangeOrderStatus',
            params: params || {}
        }, baseToDo);
    }
};
export default DispatchService;