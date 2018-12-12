import createAction from 'ACTION/createAction';
import RemindService from 'SERVICE/Broker/RemindService';

function getRemindUnReadList(param) {
    return {
        promise: RemindService.getRemindUnReadList(param)
    };
}

export default createAction(getRemindUnReadList);