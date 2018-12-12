import createAction from 'ACTION/createAction';
import MemberListService from 'SERVICE/Broker/MemberListService';

function setMemberBanPost(params) {
    return {
        promise: MemberListService.setMemberBanPost(params)
    };
}

export default createAction(setMemberBanPost);