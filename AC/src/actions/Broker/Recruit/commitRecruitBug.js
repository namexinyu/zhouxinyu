import createAction from 'ACTION/createAction';
import RecruitService from 'SERVICE/Broker/RecruitService';

function commitRecruitBug(param) {
    return {
        promise: RecruitService.commitRecruitBug(param)
    };
}

export default createAction(commitRecruitBug);