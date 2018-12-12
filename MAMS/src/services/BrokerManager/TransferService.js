import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let TransferService = {
    mtGetCurrentBroker: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ChangeBroker/WD_CBRO_GetCurrentBroker',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    mtChangeBroker: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ChangeBroker/WD_CBRO_ChangeBroker',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    // ChangeBroker/WD_CBRO_GetCurrentBroker
    mtGetTransferLogList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ChangeBroker/WD_CBRO_GetChangeBrokerList',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    },
    // ChangeBroker/WD_CBRO_GetEmployeeList
    mtGetEmployeeSimpleList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ChangeBroker/WD_CBRO_GetEmployeeList',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    }
};

export default TransferService;