import createAction from 'ACTION/createAction';
import getAddNewAccountData from 'SERVICE/ExpCenter/AddNewAccount';

function getAddNewAccountList(params) {
    return {
        promise: getAddNewAccountData.getAddNewAccount(params)
    };
};

if (!__PROD__) {
    getAddNewAccountList.actionType = __filename;
};

export default createAction(getAddNewAccountList);