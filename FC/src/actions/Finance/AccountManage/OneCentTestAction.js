import createAction from 'ACTION/createAction';
import OneCentTestService from 'SERVICE/Finance/AccountManage/OneCentTestService';

export default Object.keys(OneCentTestService).reduce((result, data) => {
    let action = (param, callback) => ({
        promise: OneCentTestService[data](param, callback)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});