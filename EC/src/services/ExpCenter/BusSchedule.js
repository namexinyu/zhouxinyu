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
        // maybe you could dialog the res.message
        return res;
    }
};

let BusType = {
    // 查询
    getBusScheduleList: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_GetBusScheduleList',
            params: params
        }, baseToDo);
    },
    // 新增
    getAddBusSchedule: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_AddBusSchedule',
            params: params
        }, baseToDo);
    },
    // 修改
    getModBusSchedule: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_ModBusSchedule',
            params: params
        }, baseToDo);
    },
    // 删除
    getDelBusSchedule: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_DelBusRoute',
            params: params
        }, baseToDo);
    }
};
export default BusType;