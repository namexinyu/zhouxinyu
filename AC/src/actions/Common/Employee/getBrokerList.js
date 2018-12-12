import createAction from 'ACTION/createAction';
import MAMSEmployeeService from 'SERVICE/Common/MAMSEmployeeService';

function getBrokerList(param) {
    return {
        promise: MAMSEmployeeService.getBrokerList(param)
    };
}

export default createAction(getBrokerList);