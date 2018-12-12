import createAction from 'ACTION/createAction';
import Deposit from 'SERVICE/ExpCenter/Deposit';

function DepositList(param) {
    return {
        promise: Deposit.DepositData(param)
    };
}

export default createAction(DepositList);