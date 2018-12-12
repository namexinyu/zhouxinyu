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

let getBrokersOnDutyService = {
    getBrokersOnDuty: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_Header/WD_ECHD_BrokersOnDuty',
            params: params
        }, baseToDo);
    }
};
export default getBrokersOnDutyService;