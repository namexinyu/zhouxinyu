import createAction from 'ACTION/createAction';
import RecruitService from 'SERVICE/Broker/RecruitService';

function getRecruitNameList(param) {
    return {
        promise: RecruitService.getRecruitNameList(param)
    };
}

export default createAction(getRecruitNameList);