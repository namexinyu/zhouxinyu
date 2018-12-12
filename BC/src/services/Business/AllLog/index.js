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
    getOperateLog: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/OpLogHelper/OpLogReader',
            params: params
        }, baseToDo);
    },
    exportOperateLog: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/OpLogHelper/OpLogExport',
            params: params
        }, baseToDo);
    }
};
export default Service;