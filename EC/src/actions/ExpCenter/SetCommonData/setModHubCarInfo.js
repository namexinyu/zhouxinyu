import createAction from 'ACTION/createAction';
import getModHubCarInfoData from 'SERVICE/ExpCenter/ModHubCarInfo';

function getModHubCarInfoList(params) {
    return {
        promise: getModHubCarInfoData.getModHubCarInfo(params)
    };
};

if (!__PROD__) {
    getModHubCarInfoList.actionType = __filename;
};

export default createAction(getModHubCarInfoList);