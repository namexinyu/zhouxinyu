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

let getLandManageService = {
    getLandManage: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_HubRecommendManage/EC_Query',
            params: params
        }, baseToDo);
    }
};
export default getLandManageService;