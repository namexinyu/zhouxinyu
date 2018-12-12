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

let getNeedToDoDataService = {
    getNeedData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_GetWaitDoList/BK_GetWaitDoList',
            params: params
        }, baseToDo);
    },
    getAlready: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_WaitDo/WD_BWAT_AlreadyDo',
            params: params
        }, baseToDo);
    },
    getPouredResouceList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_GetWaitDoList/BK_GetSplitWaitDoList',
            params: params
        }, baseToDo);
    }
};
export default getNeedToDoDataService;