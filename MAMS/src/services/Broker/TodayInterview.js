import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

import env from 'CONFIG/envs';

const API_URL = env.api_url;


let baseToDo = {
    successDo: (res) => {
        // closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        // closeDialog('spinner');
        // maybe you could dialog the res.message
        return res;
    }
};

let getInterviewDataService = {
    getInterview: (params) => {
        // openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_INT/WD_BKINT_GetInterview',
            params: params
        }, baseToDo);
    },
    getInterviewCountdown: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_BrokerGetUserSubsidy',
            params: params
        }, baseToDo);
    }
};
export default getInterviewDataService;