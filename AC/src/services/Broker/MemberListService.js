import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
        return res;
    }
};
let MemberListService = {
    getMemberList: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_GetMemberList',
            params: params || {}
        }, baseToDo);
    },
    setMemberAbnormal: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetMemberAbnormal',
            params: params || {}
        }, baseToDo);
    },
    setMemberBanPost: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_SetMemberBanPost',
            params: params || {}
        }, baseToDo);
    },
    helpMemberRegister: (params) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_RegisterAgent',
            params: params || {}
        }, baseToDo);
    }
};
export default MemberListService;