import createAction from 'ACTION/createAction';
import getLaborAccountData from 'SERVICE/Finance/AccountManage/LaborAccount';

function getLaborAccountList(params) {
    return {
        promise: getLaborAccountData.getLaborAccount(params)
    };
};

if (!__PROD__) {
    getLaborAccountList.actionType = __filename;
};

export default createAction(getLaborAccountList);