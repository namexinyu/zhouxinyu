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

let BoardService = {
    GetAllCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_OverviewDailyWork/BA_GetOverview',
            params: params
        }, baseToDo);
    },
    // BA_OverviewDailyWork/BA_GetDepartWithGroup
    GetBrokerDepartList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_OverviewDailyWork/BA_GetDepartWithGroup',
            params: params
        }, baseToDo);
    }
};
export default BoardService;