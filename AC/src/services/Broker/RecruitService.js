import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

const API_URL = env.api_url;

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

let transferQueryParams = (params) => {
    if (params.QueryParams && Object.keys(params.QueryParams).length > 0) {
        params.QueryParams = Object.keys(params.QueryParams).map((key) => ({key: key, value: params.QueryParams[key]}));
    }
    return params;
};

let RecruitService = {
    getRecruitList: (params = {}) => {
        // 额外的spinner控制，用于滚动条自动加载更隐蔽
        if (params.RecordIndex > 0) {
            return HttpRequest.post({
                url: API_URL + '/BK_RecuritInfo/WD_RECU_GetRecruitlist',
                params: transferQueryParams(params)
            }, baseToDoNoSpinner, {ignoreBrokerID: true});
        } else {
            openDialog({id: 'spinner', type: 'spinner'});
            return HttpRequest.post({
                url: API_URL + '/BK_RecuritInfo/WD_RECU_GetRecruitlist',
                params: transferQueryParams(params)
            }, baseToDo, {ignoreBrokerID: true});
        }

    },
    // 根据会员手机号，获取会员匹配工作相关信息，包括年龄，烟疤等等
    getMemberRecruitMatchInfo: (params = {}) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_RecuritInfo/WD_RECU_PhoneMatchInfo',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    getRecruitNameList: (params = {}) => {
        // 从经济人会员表取出的企业名称列表，用于搜索条件筛选企业
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetRecruitList',
            params: params
        }, baseToDoNoSpinner);
    },
    getRecruitRequireInfo: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecuritInfo/WD_RECU_GetRecruitReq',
            params: params
        }, baseToDoNoSpinner, {ignoreBrokerID: true});
    },
    commitRecruitBug: (params = {}) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_RecuritInfo/WD_RECU_ErrorSend',
            params: params
        }, baseToDo);
    }
};
export default RecruitService;