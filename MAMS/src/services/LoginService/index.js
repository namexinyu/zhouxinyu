import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
        return res;
    }
};
let LoginService = {
    getVerifyCode: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_AskVCode',
            params: params || {}
        }, baseToDo);
    },
    brokerLogin: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_BrokerLogin',
            params: params || {}
        }, baseToDo);
    }
};
export default LoginService;