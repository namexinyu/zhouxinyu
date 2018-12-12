import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

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
    },
    GetNewNotifyLis: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/MyNotify/WD_MN_GetNewNotifyList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    PushMessageToDevice: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_JPushServer/BK_PushMessageToDevice',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    }
};
export default Service;