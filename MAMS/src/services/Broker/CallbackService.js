import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

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


let CallbackService = {
    // 面试回访
    // 面试名单，接口数据目前是按会员的作为单位返回数据，已和后台(周博)沟通，无结果。albert备注
    getCallBackInterviewList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_GetNoTouchInterviewList', // 已定义
            params: transferQueryParams(params)
        }, baseToDo);
    },
    // 工牌回访
    getCallBackBadgeList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_GetNoPutWorkCardList', // 已定义
            params: transferQueryParams(params)
        }, baseToDo);
    },
    // 一周回访
    getCallbackWorkingList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_GetNoTouchEntryList', // 已定义
            params: transferQueryParams(params)
        }, baseToDo);
    },
    setInterviewReply: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_SetCallBackRecord',
            params: params
        }, baseToDo);
    },
    setWorkingReply: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_SetCallBackRecord',
            params: params
        }, baseToDo);
    }
};
// 压力测试
// for (let i = 0; i < 100; i++) {
//     HttpRequest.post({
//         url: API_URL + '/BK_Members/WD_MEMB_GetMemberList',
//         params:
//             {
//                 "OrderParams": [{"Key": "RegDate", "Order": 1}],
//                 "QueryParams": [{"Key": "Status", "Value": "0"}, {"Key": "Source", "Value": "0"}, {
//                     "Key": "WorkState",
//                     "Value": "0"
//                 }, {"Key": "TimeInterval", "Value": "0"}, {"Key": "IsCert", "Value": "0"}, {
//                     "Key": "IsWeekPay",
//                     "Value": "0"
//                 }, {"Key": "IsPreOrder", "Value": "0"}],
//                 "RecordIndex": 0,
//                 "RecordSize": 10,
//                 "BrokerID": 7
//             }
//     }, baseToDo, {ignoreBrokerID: true});
// }
export default CallbackService;