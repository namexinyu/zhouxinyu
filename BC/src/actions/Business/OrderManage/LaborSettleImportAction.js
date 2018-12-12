import createAction from 'ACTION/createAction';
import LaborSettleImportService from 'SERVICE/Business/OrderManage/LaborSettleImportService';

let action = Object.keys(LaborSettleImportService).reduce((result, data) => {
    let action = (param) => ({
        promise: LaborSettleImportService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;