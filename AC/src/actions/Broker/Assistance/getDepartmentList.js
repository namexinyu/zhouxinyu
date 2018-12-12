import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Broker/AssistanceService';

function getDepartmentList(param) {
    return {
        promise: AssistanceService.getDepartmentList(param)
    };
}

export default createAction(getDepartmentList);