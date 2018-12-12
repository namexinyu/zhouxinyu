import createAction from 'ACTION/createAction';
import InterviewImportService from 'SERVICE/Finance/TradeManage/InterviewImportService';

let action = Object.keys(InterviewImportService).reduce((result, data) => {
    let action = (param, payload) => ({
        promise: InterviewImportService[data](param),
        payload: payload
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;