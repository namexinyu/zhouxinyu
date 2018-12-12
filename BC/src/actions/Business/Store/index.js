import createAction from 'ACTION/createAction';
import Store from 'SERVICE/Business/Store/index';

let action = Object.keys(Store).reduce((result, data) => {
    let action = (param) => ({
        promise: Store[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;