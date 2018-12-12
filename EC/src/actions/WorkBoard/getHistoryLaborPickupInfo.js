import createAction from 'ACTION/createAction';
import getLaborPickupInfoData from 'SERVICE/WorkBoard/HistoryLaborPickupInfo';

function getLaborPickupInfoList(params) {
    return {
        promise: getLaborPickupInfoData.getLaborPickupInfo(params)
    };
};

if (!__PROD__) {
    getLaborPickupInfoList.actionType = __filename;
};

export default createAction(getLaborPickupInfoList);