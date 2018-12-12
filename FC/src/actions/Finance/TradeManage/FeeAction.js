import createAction from 'ACTION/createAction';
import FeeService from 'SERVICE/Finance/TradeManage/FeeService';

let action = Object.keys(FeeService).reduce((result, data) => {
    let action = (param) => ({
        promise: FeeService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;