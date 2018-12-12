import createAction from 'ACTION/createAction';
import getReimbursementData from 'SERVICE/ExpCenter/Reimbursement';

function getReimbursementList(params) {
    return {
        promise: getReimbursementData.getReimbursement(params)
    };
};

if (!__PROD__) {
    getReimbursementList.actionType = __filename;
};

export default createAction(getReimbursementList);