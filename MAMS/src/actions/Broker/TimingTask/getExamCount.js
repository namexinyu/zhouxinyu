import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getExamCount(params) {
    return {
        promise: BrokerService.getExamCount(params)
    };
}

export default createAction(getExamCount);