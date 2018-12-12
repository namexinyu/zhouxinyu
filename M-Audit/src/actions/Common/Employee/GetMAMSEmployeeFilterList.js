import createAction from 'ACTION/createAction';
import MAMSEmployeeService from 'SERVICE/Common/MAMSEmployeeService';

function GetMAMSEmployeeFilterList(param) {
    return {
        promise: MAMSEmployeeService.GetMAMSEmployeeFilterList(param)
    };
}

export default createAction(GetMAMSEmployeeFilterList);