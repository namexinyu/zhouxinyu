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

let getPriceAllocationService = {
    getPriceAllocation: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_ResourceManager/WD_RMAN_GetActivityList',
            params: params
        }, baseToDo);
    }
};
export default getPriceAllocationService;