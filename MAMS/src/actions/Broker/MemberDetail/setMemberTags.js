import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function setMemberTags(params) {
    return {
        promise: MemberDetailService.setMemberTags(params)
    };
}

export default createAction(setMemberTags);