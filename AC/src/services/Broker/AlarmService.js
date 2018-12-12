import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';
import openDialog from 'ACTION/Dialog/openDialog';
import closeDialog from 'ACTION/Dialog/closeDialog';

const API_URL = env.api_url;

let baseToDo = {
    successDo: (res) => res,
    errorDo: (res) => res
};

let AlarmService = {
    // 获取头部闹钟列表 未到期
    reminderGet: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderGet', params
        }, baseToDo);
    },
    // 获取头部闹钟列表 已到期
    reminderGetPast: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderGetPast', params
        }, baseToDo);
    },
    // 删除闹钟
    deleteAlarm: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderMyPeople_Delete',
            params: params || {}
        }, baseToDo);
    },
    // 标记头部闹钟已读
    reminderMarkAsRead: (params = {}) => {
        return HttpRequest.post({
            url: API_URL + '/BK_Header/WD_HEADER_ReminderMarkAsRead', params
        }, baseToDo);
    }
};

export default AlarmService;