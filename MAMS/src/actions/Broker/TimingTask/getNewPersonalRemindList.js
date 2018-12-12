import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Broker/BrokerService';

function getNewPersonalRemindList(params) {
    return {
        promise: BrokerService.getNewPersonalRemindList(params)
    };
}

export default createAction(getNewPersonalRemindList);