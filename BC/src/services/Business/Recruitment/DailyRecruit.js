import {HttpRequest, env} from 'mams-com';

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};

export function getRecruitCondition(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitCondition',
        params: params || {}
    }, baseToDo);
}
export function getEntAddress(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetEntAddress',
        params: params || {}
    }, baseToDo);
}

export function setRecruitCondition(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitCondition',
        params: params || {}
    }, baseToDo);
}

export function setRecruitStatus(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitStatus',
        params: params || {}
    }, baseToDo);
}
export function getMasterPush(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitMasterPush',
        params: params || {}
    }, baseToDo);
}
// 设置录用条件--单项设置(new) gatherInfo 集合时间 //remark 备注
export function setRecruitConditionItem(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitConditionItem',
        params: params || {}
    }, baseToDo);
}

// 获取劳务报价
export function getLaborOrderByRecruitTmpID(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetLaborOrderByRecruitTmpID',
        params: params || {}
    }, baseToDo);
}

// 获取会员补贴
export function getQuoteListByRecruitTmpID(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetQuoteListByRecruitTmpID',
        params: params || {}
    }, baseToDo);
}

// 获取建议补贴
export function getStandardSubsidy(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetStandardSubsidy',
        params: params || {}
    }, baseToDo);
}

// 劳务报价设置基准价
export function setStandardSubsidy(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetLaborOrderSp',
        params: params || {}
    }, baseToDo);
}

// 设置劳务报价状态
export function setLaborOrderStatus(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetLaborOrderStatus',
        params: params || {}
    }, baseToDo);
}

// 会员价格作废(new)
export function cancelQuote(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_CancelQuote',
        params: params || {}
    }, baseToDo);
}

// 查询会员价格作废结果(new)
export function queryCancelQuoteResult(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_QueryCancelQuoteResult',
        params: params || {}
    }, baseToDo);
}

// 获取会员价格作废实际影响的会员订单个数(new)
export function getCancelQuoteEffectCount(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetCancelQuoteEffectCount',
        params: params || {}
    }, baseToDo);
}

// 配置价格
export function setRecruitQuotes(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitQuotes',
        params: params || {}
    }, baseToDo);
}
// 设置工价、补贴、收费在App端展示类别
export function setShowOrder(params) {
    return HttpRequest.post({
        url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetShowOrder',
        params: params || {}
    }, baseToDo);
}

export default {
    // 每日招聘列表
    getRecruitInfoList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitInfoList',
            params: params
        }, baseToDo);
    },
    getCurrentRecruitCount: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetCurrentRecruitCount',
            params: params || {}
        }, baseToDo);
    }
};