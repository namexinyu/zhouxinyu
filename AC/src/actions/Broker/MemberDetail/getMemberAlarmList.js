import createAction from 'ACTION/createAction';
import HeaderService from 'SERVICE/Broker/HeaderService';

function getMemberAlarmList(params) {
    return {
        promise: HeaderService.getMemberAlarmList(params)
    };
}

export default createAction(getMemberAlarmList);