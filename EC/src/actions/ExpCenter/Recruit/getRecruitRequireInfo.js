import createAction from 'ACTION/createAction';
import RecruitService from 'SERVICE/ExpCenter/RecruitService';

function getRecruitRequireInfo(param) {
    return {
        promise: RecruitService.getRecruitRequireInfo(param)
    };
}

export default createAction(getRecruitRequireInfo);