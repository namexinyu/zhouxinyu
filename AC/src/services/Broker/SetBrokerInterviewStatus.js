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

let setBrokerInterviewStatusService = {
    setBrokerInterviewStatus: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_SetBrokerInterviewStatus',
            params: params
        }, baseToDo);
    }
};
export default setBrokerInterviewStatusService;