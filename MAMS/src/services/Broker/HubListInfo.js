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

let getHubListDataService = {
    getHubList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_TrackVisit/BK_TRVI_GetHubList',
            params: params
        }, baseToDo);
    },
    getHubListV2: (params) => {
        return HttpRequest.post({
            url: API_URL + '/Hub/WD_HUB_GetHubInfoDAL',
            params: params
        }, baseToDo);
    }
};
export default getHubListDataService;
