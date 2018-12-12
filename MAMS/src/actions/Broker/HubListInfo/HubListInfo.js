import createAction from 'ACTION/createAction';
import getHubListData from 'SERVICE/Broker/HubListInfo';

function getHubListList(params) {
    return {
        promise: getHubListData.getHubList(params)
    };
};

if (!__PROD__) {
    getHubListList.actionType = __filename;
};

export default createAction(getHubListList);