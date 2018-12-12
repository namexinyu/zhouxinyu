import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getRemindCount(params) {
    return {
        promise: BrokerService.getRemindCount(params)
    };
}

export default createAction(getRemindCount);