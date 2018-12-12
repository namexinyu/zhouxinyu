import createAction from 'ACTION/createAction';
import getHaveDoneData from 'SERVICE/Broker/haveDoneData';

function getHaveDoneListData(params) {
    return {
        promise: getHaveDoneData.getHaveDone(params)
    };
};

if (!__PROD__) {
    getHaveDoneListData.actionType = __filename;
};

export default createAction(getHaveDoneListData);