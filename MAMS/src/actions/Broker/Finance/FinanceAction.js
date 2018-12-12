import createAction from 'ACTION/createAction';
import FinanceService from 'SERVICE/Broker/FinanceService';

let action = Object.keys(FinanceService).reduce((result, data) => {
    let action = (param) => ({
        promise: FinanceService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;
