import createAction from 'ACTION/createAction';
import RemindService from 'SERVICE/Broker/RemindService';

function setRemindDeleted(param) {
    return {
        promise: RemindService.setRemindReaded(param),
        payload: param
    };
}

export default createAction(setRemindDeleted);