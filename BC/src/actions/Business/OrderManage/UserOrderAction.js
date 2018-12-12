import createAction from 'ACTION/createAction';
import UserOrderService from 'SERVICE/Business/OrderManage/UserOrderService';

let action = Object.keys(UserOrderService).reduce((result, data) => {
    let action = (param) => ({
        promise: UserOrderService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;