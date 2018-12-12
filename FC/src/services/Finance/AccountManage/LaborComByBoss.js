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

let getLaborComByBossService = {
    getLaborComByBoss: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_WodaLabor/FIN_WLB_QueryLaborComByBoss',
            params: params
        }, baseToDo);
    }
};
export default getLaborComByBossService;