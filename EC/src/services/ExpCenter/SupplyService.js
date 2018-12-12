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

// 物品发放相关接口

let SupplyService = {
    // 获取补给发放列表
    getSupplyReleaseList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetGiftReceiveList',
            params: transferQueryParams(params)
        }, baseToDo);
    },
    // 获取补给发放总计信息
    getSupplyReleaseTotal: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetGiftTotalInfo',
            params: params
        }, baseToDoNoSpinner);
    },
    // 根据用户名称匹配签到企业物资发放信息列表
    getUserSignGiftList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetUserSignGiftList',
            params: params || {}
        }, baseToDo);
    },
    // 新增补给发放数据
    addSupplyReleaseData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_BuildGiftReceiveRecord',
            params: params || {}
        }, baseToDo);
    },
    // 退回补给押金
    returnSupplyDeposit: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GiftRefund',
            params: params || {}
        }, baseToDo);
    }
};
export default SupplyService;