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
let Service = {
    // 获取账户信息
    getAccountInformation: (params = {}) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Header/WD_HEADER_AccountInformationGet', params
        }, baseToDo);
    }
};
export default Service;