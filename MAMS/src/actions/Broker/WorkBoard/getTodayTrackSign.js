import createAction from 'ACTION/createAction';
import getTodayTrackSignData from 'SERVICE/Broker/getTodayTrackSign';

function getTodayTrackSignList(params) {
    return {
        promise: getTodayTrackSignData.getTodayTrackSign(params)
    };
};

if (!__PROD__) {
    getTodayTrackSignList.actionType = __filename;
};

export default createAction(getTodayTrackSignList);