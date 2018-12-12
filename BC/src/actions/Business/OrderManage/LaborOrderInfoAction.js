import createAction from 'ACTION/createAction';
import LaborOrderInfoService from 'SERVICE/Business/OrderManage/LaborOrderInfoService';

let action = Object.keys(LaborOrderInfoService).reduce((result, data) => {
    let action = (param) => ({
        promise: LaborOrderInfoService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;