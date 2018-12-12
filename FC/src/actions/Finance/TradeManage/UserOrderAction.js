import createAction from 'ACTION/createAction';
import UserOrderService from 'SERVICE/Finance/TradeManage/UserOrderService';

let action = Object.keys(UserOrderService).reduce((result, data) => {
    let action = (param) => ({
        promise: UserOrderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;