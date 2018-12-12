import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function createMemberApply(params) {
    return {
        promise: MemberDetailService.createMemberApply(params)
    };
}

export default createAction(createMemberApply);