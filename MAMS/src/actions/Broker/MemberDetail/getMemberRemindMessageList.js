import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberRemindMessageList(params) {
    return {
        promise: MemberDetailService.getMemberRemindMessageList(params)
    };
}

export default createAction(getMemberRemindMessageList);