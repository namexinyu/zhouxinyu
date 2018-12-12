import createAction from 'ACTION/createAction';
import HeaderService from 'SERVICE/Broker/HeaderService';

function deleteAlarm(params) {
    return {
        promise: HeaderService.deleteAlarm(params)
    };
}

export default createAction(deleteAlarm);
