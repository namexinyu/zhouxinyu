import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberFollowedRecruitList(params) {
    return {
        promise: MemberDetailService.getMemberFollowedRecruitList(params)
    };
}

export default createAction(getMemberFollowedRecruitList);