import createAction from 'ACTION/createAction';
import AlarmService from 'SERVICE/Broker/AlarmService';

let action = Object.keys(AlarmService).reduce((result, data) => {
    let action = (param) => ({
        promise: AlarmService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;