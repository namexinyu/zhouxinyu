import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function replyFeedback(params) {
    return {
        promise: MemberDetailService.replyFeedback(params)
    };
}

export default createAction(replyFeedback);