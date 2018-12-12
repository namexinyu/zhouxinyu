import createAction from 'ACTION/createAction';
import BelongingSplitService from 'SERVICE/Assistant/BelongingSplitService';

let action = Object.keys(BelongingSplitService).reduce((result, data) => {
    let action = (param) => ({
        promise: BelongingSplitService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;
