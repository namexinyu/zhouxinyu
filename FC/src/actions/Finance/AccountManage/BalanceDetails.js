import createAction from 'ACTION/createAction';
import getBalanceDetailsData from 'SERVICE/Finance/AccountManage/BalanceDetails';

function getBalanceDetailsList(params) {
    return {
        promise: getBalanceDetailsData.getBalanceDetails(params)
    };
};

if (!__PROD__) {
    getBalanceDetailsList.actionType = __filename;
};

export default createAction(getBalanceDetailsList);