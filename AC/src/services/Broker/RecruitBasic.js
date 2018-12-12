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

let getRecruitBasicService = {
    RecruitBasic: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_GatherRecruitBasic',
            params: params
        }, baseToDo);
    }
};
export default getRecruitBasicService;