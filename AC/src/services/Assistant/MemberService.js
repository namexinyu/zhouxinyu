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

let MemberService = {
    GetMemberList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BA_Members/BA_MEMB_GetMemberList',
            params: params
        }, baseToDo);
    }
};
export default MemberService;