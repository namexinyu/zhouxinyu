import createAction from 'ACTION/createAction';
import InviteOrderService from 'SERVICE/Finance/TradeManage/InviteOrderService';

let action = Object.keys(InviteOrderService).reduce((result, data) => {
    let action = (param) => ({
        promise: InviteOrderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;