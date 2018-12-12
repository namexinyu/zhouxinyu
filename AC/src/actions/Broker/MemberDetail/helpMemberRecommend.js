import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function helpMemberRecommend(params) {
    return {
        promise: MemberDetailService.helpMemberRecommend(params)
    };
}

export default createAction(helpMemberRecommend);