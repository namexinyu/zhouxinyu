import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/ExpCenter/BrokerService';

function getBrokerFilterList(param) {
    return {
        promise: BrokerService.getBrokerFilterList(param)
    };
}

export default createAction(getBrokerFilterList);