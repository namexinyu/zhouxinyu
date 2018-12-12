import createAction from 'ACTION/createAction';
import TodaySignService from 'SERVICE/Business/TodaySign';

let action = Object.keys(TodaySignService).reduce((result, data) => {
    let action = (param) => ({
        promise: TodaySignService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_SGIN_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;