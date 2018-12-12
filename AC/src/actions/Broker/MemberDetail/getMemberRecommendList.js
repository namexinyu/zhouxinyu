import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberRecommendList(params) {
    return {
        promise: MemberDetailService.getMemberRecommendList(params)
    };
}

export default createAction(getMemberRecommendList);