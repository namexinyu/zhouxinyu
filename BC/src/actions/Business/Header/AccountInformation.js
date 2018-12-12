import createAction from 'ACTION/createAction';
import HeaderService from 'SERVICE/Business/Header';

let action = Object.keys(HeaderService).reduce((result, data) => {
    let action = (param) => ({
        promise: HeaderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;