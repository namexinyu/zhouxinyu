import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getSystemMessageCount(params) {
    return {
        promise: BrokerService.getSystemMessageCount(params)
    };
}

export default createAction(getSystemMessageCount);