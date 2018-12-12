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
let Service = {
    // 获取招聘快照信息列表
    getRecruitMirrorInfoList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitInfoList',
            params: params || {}
        }, baseToDo);
    },
    // 获取当前企业统计信息
    getCurrentRecruitCount: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetCurrentRecruitCount',
            params: params || {}
        }, baseToDo);
    },
    // 设置招聘信息的招聘状态
    setRecruitMirrorStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitStatus',
            params: params || {}
        }, baseToDo);
    },
    // 获取会员补贴
    getQuoteListByRecruitTmpID: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetQuoteListByRecruitTmpID',
            params: params || {}
        }, baseToDo);
    },
    // 获取当前企业的劳务报价
    getRecruitLaborOrderPrice: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetLaborOrderByRecruitTmpID',
            params: params || {}
        }, baseToDo);
    },
    // 修改企业快照信息
    setRecruitQuotes: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitQuotes',
            params: params || {}
        }, baseToDo);
    },
    // 修改企业招聘条件
    modifyRecruitMirrorCondition: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetRecruitCondition',
            params: params || {}
        }, baseToDo);
    },
    // 获取企业招聘条件
    getRecruitMirrorCondition: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitCondition',
            params: params || {}
        }, baseToDo);
    },
    // 设置劳务报价状态
    setLaborOrderStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetLaborOrderStatus',
            params: params || {}
        }, baseToDo);
    },
    // 获取企业快照详情
    getRecruitMirrorDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitMirror',
            params: params || {}
        }, baseToDo);
    },
    // 修改企业快照详情
    modifyRecruitMirrorDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_ModifyRecruitMirror',
            params: params || {}
        }, baseToDo);
    },
    // 获取审核列表
    getAuditQuoteList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetAuditQuoteList',
            params: params || {}
        }, baseToDo);
    },
    // 审核会员补贴
    auditQuote: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_AuditQuote',
            params: params || {}
        }, baseToDo);
    },
    // 获取收入信息(new)
    getIncomeByRecruitID: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetIncomeByRecruitID',
            params: params || {}
        }, baseToDo);
    }
};
export default Service;