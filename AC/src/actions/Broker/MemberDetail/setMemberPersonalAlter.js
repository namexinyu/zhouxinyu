import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function setMemberPersonalAlter(params) {
    return {
        promise: MemberDetailService.setMemberPersonalAlter(params)
    };
}

export default createAction(setMemberPersonalAlter);