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
let RecruitmentCheckService = {


    getList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_GetAuditQuoteList',
            params: params
        }, baseToDo);
    },

    setCheckStatus: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BZ_RecruitInfo/BZ_RCIF_AuditQuote',
            params: params
        }, baseToDo);
    }

};
export default RecruitmentCheckService;