import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberEstimatedApplyList(params) {
    return {
        promise: MemberDetailService.getMemberEstimatedApplyList(params)
    };
}

export default createAction(getMemberEstimatedApplyList);