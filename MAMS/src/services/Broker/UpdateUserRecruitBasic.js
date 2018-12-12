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

let updateUserRecruitBasic = {
    UpdateUserRecruit: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecruitBasic/BK_RB_UpdateUserRecruitBasic',
            params: params
        }, baseToDo);
    }
};
export default updateUserRecruitBasic;