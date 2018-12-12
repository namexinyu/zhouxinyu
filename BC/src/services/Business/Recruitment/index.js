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
    // 获取企业列表(模糊下拉匹配列表)
    getRecruitSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetAllRecruitList',
            params: params || {}
        }, baseToDo);
    },
    // 获取已通过企业列表
    getRecruitPositionList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetWorkRecruitList',
            params: params || {}
        }, baseToDo);
    },
    // 获取已通过的企业下拉列表(new) 注：包含被禁用的企业，业务工作台专用
    getRecruitPositionSimpleList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetAllRecruitListIncludeForbid',
            params: params || {}
        }, baseToDo);
    },
    // 获取待审核和已拒绝的企业列表
    getAuditRecruitList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetAuditRecruitList',
            params: params || {}
        }, baseToDo);
    },
    // 修改企业信息
    editRecruitPositionInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_EditRecruit',
            params: params || {}
        }, baseToDo);
    },
    // 新建企业信息
    createRecruitPositionInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_EditRecruit',
            params: params || {}
        }, baseToDo);
    },
    // 获取企业详细信息
    getRecruitPositionInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetRecruitDetail',
            params: params || {}
        }, baseToDo);
    },
    // 审核企业
    auditRecruitStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_AuditRecruit',
            params: params || {}
        }, baseToDo);
    },
    createRecruitTag: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_AddRecruitTags',
            params: params || {}
        }, baseToDo);
    },
    exportRecruitPositionList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_ExportRecruitList',
            params: params || {}
        }, baseToDo);
    },
    // 设置企业显示状态
    setRecruitStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_SetRecruitStatus',
            params: params || {}
        }, baseToDo);
    },
    // 获取劳务分配列表
    getLaborAssignList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetLaborAssignList',
            params: params || {}
        }, baseToDo);
    },
    // 导出劳务分配列表
    exportLaborAssignList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_ExportLaborAssignList',
            params: params || {}
        }, baseToDo);
    },
    // 设置分配方案
    setAssignDesc: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_SetAssignDesc',
            params: params || {}
        }, baseToDo);
    }
};
export default Service;