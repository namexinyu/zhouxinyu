import createAction from 'ACTION/createAction';
import LaborOrderService from 'SERVICE/Finance/TradeManage/LaborOrderService';

let action = Object.keys(LaborOrderService).reduce((result, data) => {
    let action = (param) => ({
        promise: LaborOrderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;