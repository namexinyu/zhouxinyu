import createAction from 'ACTION/createAction';
import RemindService from 'SERVICE/Broker/RemindService';

function getBirthDayRemindList(param) {
    return {
        promise: RemindService.getBirthDayRemindList(param)
    };
}

export default createAction(getBirthDayRemindList);