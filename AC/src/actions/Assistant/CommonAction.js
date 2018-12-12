import createAction from 'ACTION/createAction';
import CommonService from 'SERVICE/Assistant/CommonService';

let action = Object.keys(CommonService).reduce((result, data) => {
    let action = (param) => ({
        promise: CommonService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;