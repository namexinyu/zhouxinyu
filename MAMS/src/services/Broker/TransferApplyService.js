import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let TransferApplyService = {
    GetTransferApplyList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ChangeBroker/WD_CBRO_GetApplyChangeBrokerList',
            params: params
        }, baseToDo);
        // , {ignoreBrokerID: true}
    },
    CallTransferApply: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/ChangeBroker/WD_CBRO_ApplyChangeBroker',
            params: params
        }, baseToDo);
        // , {ignoreBrokerID: true}
    }
};

export default TransferApplyService;