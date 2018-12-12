import createAction from 'ACTION/createAction';
import getTransferMoneyData from 'SERVICE/Finance/AccountManage/TransferMoney';

function getTransferMoneyList(params) {
    return {
        promise: getTransferMoneyData.getTransferMoney(params)
    };
};

if (!__PROD__) {
    getTransferMoneyList.actionType = __filename;
};

export default createAction(getTransferMoneyList);