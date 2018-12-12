import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberAccountRecord(params) {
    return {
        promise: MemberDetailService.getMemberAccountRecord(params)
    };
}

export default createAction(getMemberAccountRecord);