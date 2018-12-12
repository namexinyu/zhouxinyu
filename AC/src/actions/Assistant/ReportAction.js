import createAction from 'ACTION/createAction';
import ReportService from 'SERVICE/Assistant/ReportService';

let action = Object.keys(ReportService).reduce((result, data) => {
    let action = (param) => ({
        promise: ReportService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;