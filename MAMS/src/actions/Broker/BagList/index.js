import createAction from 'ACTION/createAction';
import getBagList from 'SERVICE/Broker/BagList';

function getBagListData(params) {
    return {
        promise: getBagList.getBag(params)
    };
};

if (!__PROD__) {
    getBagListData.actionType = __filename;
};

export default createAction(getBagListData);