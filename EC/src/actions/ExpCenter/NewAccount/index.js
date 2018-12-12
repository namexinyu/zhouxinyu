import createAction from 'ACTION/createAction';
import getNewAccountData from 'SERVICE/ExpCenter/NewAccount';

function getNewAccountList(params) {
    return {
        promise: getNewAccountData.getNewAccount(params)
    };
};

if (!__PROD__) {
    getNewAccountList.actionType = __filename;
};

export default createAction(getNewAccountList);