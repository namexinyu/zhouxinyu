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
            if (value === parseInt(value, 10)) value = value + '';
            return {key: key, value: value};
        });
        params.QueryParams = params.QueryParams.filter((item) => item.value != null && item.value != undefined && item.value != '');
    }
    return params;
};

let StaffService = {
    // 获取集散部门员工信息列表(匹配用) kerwin处接口
    getHubEmployeeList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_AddrManage/EC_ADMA_GetEmployeeList',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 获取司机名称列表(匹配用) DriverID,DriverName
    getDriverFilterList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_Drivers',
            params: params || {}
        }, baseToDoNoSpinner);
    }
    // 获取员工信息列表
    // getStaffList: (params) => {
    //     return HttpRequest.post({
    //         url: API_URL + '/EC_AddrManage/EC_ADMA_GetHubList',
    //         params: params || {}
    //     }, baseToDo, {ignoreBrokerID: true});
    // }
};
export default StaffService;