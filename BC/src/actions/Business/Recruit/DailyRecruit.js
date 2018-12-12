import createAction from 'ACTION/createAction';
import DailyRecruitService from 'SERVICE/Business/Recruitment/DailyRecruit';

export default Object.keys(DailyRecruitService).reduce((result, data) => {
    let action = (param) => ({
        promise: DailyRecruitService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});