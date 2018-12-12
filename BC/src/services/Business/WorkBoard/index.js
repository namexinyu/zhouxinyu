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
let WorkBoardService = {
    // 获取待处理
    getPendingCount: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FacePlate/BZ_Common_Interface',
            params: params
        }, baseToDo);
    },
    // 获取劳务送人
    getLabourScale: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FacePlate/BZ_LabourScale_Interface',
            params: params
        }, baseToDo);
    },
    // 获取明日报价
    getTomorrowOffer: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FacePlate/BZ_TomorrowOffer_Interface',
            params: params
        }, baseToDo);
    },
    // 最近14天每日输送人数折线图
    getTransport: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FacePlate/BZ_Transport_Interface',
            params: params
        }, baseToDo);
    },
    // 3类企业输送人数一周柱形图统计
    getTypeCount: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FacePlate/BZ_TypeCount_Interface',
            params: params
        }, baseToDo);
    }
};
export default WorkBoardService;