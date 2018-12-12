import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Assistant/MemberDetailService';

let action = Object.keys(MemberDetailService).reduce((result, data) => {
    let action = (param) => ({
        promise: MemberDetailService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;