import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Broker/CallbackService';

function updateInterviewReply(tmpReplyObj) {
    return {
        payload: {
            tmpReplyObj: tmpReplyObj
        }
    };
}

export default createAction(updateInterviewReply);