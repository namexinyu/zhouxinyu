import createAction from 'ACTION/createAction';
import UGCService from 'SERVICE/Business/UGC';

let action = Object.keys(UGCService).reduce((result, data) => {
    let action = (param) => ({
        promise: UGCService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;