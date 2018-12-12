import createAction from 'ACTION/createAction';
import InterviewNameListService from 'SERVICE/Business/OrderManage/InterviewNameListService';

let action = Object.keys(InterviewNameListService).reduce((result, data) => {
    let action = (param) => ({
        promise: InterviewNameListService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;