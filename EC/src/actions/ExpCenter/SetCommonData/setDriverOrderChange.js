import createAction from 'ACTION/createAction';
import setDriverOrderChangeData from 'SERVICE/ExpCenter/DriverOrderChange';

function getDriverOrderChangeList(params) {
    return {
        promise: setDriverOrderChangeData.getDriverOrderChange(params)
    };
};

if (!__PROD__) {
    getDriverOrderChangeList.actionType = __filename;
};

export default createAction(getDriverOrderChangeList);