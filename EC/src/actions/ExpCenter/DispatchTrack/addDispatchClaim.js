import createAction from 'ACTION/createAction';
import DispatchService from 'SERVICE/ExpCenter/DispatchService';

function addDispatchClaim(param) {
    return {
        promise: DispatchService.addDispatchClaim(param)
    };
}

export default createAction(addDispatchClaim);