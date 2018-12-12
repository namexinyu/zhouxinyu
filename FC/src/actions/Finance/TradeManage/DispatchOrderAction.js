import createAction from 'ACTION/createAction';
import DispatchOrderService from 'SERVICE/Finance/TradeManage/DispatchOrderService';

let action = Object.keys(DispatchOrderService).reduce((result, data) => {
    let action = (param) => ({
        promise: DispatchOrderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;