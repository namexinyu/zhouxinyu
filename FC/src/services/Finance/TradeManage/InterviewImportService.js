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
let InterviewImportService = {
    // 导入结算名单
    importLaborSettle: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_LaborSettleImport',
            params: params
        }, baseToDo);
    },
    // 保存结算结果
    saveLaborSettle: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_OrderSettle/FIN_OS_LaborSettleSave',
            params: params
        }, baseToDo);
    }
};
export default InterviewImportService;