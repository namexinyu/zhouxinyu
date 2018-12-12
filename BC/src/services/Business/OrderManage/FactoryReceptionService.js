import {HttpRequest, env} from 'mams-com';
let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};
let FactoryReceptionService = {


    getList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FactoryEntrancePick/BZ_FactoryEntrancePick_GetList',
            params: params
        }, baseToDo);
    },

    setLabor: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FactoryEntrancePick/BZ_FactoryEntrancePick_SetLabor',
            params: params
        }, baseToDo);
    },

    exportList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FactoryEntrancePick/BZ_FactoryEntrancePick_ExportList',
            params: params
        }, baseToDo);
    },

    updateInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_FactoryEntrancePick/BZ_FactoryEntrancePick_UpdateInfo',
            params: params
        }, baseToDo);
    }

};
export default FactoryReceptionService;