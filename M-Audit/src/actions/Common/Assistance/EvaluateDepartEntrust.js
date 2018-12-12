import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function EvaluateDepartEntrust(param) {
    return {
        promise: AssistanceService.EvaluateDepartEntrust(param)
    };
}

export default createAction(EvaluateDepartEntrust);