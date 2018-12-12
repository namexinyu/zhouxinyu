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

let tmpParams = {
    BrokerID: 7,
    RecordIndex: 1,
    RecordSize: 10
};

let RemindService = {
    getRemindUnReadList: (params = {}) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_Remind/WD_MEMBER_Remind',
            params: params
        }, baseToDo);
    },
    setRemindReaded: (params = {}) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_Remind/WD_MEMBER_UPnews',
            params: params
        }, baseToDo);
    },
    getRemindHistoryList: (params = {}) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_Remind/WD_MEMBER_Remind',
            params: params
        }, baseToDo);
    },
    getBirthDayRemindList: (params = {}) => {
        openDialog({id: 'spinner', type: 'spinner'});
        return HttpRequest.post({
            url: API_URL + '/BK_Remind/WD_Brithday_Remind',
            params: params
        }, baseToDo, {ignoreBrokerID: true});
    }
};
export default RemindService;