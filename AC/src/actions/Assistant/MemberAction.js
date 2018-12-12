import createAction from 'ACTION/createAction';
import MemberService from 'SERVICE/Assistant/MemberService';

let action = Object.keys(MemberService).reduce((result, data) => {
    let action = (param) => ({
        promise: MemberService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;