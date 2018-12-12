import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberContactRecord(params) {
    return {
        promise: MemberDetailService.getMemberContactRecord(params)
    };
}

export default createAction(getMemberContactRecord);