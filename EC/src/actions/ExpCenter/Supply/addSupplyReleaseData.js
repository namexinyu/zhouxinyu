import createAction from 'ACTION/createAction';
import SupplyService from 'SERVICE/ExpCenter/SupplyService';

function addSupplyReleaseData(param) {
    return {
        promise: SupplyService.addSupplyReleaseData(param)
    };
}

export default createAction(addSupplyReleaseData);