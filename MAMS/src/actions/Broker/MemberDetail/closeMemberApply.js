import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function closeMemberApply(params) {
    return {
        promise: MemberDetailService.closeMemberApply(params)
    };
}

export default createAction(closeMemberApply);