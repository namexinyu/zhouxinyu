import createAction from 'ACTION/createAction';
import ComplainOrderService from 'SERVICE/Finance/TradeManage/ComplainOrderService';

let action = Object.keys(ComplainOrderService).reduce((result, data) => {
    let action = (param) => ({
        promise: ComplainOrderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;