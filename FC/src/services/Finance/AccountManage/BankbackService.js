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

function callToDo(callback) {
    return {
        successDo: (res) => {
            callback({res: res.Data || {}});
        },
        errorDo: (err) => {
            callback({err: err.Desc});
        }
    };
}

export function queryBankBackList(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_QueryBankBackList',
        params: params
    }, baseToDo);
}

export function bankBackAgainPay(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_WodaLabor/FIN_WLB_BankBackAgainPay',
        params: params
    }, callToDo(callback));
}

export default {queryBankBackList, bankBackAgainPay};
