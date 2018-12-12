import createAction from 'ACTION/createAction';
import getPreCountData from 'SERVICE/ExpCenter/PreCount';

function getPreCountList(params) {
    return {
        promise: getPreCountData.getPreCount(params)
    };
};

if (!__PROD__) {
    getPreCountList.actionType = __filename;
};

export default createAction(getPreCountList);