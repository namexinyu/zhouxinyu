import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let FactoryCheckinService = {
    setFactoryCheckinData: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_FactoryWait/WD_BK_SignWaitInfo', params
        }, baseToDo);
    },
    getFactoryCheckinList: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_FactoryWait/WD_BK_QueryWaitInfo', params
        }, baseToDo);
    },
    callOCR: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_RecuritInfo/WD_RECU_IDCardOcrRecogna', params
        }, baseToDo);
    }
};

export default FactoryCheckinService;