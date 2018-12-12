import createAction from 'ACTION/createAction';
import getRechargeLaborAccountData from 'SERVICE/Finance/AccountManage/RechargeLaborAccount';

function getRechargeLaborAccountList(params) {
    return {
        promise: getRechargeLaborAccountData.getRechargeLaborAccount(params)
    };
};

if (!__PROD__) {
    getRechargeLaborAccountList.actionType = __filename;
};

export default createAction(getRechargeLaborAccountList);