import createAction from 'ACTION/createAction';
import removeMobile from 'SERVICE/Assistant/removeMobile';

let action = Object.keys(removeMobile).reduce((result, data) => {
    let action = (param) => ({
        promise: removeMobile[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;