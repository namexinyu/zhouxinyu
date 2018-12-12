import createAction from 'ACTION/createAction';
import MAMSRecruitService from 'SERVICE/Common/MAMSRecruitService';

let action = Object.keys(MAMSRecruitService).reduce((result, data) => {
    let action = (param) => ({
        promise: MAMSRecruitService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;