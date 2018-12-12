import createAction from 'ACTION/createAction';
import RecruitService from 'SERVICE/Broker/RecruitService';

function getMemberRecruitMatchInfo(param) {
    return {
        promise: RecruitService.getMemberRecruitMatchInfo(param)
    };
}

export default createAction(getMemberRecruitMatchInfo);