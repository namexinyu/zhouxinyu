import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getResourceCount(params) {
    return {
        promise: BrokerService.getResourceCount(params)
    };
}

export default createAction(getResourceCount);