import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberInterviewRecord(params) {
    return {
        promise: MemberDetailService.getMemberInterviewRecord(params)
    };
}

export default createAction(getMemberInterviewRecord);
