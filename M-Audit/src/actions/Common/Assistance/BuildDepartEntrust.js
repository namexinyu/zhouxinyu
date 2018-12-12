import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function BuildDepartEntrust(param) {
    return {
        promise: AssistanceService.BuildDepartEntrust(param)
    };
}

export default createAction(BuildDepartEntrust);