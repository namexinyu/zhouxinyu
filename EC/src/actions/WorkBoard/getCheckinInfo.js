import createAction from 'ACTION/createAction';
import getCheckinInfoData from 'SERVICE/WorkBoard/CheckinInfo';

function getCheckinInfoList(params) {
    return {
        promise: getCheckinInfoData.getCheckinInfo(params)
    };
};

if (!__PROD__) {
    getCheckinInfoList.actionType = __filename;
};

export default createAction(getCheckinInfoList);