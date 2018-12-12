import createAction from 'ACTION/createAction';
import RecruitService from 'SERVICE/Broker/RecruitService';

function getRecruitList(param) {
    return {
        promise: RecruitService.getRecruitList(param)
    };
}

export default createAction(getRecruitList);