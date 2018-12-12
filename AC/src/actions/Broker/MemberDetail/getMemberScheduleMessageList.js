import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberScheduleMessageList(params) {
    return {
        promise: MemberDetailService.getMemberScheduleMessageList(params)
    };
}

export default createAction(getMemberScheduleMessageList);