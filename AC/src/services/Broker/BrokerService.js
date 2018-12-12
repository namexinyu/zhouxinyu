import HttpRequest from 'REQUEST';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";

import env from 'CONFIG/envs';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => {
        closeDialog('spinner');
        return res;
    },
    errorDo: (res) => {
        closeDialog('spinner');
        return res;
    }
};
let baseToDoNoSpinner = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        return res;
    }
};
let BrokerService = {
    // 经纪人信息
    getBrokerInfo: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetBrokerInfo',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 红绿榜信息
    getBrokerLevel: (params) => {
        return HttpRequest.post({
            // url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetBrokerLevel',
            url: API_URL + '/BK_BrokerMonthScore/BK_GetBrokerMonthScore',
            params: params || {EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId')}
        }, baseToDoNoSpinner, {ignoreBrokerID: true});
    },
    // 系统消息
    getSystemMessageCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetSystemMsgCount',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 自定义提醒
    getPersonalRemindCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetPersonRemindCount',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 提醒
    getRemindCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetRemindCount',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 未操作资源数量
    getResourceCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetResourceCount',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 待办数量
    getWaitCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetWaitCount',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 考试信息
    getExamCount: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Exam/BK_User_GetCountdown',
            params: params || {}
        }, baseToDoNoSpinner);
    },
    // 取最新的个人提醒记录列表
    getNewPersonalRemindList: (params) => {
        return HttpRequest.post({
            url: API_URL + '/BK_BrokerLogin/WD_BLGN_GetRemindList',
            params: params || {}
        }, baseToDoNoSpinner);
    }
};
export default BrokerService;