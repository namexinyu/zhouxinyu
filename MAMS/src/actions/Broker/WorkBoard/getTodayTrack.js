import createAction from 'ACTION/createAction';
import getTodayTrackData from 'SERVICE/Broker/getTodayTrack';

function getTodayTrackList(params) {
    return {
        promise: getTodayTrackData.getTodayTrack(params)
    };
};

if (!__PROD__) {
    getTodayTrackList.actionType = __filename;
};

export default createAction(getTodayTrackList);