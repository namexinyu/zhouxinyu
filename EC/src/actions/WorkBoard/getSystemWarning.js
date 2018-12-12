import createAction from 'ACTION/createAction';
import getSystemWarningData from 'SERVICE/WorkBoard/SystemWarning';

function getSystemWarningList(params) {
    return {
        promise: getSystemWarningData.getSystemWarning(params)
    };
};

if (!__PROD__) {
    getSystemWarningList.actionType = __filename;
};

export default createAction(getSystemWarningList);