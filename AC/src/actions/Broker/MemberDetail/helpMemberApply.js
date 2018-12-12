import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function helpMemberApply(params) {
    return {
        promise: MemberDetailService.helpMemberApply(params)
    };
}

export default createAction(helpMemberApply);