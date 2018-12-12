import createAction from 'ACTION/createAction';
import PocketService from 'SERVICE/Broker/PocketService';

let action = Object.keys(PocketService).reduce((result, data) => {
    let action = (param) => ({
        promise: PocketService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;