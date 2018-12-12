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

let removeMobile = {
    CheckMobile: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_CheckMobileStatus',
            params: params
        }, baseToDo);
    },
    MoveNullNumber: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_MoveNullNumber',
            params: params
        }, baseToDo);
    }
};
export default removeMobile;