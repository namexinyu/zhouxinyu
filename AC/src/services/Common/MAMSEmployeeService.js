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

let DepartmentService = {
    // 获取所有员工名称列表(筛选用)
    GetMAMSEmployeeFilterList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_GetEmployeeList',
            params: transferQueryParams(params)
        }, baseToDoNoSpinner, {EmployeeMapID: true});
    },
    // 获取经纪人列表
    getBrokerList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_PrivilegeSrv/WD_BK_GetUnderBrokers',
            params: transferQueryParams(params)
        }, baseToDoNoSpinner);
    }
};
export default DepartmentService;