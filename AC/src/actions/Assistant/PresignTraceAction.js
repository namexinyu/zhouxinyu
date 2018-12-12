import createAction from 'ACTION/createAction';
import PresignTraceService from 'SERVICE/Assistant/PresignTraceService';

let action = Object.keys(PresignTraceService).reduce((result, data) => {
    let action = (param) => ({
        promise: PresignTraceService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;
