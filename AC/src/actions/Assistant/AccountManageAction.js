import createAction from 'ACTION/createAction';
import AccountManageService from 'SERVICE/Assistant/AccountManageService';

let action = Object.keys(AccountManageService).reduce((result, data) => {
    let action = (param) => ({
        promise: AccountManageService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;