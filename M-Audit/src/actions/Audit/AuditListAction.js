import createAction from 'ACTION/createAction';
import AuditListService from 'SERVICE/Audit/AuditListService';

let action = Object.keys(AuditListService).reduce((result, data) => {
    let action = (param) => ({
        promise: AuditListService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;