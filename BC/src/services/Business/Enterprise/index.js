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
let Service = {
    getEntSummaryList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_GetEntSummaryList',
            params: params
        }, baseToDo);
    },
    editEntDetailInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_EditEnt',
            params: params
        }, baseToDo);
    },
    createEntDetailInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_EditEnt',
            params: params
        }, baseToDo);
    },
    getEntDetailInfo: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_GetEntDetailInfo',
            params: params
        }, baseToDo);
    },
    getEntOperateLog: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_GetAllEntOperationLog',
            params: params
        }, baseToDo);
    },
    exportEntOperateLog: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_ExportAllEntOperationLog',
            params: params
        }, baseToDo);
    },
    exportEntList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_Ent/BZ_Ent_ExportEntSummaryList',
            params: params
        }, baseToDo);
    }
};
export default Service;