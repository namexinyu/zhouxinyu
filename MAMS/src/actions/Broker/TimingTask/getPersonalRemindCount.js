import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getPersonalRemindCount(params) {
    return {
        promise: BrokerService.getPersonalRemindCount(params)
    };
}

export default createAction(getPersonalRemindCount);