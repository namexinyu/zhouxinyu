import createAction from 'ACTION/createAction';
import DepartgroupManageService from 'SERVICE/Assistant/DepartgroupManageService';

let action = Object.keys(DepartgroupManageService).reduce((result, data) => {
    let action = (param) => ({
        promise: DepartgroupManageService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;