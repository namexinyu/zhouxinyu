import createAction from 'ACTION/createAction';
import RemindService from 'SERVICE/Broker/RemindService';

function getRemindHistoryList(param) {
    return {
        promise: RemindService.getRemindHistoryList(param)
    };
}

export default createAction(getRemindHistoryList);