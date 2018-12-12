import createAction from 'ACTION/createAction';
import CommonService from 'SERVICE/Common/index';

let action = Object.keys(CommonService).reduce((result, data) => {
    let action = (param) => ({
        promise: CommonService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;