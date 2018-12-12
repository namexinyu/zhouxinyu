import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getBrokerLevel(params) {
    return {
        promise: BrokerService.getBrokerLevel(params)
    };
}

export default createAction(getBrokerLevel);