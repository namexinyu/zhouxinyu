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

let getDepartAllEmpNameService = {
    getDepartAllEmpName: (params) => {
        return HttpRequest.post({
            url: API_URL + '/EC_ResourceManager/WD_RMAN_GetDepartAllEmpName',
            params: params
        }, baseToDo);
    }
};
export default getDepartAllEmpNameService;