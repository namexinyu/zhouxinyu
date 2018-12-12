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
    getBusTypeList: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_GetBusTypeList',
            params: params
        }, baseToDo);
    },
    // 新增
    getAddBusType: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_AddBusType',
            params: params
        }, baseToDo);
    },
    // 修改
    getModBusType: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_ModBusType',
            params: params
        }, baseToDo);
    },
    // 删除
    getDelBusType: (params) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/EC_BusManager/EC_BUSMG_DelBusType',
            params: params
        }, baseToDo);
    }
};
export default BusType;