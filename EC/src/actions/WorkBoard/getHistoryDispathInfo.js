import createAction from 'ACTION/createAction';
import getHistoryDispatchInfoData from 'SERVICE/WorkBoard/HistoryDispathInfo';

function getHistoryDispatchInfoList(params) {
    return {
        promise: getHistoryDispatchInfoData.getHistoryDispatchInfo(params)
    };
};

if (!__PROD__) {
    getHistoryDispatchInfoList.actionType = __filename;
};

export default createAction(getHistoryDispatchInfoList);