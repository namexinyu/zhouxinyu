import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Audit/CallbackService';

let action = Object.keys(CallbackService).reduce((result, data) => {
    let action = (param) => ({
        promise: CallbackService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;