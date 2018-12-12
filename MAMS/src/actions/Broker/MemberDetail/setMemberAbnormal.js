import createAction from 'ACTION/createAction';
import MemberListService from 'SERVICE/Broker/MemberListService';

function setMemberAbnormal(params) {
    return {
        promise: MemberListService.setMemberAbnormal(params)
    };
}

export default createAction(setMemberAbnormal);