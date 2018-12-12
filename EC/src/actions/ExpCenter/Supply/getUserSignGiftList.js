import createAction from 'ACTION/createAction';
import SupplyService from 'SERVICE/ExpCenter/SupplyService';

function getUserSignGiftList(param) {
    return {
        promise: SupplyService.getUserSignGiftList(param)
    };
}

export default createAction(getUserSignGiftList);