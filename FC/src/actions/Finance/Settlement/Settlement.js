import createAction from 'ACTION/createAction';
import Settlement from 'SERVICE/Finance/Settlement/Settlement';
let action = Object.keys(Settlement).reduce((result, data) => {
    let action = (param, payload) => ({
        promise: Settlement[data](param),
        payload: payload
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;