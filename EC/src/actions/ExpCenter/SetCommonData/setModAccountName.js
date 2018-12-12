import createAction from 'ACTION/createAction';
import getModAccountNameData from 'SERVICE/ExpCenter/ModAccountName';

function getModAccountNameList(params) {
    return {
        promise: getModAccountNameData.getModAccountName(params)
    };
};

if (!__PROD__) {
    getModAccountNameList.actionType = __filename;
};

export default createAction(getModAccountNameList);