import createAction from 'ACTION/createAction';
import LaborInterviewImportService from 'SERVICE/Business/OrderManage/LaborInterviewImportService';

let action = Object.keys(LaborInterviewImportService).reduce((result, data) => {
    let action = (param) => ({
        promise: LaborInterviewImportService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;