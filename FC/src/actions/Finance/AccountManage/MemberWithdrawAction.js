import createAction from 'ACTION/createAction';
import MemberWithdrawService from 'SERVICE/Finance/AccountManage/MemberWithdrawService';

export default Object.keys(MemberWithdrawService).reduce((result, data) => {
    let action = (param, callback) => ({
        promise: MemberWithdrawService[data](param, callback)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});