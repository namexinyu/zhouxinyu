import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberApplyInfo(params) {
    return {
        promise: MemberDetailService.getMemberApplyInfo(params)
    };
}

export default createAction(getMemberApplyInfo);