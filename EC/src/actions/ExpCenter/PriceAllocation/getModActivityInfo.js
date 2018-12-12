import createAction from 'ACTION/createAction';
import getModActivityInfoData from 'SERVICE/ExpCenter/ModActivityInfo';

function getModActivityInfoList(params) {
    return {
        promise: getModActivityInfoData.getModActivityInfo(params)
    };
};

if (!__PROD__) {
    getModActivityInfoList.actionType = __filename;
};

export default createAction(getModActivityInfoList);