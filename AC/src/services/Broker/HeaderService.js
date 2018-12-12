import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

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
    successDo: (res) => res,
    errorDo: (res) => res
};

let HeaderService = {
    // 获取头部账户信息
    accountInformationGet: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_AccountInformationGet', params
        }, baseToDoNoSpinner);
    },
    // 设置工作状态
    accountInformationSetStatus: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_AccountInformationSetStatus', params
        }, baseToDoNoSpinner);
    },
    // 获取头部闹钟列表 未到期
    reminderGet: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderGet', params
        }, baseToDo);
    },
    // 获取头部闹钟列表 已到期
    reminderGetPast: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderGetPast', params
        }, baseToDo);
    },
    getMemberAlarmList: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderMyPeople_Get',
            params: params || {}
        }, baseToDo);
    },
    deleteAlarm: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderMyPeople_Delete',
            params: params || {}
        }, baseToDo);
    },
    createAlarm: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderMyPeople_Create',
            params: params || {}
        }, baseToDo);
    },
    // 标记头部闹钟已读
    reminderMarkAsRead: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderMarkAsRead', params
        }, baseToDoNoSpinner);
    },
    // 获取头部系统消息列表
    systemMessageGet: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_SystemMessageGet', params
        }, baseToDo);
    },
    // 标记头部系统消息
    systemMessageMarkAsRead: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_SystemMessageMarkAsRead', params
        }, baseToDoNoSpinner);
    },
    // 取分配后无联系记录 需要Token
    GetNoHandleList: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_GetNoHandleList', params
        }, baseToDo);
    },
    // 取已处理记录 需要Token
    getHandledList: (params = {}) => {
        openDialog({
            id: 'spinner',
            type: 'spinner'
        });
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_GetHandledList', params
        }, baseToDo);
    },
    // 取可申请资源数 需要Token
    getAvaCount: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_GetAvaCount', params
        }, baseToDoNoSpinner);
    },
    // 申请资源 需要Token
    resourceApply: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_ResourceApply/WD_BRES_ResourceApply', params
        }, baseToDoNoSpinner);
    },
    getIPAddress: (params) => {
        return HttpRequest.get({
            url: 'http://api.map.baidu.com/location/ip?v=2.0&ak=utIIkRnygE6N0jTrsWNjksjVATGh4KrX&callback=init',
            params: params || {}
        }, baseToDoNoSpinner);
    }
};

export default HeaderService;