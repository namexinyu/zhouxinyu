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

let getTodayTrackSignDataService = {
    getTodayTrackSign: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetTodayReturnCount',
            params: params
        }, baseToDo);
    }
};
export default getTodayTrackSignDataService;