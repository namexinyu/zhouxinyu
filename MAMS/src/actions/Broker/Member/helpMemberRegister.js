import createAction from 'ACTION/createAction';
import MemberListService from 'SERVICE/Broker/MemberListService';

function helpMemberRegister(params) {
    return {
        promise: MemberListService.helpMemberRegister(params)
    };
}

export default createAction(helpMemberRegister);