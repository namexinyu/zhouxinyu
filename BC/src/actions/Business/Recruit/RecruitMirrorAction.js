import createAction from 'ACTION/createAction';
import RecruitMirrorService from 'SERVICE/Business/Recruitment/RecruitMirror';

let action = Object.keys(RecruitMirrorService).reduce((result, data) => {
    let action = (param) => ({
        promise: RecruitMirrorService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;