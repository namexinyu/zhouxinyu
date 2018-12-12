import createAction from 'ACTION/createAction';
import StaffManageService from 'SERVICE/Business/StaffManage/index';

let action = Object.keys(StaffManageService).reduce((result, data) => {
    let action = (param) => ({
        promise: StaffManageService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;