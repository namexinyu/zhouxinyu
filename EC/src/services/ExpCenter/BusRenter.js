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

let BusRenter = {
    // 查询
    getBusRenterList: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BRCMG_QryBusRenterList',
            params: params
        }, baseToDo);
    },
    // 新增
    getAddBusRenter: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BRCMG_AddBusRenter',
            params: params
        }, baseToDo);
    },
    // 修改
    getModBusRenter: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BRCMG_ModBusRenter',
            params: params
        }, baseToDo);
    },
    // 删除
    getDelBusRenter: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BRCMG_DelBusRenter',
            params: params
        }, baseToDo);
    }
};
export default BusRenter;