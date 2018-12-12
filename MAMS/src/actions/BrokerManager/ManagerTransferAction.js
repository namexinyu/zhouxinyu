import createAction from 'ACTION/createAction';
import TransferService from 'SERVICE/BrokerManager/TransferService';

let action = Object.keys(TransferService).reduce((result, data) => {
    let action = (param) => ({
        promise: TransferService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;