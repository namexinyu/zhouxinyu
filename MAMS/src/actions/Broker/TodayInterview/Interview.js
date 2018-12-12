import createAction from 'ACTION/createAction';
import getTodayInterviewListData from 'SERVICE/Broker/TodayInterview';

function getTodayInterviewData(params) {
    return {
        promise: getTodayInterviewListData.getInterview(params)
    };
};

if (!__PROD__) {
    getTodayInterviewData.actionType = __filename;
};

export default createAction(getTodayInterviewData);