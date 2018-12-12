import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

import {HttpRequest, env} from 'mams-com';

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
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
            url: env.api_url + '/BK_Entrust/BK_ENTR_GetEmployeeList',
            params: transferQueryParams(params)
        }, baseToDoNoSpinner, {EmployeeMapID: true});
    }
};
export default DepartmentService;