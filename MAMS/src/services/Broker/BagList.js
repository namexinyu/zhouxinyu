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

let getBagListService = {
    getBag: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitSrv/WD_JJZX_ListRecruit',
            params: params
        }, baseToDo);
    }
};
export default getBagListService;
