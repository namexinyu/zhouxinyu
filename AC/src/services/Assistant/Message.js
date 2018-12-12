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
let Service = {
    getDayEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/MyNotify/WD_MN_GetNotifyList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    }
};
export default Service;