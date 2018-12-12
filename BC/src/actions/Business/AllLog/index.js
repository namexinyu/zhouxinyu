import createAction from 'ACTION/createAction';
import LogService from 'SERVICE/Business/AllLog/index';

let action = Object.keys(LogService).reduce((result, data) => {
    let action = (param) => ({
        promise: LogService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;