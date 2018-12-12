import createAction from 'ACTION/createAction';
import getAddDriverData from 'SERVICE/ExpCenter/AddDriver';

function getAddDriverList(params) {
    return {
        promise: getAddDriverData.getAddDriver(params)
    };
};

if (!__PROD__) {
    getAddDriverList.actionType = __filename;
};

export default createAction(getAddDriverList);