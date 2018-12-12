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
let LaborSettleImportService = {
    // 提交保存劳务结算名单
    saveLaborSettle: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_LaborSettleSave',
            params: params
        }, baseToDo);
    },
    // 导入结算名单，完成解析
    importLaborSettle: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_LaborSettleImport',
            params: params
        }, baseToDo);
    }
};
export default LaborSettleImportService;