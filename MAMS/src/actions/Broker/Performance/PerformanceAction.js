import createAction from 'ACTION/createAction';
import PerformanceService from 'SERVICE/Broker/PerformanceService';

let action = Object.keys(PerformanceService).reduce((result, data) => {
    let action = (param) => ({
        promise: PerformanceService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;