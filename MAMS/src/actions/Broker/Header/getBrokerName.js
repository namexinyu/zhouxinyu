import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getBrokerName(params) {
    return {
        promise: BrokerService.getBrokerInfo(params)
    };
}

export default createAction(getBrokerName);