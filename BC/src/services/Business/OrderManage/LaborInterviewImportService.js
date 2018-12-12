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
let LaborInterviewImportService = {
    // 提交保存劳务面试名单
    saveLaborInterview: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_LaborInterviewSave',
            params: params
        }, baseToDo);
    },
    // 导入面试名单，完成解析
    importLaborInterview: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_LaborInterviewImport',
            params: params
        }, baseToDo);
    }
};
export default LaborInterviewImportService;