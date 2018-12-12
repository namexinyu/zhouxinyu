import createAction from 'ACTION/createAction';
import DailyService from 'SERVICE/Assistant/DailyService';

let action = Object.keys(DailyService).reduce((result, data) => {
    let action = (param) => ({
        promise: DailyService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;