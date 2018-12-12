import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function modifyMemberApply(params) {
    return {
        promise: MemberDetailService.modifyMemberApply(params)
    };
}

export default createAction(modifyMemberApply);