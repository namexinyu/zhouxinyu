import createAction from 'ACTION/createAction';
import RecruitmentCheckService from 'SERVICE/Business/Recruitment/RecruitmentCheckService';

export default Object.keys(RecruitmentCheckService).reduce((result, data) => {
    let action = (param) => ({
        promise: RecruitmentCheckService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});