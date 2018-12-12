import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function renewMemberApply(params) {
    return {
        promise: MemberDetailService.renewMemberApply(params)
    };
}

export default createAction(renewMemberApply);