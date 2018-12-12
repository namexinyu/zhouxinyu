import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};

let CallbackService = {
    getCallbackEntryList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_GetRecordList',
            params: params
        }, baseToDo);
    },
    getCallbackEntryListByUser: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_GetRecordList',
            params: params
        }, baseToDo);
    },
    getCallbackEntryNotDealNum: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_GetNotDealRecordNum',
            params: params
        }, baseToDo);
    },
    setCallbackEntryData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_SetInterviewStatus',
            params: params
        }, baseToDo);
    },
    setCallbackEntryDataByUser: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_SetInterviewStatus',
            params: params
        }, baseToDo);
    },
    WriteServiceRemark: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_WriteServiceRemark',
            params: params
        }, baseToDo);
    },
    getThreeCardStatus: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_QueryThreeCardStatus',
            params: params
        }, baseToDo);
    },
    // 获取回访状态详情
    getCallbackStatusDetail: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_GetReturnVisit',
            params: params
        }, baseToDo);
    },
    // 修改回访状态详情
    updateCallbackDetail: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_EntryVisit/AT_ENVI_MakeReturnVisit',
            params: params
        }, baseToDo);
    }
};
export default CallbackService;