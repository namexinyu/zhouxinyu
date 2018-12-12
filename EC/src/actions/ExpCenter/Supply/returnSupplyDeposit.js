import createAction from 'ACTION/createAction';
import SupplyService from 'SERVICE/ExpCenter/SupplyService';

function returnSupplyDeposit(param) {
    return {
        promise: SupplyService.returnSupplyDeposit(param)
    };
}

export default createAction(returnSupplyDeposit);