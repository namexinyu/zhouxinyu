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
let GiftFeeService = {
    // 查询赠品押金
    getGiftFeeList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_DEAL/FIN_DEAL_GiftFee',
            params: params
        }, baseToDo);
    },
    // 导出赠品押金
    exportGiftFeeList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_DEAL/FIN_DEAL_GiftFeeExport',
            params: params
        }, baseToDo);
    }
};
export default GiftFeeService;