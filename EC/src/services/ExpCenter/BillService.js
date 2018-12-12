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
            message.destroy();
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

let BillService = {
    getBillList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_GetInterviewBillStatistics',
            params: transferQueryParams(params)
        }, baseToDoWithErrMsg);
    },
    editBillData: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_UserCheckin/EC_USCH_UpdateInterviewBill',
            params: params
        }, baseToDo);
    }
};
export default BillService;