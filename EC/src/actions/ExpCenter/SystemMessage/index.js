import createAction from 'ACTION/createAction';
import getSystemMsgData from 'SERVICE/ExpCenter/SystemMsg';

function getSystemMsgList(params) {
    return {
        promise: getSystemMsgData.getSystemMsg(params)
    };
};

if (!__PROD__) {
    getSystemMsgList.actionType = __filename;
};

export default createAction(getSystemMsgList);