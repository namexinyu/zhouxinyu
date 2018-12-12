import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;
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
            url: API_URL + '/BZ_RecruitManager/BZ_RCMA_GetAllRecruitList',
            params: params || {}
        }, baseToDo);
    },
    getEmployeeList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BZ_Labor/BZ_LABO_GetSalesEmployeeList',
            params: params
        }, baseToDo);
    },
    getEnterpriseSimpleList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BZ_RecruitManager/BZ_RCMA_GetEnterpriseList',
            params: params
        }, baseToDo);
    },
    getCommonEnumMapping: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BZ_FacePlate/GetEnum_Interface',
            params: params
        }, baseToDo);
    },
    getBankNameList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_BankCard/AT_BankCard_GetBankIDAndBankName',
            params: params
        }, baseToDo);
    },
    getIndustryList: (params) => {
        return HttpRequest.post({
            url: API_URL + 'BZ_Ent/BZ_Ent_GetCategoryList',
            params: params
        }, baseToDo);
    }
};
export default Service;