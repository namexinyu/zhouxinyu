import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function CloseDepartEntrust(param) {
    return {
        promise: AssistanceService.CloseDepartEntrust(param)
    };
}

export default createAction(CloseDepartEntrust);