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

let getVehicleListService = {
    getVehicleList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_ResourceManager/WD_RMAN_GetVehicleList',
            params: params
        }, baseToDo);
    },
    // 车辆管理-车辆修改
    ModVehicleInfo: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/EC_ResourceManager/WD_RMAN_ModVehicleInfo',
            params: params
        }, baseToDo);
    }
};
export default getVehicleListService;