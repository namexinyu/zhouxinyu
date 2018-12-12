import createAction from 'ACTION/createAction';
import DepartGroupService from 'SERVICE/Common/DepartGroupService';

let action = Object.keys(DepartGroupService).reduce((result, data) => {
    let action = (param) => ({
        promise: DepartGroupService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;