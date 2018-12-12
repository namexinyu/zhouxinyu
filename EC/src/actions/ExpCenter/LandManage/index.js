import createAction from 'ACTION/createAction';
import getLandManageData from 'SERVICE/ExpCenter/LandManage';

function getLandManageList(params) {
    return {
        promise: getLandManageData.getLandManage(params)
    };
};

if (!__PROD__) {
    getLandManageList.actionType = __filename;
};

export default createAction(getLandManageList);