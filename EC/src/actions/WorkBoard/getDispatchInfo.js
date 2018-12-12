import createAction from 'ACTION/createAction';
import getDispatchInfoData from 'SERVICE/WorkBoard/DispatchInfo';

function getDispatchInfoList(params) {
    return {
        promise: getDispatchInfoData.getDispatchInfo(params)
    };
};

if (!__PROD__) {
    getDispatchInfoList.actionType = __filename;
};

export default createAction(getDispatchInfoList);