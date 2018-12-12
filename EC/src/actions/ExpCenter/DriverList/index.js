import createAction from 'ACTION/createAction';
import getDriverListData from 'SERVICE/ExpCenter/DriverList';

function getDriverListList(params) {
    return {
        promise: getDriverListData.getDriverList(params)
    };
};

if (!__PROD__) {
    getDriverListList.actionType = __filename;
};

export default createAction(getDriverListList);