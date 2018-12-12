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

let CommonService = {
    GetHubList: (p) => {
        let params = p || {
            EnableStatus: 0,
            Name: '',
            RecordIndex: 0,
            RecordSize: 999
        };
        return HttpRequest.post({
            url: API_URL + '/EC_AddrManage/EC_ADMA_GetHubList',
            params: params
        }, baseToDo);
    },
    GetBrokerSimpleList: (p) => {
        let params = p || {
            BrokerAccount: 0,
            NickName: ''
        };
        return HttpRequest.post({
            url: API_URL + '/BA_WorkSheet/BA_GetBrokerInfo',
            params: params
        }, baseToDo);
    }
};
export default CommonService;