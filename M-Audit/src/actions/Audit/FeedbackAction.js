import createAction from 'ACTION/createAction';
import FeedbackService from 'SERVICE/Audit/FeedbackService';

let action = Object.keys(FeedbackService).reduce((result, data) => {
    let action = (param) => ({
        promise: FeedbackService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;