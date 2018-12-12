import createAction from 'ACTION/createAction';
import BrokerService from 'SERVICE/Assistant/BrokerService';

let action = Object.keys(BrokerService).reduce((result, data) => {
    let action = (param) => ({
        promise: BrokerService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;