import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;
// const API_URL = "https://www.easy-mock.com/mock/59f6f315ee3c3f29ab2f9754/broker";

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
            let value = params.QueryParams[key].value;
            // if (value === parseInt(value, 10)) value = value + '';
            return {key: key, value: value};
        });
        params.QueryParams = params.QueryParams.filter((item) => item.value != null && item.value != undefined && item.value != '');
    }
    return params;
};

let AssistanceService = {
    // 部门委托列表
    GetDepartEntrustList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_GetDepartEntrustList',
            params: transferQueryParams(params)
        }, baseToDo, {EmployeeMapID: true});
    },
    // 部门委托回复列表
    GetEntrustReplyList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_GetEntrustReplyList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 评价部门委托
    EvaluateDepartEntrust: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_EvaluateDepartEntrust',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    },
    // 评价部门委托
    CloseDepartEntrust: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_DepartEntrustClose',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    },
    // 新建部门委托
    BuildDepartEntrust: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_BuildDepartEntrust',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    },
    // 回复部门委托
    ReplyDepartEntrust: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_ReplyDepartEntrust',
            params: transferQueryParams(params)
        }, baseToDo, {EmployeeMapID: true});
    },
    // 设置部门委托已读状态
    SetReplyReadStatus: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_SetReplyReadStatus',
            params: params
        }, baseToDoNoSpinner, {EmployeeMapID: true});
    }
};
export default AssistanceService;