import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function GetDepartEntrustList(param) {
    return {
        promise: AssistanceService.GetDepartEntrustList(param)
    };
}

export default createAction(GetDepartEntrustList);