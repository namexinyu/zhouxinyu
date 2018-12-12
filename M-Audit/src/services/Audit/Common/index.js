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
let Service = {
    getEnterpriseSimpleList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BZ_RecruitManager/BZ_RCMA_GetEnterpriseList',
            params: params
        }, baseToDo);
    }
};
export default Service;