import HttpRequest from 'REQUEST';
import env from 'CONFIG/envs';

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
    // 发布事件接口
    getEventEntry: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_JJZX_AddEvent',
            params: params
        }, baseToDo);
    },
    // 获取事件列表
    getEventList: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_COM_QueryEventList',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 查询事件详情
    getEventdetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_COM_QueryEvent',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 修改事件分类
    modifyEventType: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_ChoseEventType',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 事件回复
    replyEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_ReplyEvent',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    // 事件处理完毕
    endingEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_EndEvent',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    getDayEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_DayEvent',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    getDayService: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_DayService',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    exportDayService: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_EXCEL_DayService',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    getModOnDuty: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_ModOnDuty',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    getMoveEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_MoveEvent',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    getQueryOnDuty: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_QueryOnDuty',
            params: params
        }, baseToDo, {EmployeeMapID: true});
    },
    getReplyEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_ReplyEvent',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    },
    getQueryEvents: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_JJZX_QueryEvents',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    },
    getQueryEvent: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_JJZX_QueryEvent',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    },
    // 保存事件查询详情
    saveQueryEventDetail: (params) => {
        return HttpRequest.post({
            url: env.api_url + '/BK_Event/BK_WJG_ModEvent',
            params: params || {}
        }, baseToDo, {EmployeeMapID: true});
    }
};
export default Service;