import createAction from 'ACTION/createAction';
import getAmountInfoData from 'SERVICE/WorkBoard/AmountInfo';

function getAmountInfoList(params) {
    return {
        promise: getAmountInfoData.getAmountInfo(params)
    };
};

if (!__PROD__) {
    getAmountInfoList.actionType = __filename;
};

export default createAction(getAmountInfoList);