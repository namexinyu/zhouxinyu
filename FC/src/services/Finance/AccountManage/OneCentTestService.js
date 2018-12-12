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

export function queryTestDetails(params) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OneCentTest/FIN_OCT_QueryTestDetails',
        params: params
    }, baseToDo);
}

// 审核
export function adiutTestRecords(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OneCentTest/FIN_OCT_AdiutTestRecords',
        params: params
    }, callToDo(callback));
}

// 到账结果录入
export function testResultInput(params, callback) {
    return HttpRequest.post({
        url: env.api_url + '/FIN_OneCentTest/FIN_OCT_TestResultInput',
        params: params
    }, callToDo(callback));
}

export default {queryTestDetails, adiutTestRecords, testResultInput};
