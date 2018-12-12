import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function ReplyDepartEntrust(param) {
    return {
        promise: AssistanceService.ReplyDepartEntrust(param)
    };
}

export default createAction(ReplyDepartEntrust);