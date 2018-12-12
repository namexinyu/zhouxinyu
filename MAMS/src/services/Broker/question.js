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

let questionService = {
    question: (params) => {
        return HttpRequest.post({
            url: API_URL + '/UserAsk/WD_UASK_ListUserAsk',
            params: params
        }, baseToDo);
    },
    answer: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Members/WD_MEMB_ReplyKAAnswer',
            params: params
        }, baseToDo);
    }
};
export default questionService;