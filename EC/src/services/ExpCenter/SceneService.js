import HttpRequest from 'REQUEST';
import {message} from 'antd';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let baseToDoWithErrMsg = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        if (res && res.Desc) {
            message.info(res.Desc);
        }
        return res;
    }
};

function deepCopy(o) {
    if (o instanceof Array) {
        let n = [];
        for (let i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else if (o instanceof Function) {
        let n = new Function("return " + o.toString())();
        return n;
    } else if (o instanceof Object) {
        let n = {};
        for (let i of Object.keys(o)) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
}

let transferQueryParams = (data) => {
    let params = deepCopy(data);
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

let SceneService = {
    // 获取签到会员列表
    getSignList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetUserSignList',
            params: transferQueryParams(params)
        }, baseToDoWithErrMsg);
    },
    setUserUnInterview: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_SetInterviewStatus',
            params: transferQueryParams(params)
        }, baseToDo);
    },
    getSignRecordByUUID: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetUserSignListByUuid',
            params: transferQueryParams(params)
        }, baseToDoWithErrMsg);
    },
    // 获取收退费列表
    getChargeList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetInterviewFeeList',
            params: transferQueryParams(params)
        }, baseToDoWithErrMsg);
    },
    // EC_UserCheckin/EC_USCH_ExportInterviewFeeList
    exportChargeList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_ExportInterviewFeeList',
            params: transferQueryParams(params)
        }, baseToDo);
    },
    // 新增退费
    addRefundData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_InterviewRefund',
            params: params || {}
        }, baseToDo);
    },
    // 获取劳务接人列表
    getPickUpList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_LaborGather/EC_LAGA_GetLaborGatherList',
            params: transferQueryParams(params)
        }, baseToDoWithErrMsg);
    },
    // 获取劳务名称列表(筛选用)
    getLaborFilterList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_LaborGather/EC_LAGA_GetLaborList',
            params: params
        }, baseToDo);
    }
};
export default SceneService;