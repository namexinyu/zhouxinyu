import createAction from 'ACTION/createAction';
import InterviewSubsidyService from 'SERVICE/Finance/TradeManage/InterviewSubsidyService';

let action = Object.keys(InterviewSubsidyService).reduce((result, data) => {
    let action = (param) => ({
        promise: InterviewSubsidyService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;