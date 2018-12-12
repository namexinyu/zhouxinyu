import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function setMemberBaseInfo(params) {
    return {
        promise: MemberDetailService.setMemberBaseInfo(params)
    };
}

export default createAction(setMemberBaseInfo);