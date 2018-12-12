import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Broker/CallbackService';

function getCallBackInterviewList(param) {
    return {
        promise: CallbackService.getCallBackInterviewList(param)
    };
}

export default createAction(getCallBackInterviewList);