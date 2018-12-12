import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function SetReplyReadStatus(param) {
    return {
        promise: AssistanceService.SetReplyReadStatus(param)
    };
}

export default createAction(SetReplyReadStatus);