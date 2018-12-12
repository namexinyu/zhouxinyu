import createAction from 'ACTION/createAction';
import BankbackService from 'SERVICE/Finance/AccountManage/BankbackService';

export default Object.keys(BankbackService).reduce((result, data) => {
    let action = (param, callback) => ({
        promise: BankbackService[data](param, callback)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});