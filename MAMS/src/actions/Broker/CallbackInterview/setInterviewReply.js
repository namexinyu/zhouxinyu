import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Broker/CallbackService';

function setInterviewReply(param) {
    return {
        promise: CallbackService.setInterviewReply(param),
        payload: param
    };
}

export default createAction(setInterviewReply);