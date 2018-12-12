import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
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

let MAMSRecruitService = {
    // 获取所有企业名称列表(筛选用)
    GetMAMSRecruitFilterList: (params = {}) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitManager/BZ_RCMA_GetAllRecruitList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 获取招工资讯列表
    GetMAMSRecruitmentList: (params = {}) => {
        return HttpRequest.post({
            // url: env.api_url + '/BK_RecuritInfo/WD_RECU_GetRecruitlist',
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitConsultList',
            params: transferQueryParams(params)
        }, baseToDo, {EmployeeMapID: true});
    },
    // 获取招工资讯录用条件明细
    GetMAMSRecruitmentRequireInfo: (params = {}) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetRecruitCondition',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 这两个接口目前仅开放给经纪人
    // 按会员手机号匹配招工标签
    MatchUserRecruitTag: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecuritInfo/WD_RECU_PhoneMatchInfo',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 发起职位纠错(作为部门委托发给业务部门)
    BuildRecruitmentEntrust: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Entrust/BK_ENTR_BuildDepartEntrust',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 导出小黄图
    ExportYellowPage: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BZ_RecruitInfo/BZ_RCIF_ExportList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 获取招工企业资讯详情
    getRecruitInfoDetail: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BZ_EntManager/BZ_EntManager_GetEntInfo',
            params: params
        }, baseToDo);
    },
    getEntTagList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_EntManager/BZ_EntManager_GetEntTagList',
            params: params || {}
        }, baseToDo);
    }
};
export default MAMSRecruitService;