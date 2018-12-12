import createAction from 'ACTION/createAction';
import getTodaySignListData from 'SERVICE/Broker/TodaySign';

function getTodaySignData(params) {
    return {
        promise: getTodaySignListData.getTodaySign(params)
    };
};

if (!__PROD__) {
    getTodaySignData.actionType = __filename;
};

export default createAction(getTodaySignData);