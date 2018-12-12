import HttpRequest from 'REQUEST';

import env from 'CONFIG/envs';

const API_URL = env.api_url;


let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};

export default {
    getBagList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitSrv/WD_JJZX_ListRecruit',
            params: params
        }, baseToDo);
    },
    getRecruitBasicCount: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_GatherRecruitBasic',
            params: params
        }, baseToDo);
    }
};
