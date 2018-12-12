import createAction from 'ACTION/createAction';
import EnterpriseService from 'SERVICE/Business/Enterprise/index';

let action = Object.keys(EnterpriseService).reduce((result, data) => {
    let action = (param) => ({
        promise: EnterpriseService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;