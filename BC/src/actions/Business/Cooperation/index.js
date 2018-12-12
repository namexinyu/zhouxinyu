import createAction from 'ACTION/createAction';
import CooperationService from 'SERVICE/Business/Cooperation/index';

let action = Object.keys(CooperationService).reduce((result, data) => {
    let action = (param) => ({
        promise: CooperationService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;