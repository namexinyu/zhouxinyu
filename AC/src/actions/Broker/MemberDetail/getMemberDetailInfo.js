import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberDetailInfo(params) {
    return {
        promise: MemberDetailService.getMemberDetailInfo(params)
    };
}

export default createAction(getMemberDetailInfo);