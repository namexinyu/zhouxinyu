import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberEnrollRecord(params) {
    return {
        promise: MemberDetailService.getMemberEnrollRecord(params)
    };
}

export default createAction(getMemberEnrollRecord);
