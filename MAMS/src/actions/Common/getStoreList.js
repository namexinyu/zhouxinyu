import createAction from 'ACTION/createAction';
import HubListInfo from 'SERVICE/Broker/HubListInfo';

function getHubListV2(params) {
    return {
        promise: HubListInfo.getHubListV2(params)
    };
}

export default createAction(getHubListV2);
