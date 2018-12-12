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

let HubService = {
    // 获取体验中心信息列表
    getHubInfoList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_AddrManage/EC_ADMA_GetHubList',
            params: params || {}
        }, baseToDo, {ignoreBrokerID: true});
    },
    // 获取体验中心名称列表（筛选用）
    getHubNameList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_GetDepartEntrustList',
            params: params || {}
        }, baseToDo, {ignoreBrokerID: true});
    },
    // 编辑体验中心
    editHubInfo: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_AddrManage/EC_ADMA_BuildOrModifyHub\n',
            params: params || {}
        }, baseToDo, {ignoreBrokerID: true});
    }
};
export default HubService;