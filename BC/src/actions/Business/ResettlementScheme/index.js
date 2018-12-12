import createAction from 'ACTION/createAction';
import ResettlementScheme from 'SERVICE/Business/ResettlementScheme/index';

let action = Object.keys(ResettlementScheme).reduce((result, data) => {
    let action = (param) => ({
        promise: ResettlementScheme[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;