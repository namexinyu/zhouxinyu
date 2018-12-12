import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getWaitCount(params) {
    return {
        promise: BrokerService.getWaitCount(params)
    };
}

export default createAction(getWaitCount);