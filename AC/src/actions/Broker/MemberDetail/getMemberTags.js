import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberTags(params) {
    return {
        promise: MemberDetailService.getMemberTags(params)
    };
}

export default createAction(getMemberTags);