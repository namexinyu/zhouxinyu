import createAction from 'ACTION/createAction';
import AuditOperateService from 'SERVICE/Audit/AuditOperateService';

let action = Object.keys(AuditOperateService).reduce((result, data) => {
    let action = (param) => ({
        promise: AuditOperateService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;