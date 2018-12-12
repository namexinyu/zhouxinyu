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

let AttendanceService = {
    modalGetAttendanceData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_GetAuditRecord',
            params: params
        }, baseToDo);
    },
    modalAuditAttendanceData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_AuditRecord',
            params: params
        }, baseToDo);
    },
    modalModifyAttendanceData: (params) => {
        return HttpRequest.post({
            url: API_URL + '/AT_AuditAttendance/AT_ATAD_ModifyRecord',
            params: params
        }, baseToDo);
    }
};
export default AttendanceService;