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

let getBalanceDetailsService = {
    getBalanceDetails: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/FIN_WodaLabor/FIN_WLB_BalanceDetails',
            params: params
        }, baseToDo);
    }
};
export default getBalanceDetailsService;