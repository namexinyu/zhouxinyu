import createAction from 'ACTION/createAction';
import getDriverPickData from 'SERVICE/ExpCenter/DriverPick';

function getDriverPickList(params) {
    return {
        promise: getDriverPickData.getDriverPick(params)
    };
};

if (!__PROD__) {
    getDriverPickList.actionType = __filename;
};

export default createAction(getDriverPickList);