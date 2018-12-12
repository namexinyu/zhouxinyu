import createAction from 'ACTION/createAction';
import CallbackService from 'SERVICE/Broker/CallbackService';

function getCallBackBadgeList(param) {
    return {
        promise: CallbackService.getCallBackBadgeList(param)
    };
}

export default createAction(getCallBackBadgeList);