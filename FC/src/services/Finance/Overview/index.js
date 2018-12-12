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

export function financeOverview(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OrderSettle/FIN_OS_FinanceOverview',
        params: params
    }, callToDo(callback));
}