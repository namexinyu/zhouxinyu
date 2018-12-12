import createAction from 'ACTION/createAction';
import getPriceAllocationData from 'SERVICE/ExpCenter/PriceAllocation';

function getPriceAllocationList(params) {
    return {
        promise: getPriceAllocationData.getPriceAllocation(params)
    };
};

if (!__PROD__) {
    getPriceAllocationList.actionType = __filename;
};

export default createAction(getPriceAllocationList);