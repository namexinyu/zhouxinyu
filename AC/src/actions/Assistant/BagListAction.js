import createAction from 'ACTION/createAction';
import BagListService from 'SERVICE/Assistant/BagListService';

let action = Object.keys(BagListService).reduce((result, data) => {
    let action = (param) => ({
        promise: BagListService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;
