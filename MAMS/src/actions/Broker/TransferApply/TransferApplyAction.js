import createAction from 'ACTION/createAction';
import TransferApplyService from 'SERVICE/Broker/TransferApplyService';

let action = Object.keys(TransferApplyService).reduce((result, data) => {
    let action = (param) => ({
        promise: TransferApplyService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;