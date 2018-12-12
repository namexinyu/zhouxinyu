import createAction from 'ACTION/createAction';
import BillService from 'SERVICE/ExpCenter/BillService';

let action = Object.keys(BillService).reduce((result, data) => {
    let action = (param) => ({
        promise: BillService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;