import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Broker/CallbackService';

function getCallbackWorkingList(param) {
    return {
        promise: CallbackService.getCallbackWorkingList(param)
    };
}

export default createAction(getCallbackWorkingList);