import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Broker/CallbackService';

function setWorkingReply(param) {
    return {
        promise: CallbackService.setWorkingReply(param),
        payload: param
    };
}

export default createAction(setWorkingReply);