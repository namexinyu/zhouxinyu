import createAction from 'ACTION/createAction';
import getWeekData from 'SERVICE/Broker/getWeekData';

function getWeekDataList(params) {
    return {
        promise: getWeekData.getWeekData(params)
    };
};

if (!__PROD__) {
    getWeekDataList.actionType = __filename;
};

export default createAction(getWeekDataList);