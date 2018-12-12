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

let getCheckinInfoService = {
    getCheckinInfo: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Home/WD_EHOM_GetCheckinInfo',
            params: params
        }, baseToDo);
    }
};
export default getCheckinInfoService;