import createAction from 'ACTION/createAction';
import ReconciliationManageService from 'SERVICE/Finance/ReconciliationManage';

let action = Object.keys(ReconciliationManageService).reduce((result, data) => {
    let action = (param) => ({
        promise: ReconciliationManageService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;