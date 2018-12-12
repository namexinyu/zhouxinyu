import createAction from 'ACTION/createAction';
import getSevenDayInfoData from 'SERVICE/WorkBoard/SevenDayInfo';

function getSevenDayInfoList(params) {
    return {
        promise: getSevenDayInfoData.getSevenDayInfo(params)
    };
};

if (!__PROD__) {
    getSevenDayInfoList.actionType = __filename;
};

export default createAction(getSevenDayInfoList);