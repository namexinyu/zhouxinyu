import createAction from 'ACTION/createAction';
import GiftFeeService from 'SERVICE/Finance/TradeManage/GiftFeeService';

let action = Object.keys(GiftFeeService).reduce((result, data) => {
    let action = (param) => ({
        promise: GiftFeeService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;