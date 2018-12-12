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

let DailyService = {
    getPickUpList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_PreOrderSrv/WD_JJZX_ListPreOrder',
            params: params
        }, baseToDo);
    },
    getInterviewList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_OverviewDailyWork/BA_GetInterviewV2',
            params: params
        }, baseToDo);
    },
    getInterviewCountdown: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_BrokerGetUserSubsidy',
            params: params
        }, baseToDo);
    }
};
export default DailyService;
