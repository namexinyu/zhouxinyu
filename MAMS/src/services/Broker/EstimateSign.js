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

let getEstimateSignDataService = {
    getEstimateSign: (params) => {
        // return HttpRequest.post({
        //     url: API_URL + '/BK_TrackVisit/BK_TRVI_GetPreSignList',
        //     params: params
        // }, baseToDo);
        return HttpRequest.post({
            url: API_URL + '/BK_PreOrderSrv/WD_JJZX_ListPreOrder',
            params: params
        }, baseToDo);
    },
    getSendCar: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_GetDispatchList',
            params: params
        }, baseToDo);
    },
    getFactoryCheckinList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_FactoryWait/WD_BK_QueryWaitInfo',
            params: params
        }, baseToDo);
    }
};
export default getEstimateSignDataService;
