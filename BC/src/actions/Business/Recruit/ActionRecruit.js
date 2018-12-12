import createAction from 'ACTION/createAction';
import RecruitService from 'SERVICE/Business/Recruitment/index';

let action = Object.keys(RecruitService).reduce((result, data) => {
    let action = (param) => ({
        promise: RecruitService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;