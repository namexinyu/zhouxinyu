import createAction from 'ACTION/createAction';
import SupplyService from 'SERVICE/ExpCenter/SupplyService';

function getSupplyReleaseList(param) {
    return {
        promise: SupplyService.getSupplyReleaseList(param)
    };
}

export default createAction(getSupplyReleaseList);