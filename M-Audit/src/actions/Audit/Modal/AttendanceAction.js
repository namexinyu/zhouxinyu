import createAction from 'ACTION/createAction';
import AttendanceService from 'SERVICE/Audit/Modal/AttendanceService';

let action = Object.keys(AttendanceService).reduce((result, data) => {
    let action = (param) => ({
        promise: AttendanceService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;