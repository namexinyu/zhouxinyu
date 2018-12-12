import createAction from 'ACTION/createAction';
import HeaderService from 'SERVICE/Broker/HeaderService';

function createAlarm(params) {
    return {
        promise: HeaderService.createAlarm(params)
    };
}

export default createAction(createAlarm);