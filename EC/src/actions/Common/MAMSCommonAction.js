import createAction from 'ACTION/createAction';
import MAMSCommonService from 'SERVICE/Common/MAMSCommonService';

let action = Object.keys(MAMSCommonService).reduce((result, data) => {
    let action = (param) => ({
        promise: MAMSCommonService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;