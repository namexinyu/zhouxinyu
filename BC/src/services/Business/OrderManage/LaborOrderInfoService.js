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
let LaborOrderInfoService = {
    // 劳务订单，订单详情列表
    getLaborOrderInfoList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_LaborRecruitOrder',
            params: params
        }, baseToDo);
    },
    // 劳务订单，手工结算
    laborOrderHireSet: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_UserOrderManager/BZ_UOMS_HireSet',
            params: params
        }, baseToDo);
    }
};
export default LaborOrderInfoService;