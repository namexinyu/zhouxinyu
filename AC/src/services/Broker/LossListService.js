import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

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
let LossListService = {
    getLossList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BrokerRecurit_information/WD_Bro_Turn_Stat',
            params: params || {}
        }, baseToDo);
    }
};
export default LossListService;