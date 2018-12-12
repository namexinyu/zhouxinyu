import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberStatusRecord(params) {
    return {
        promise: MemberDetailService.getMemberStatusRecord(params)
    };
}

export default createAction(getMemberStatusRecord);