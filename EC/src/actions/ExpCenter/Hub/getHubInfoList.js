import createAction from 'ACTION/createAction';
import HubService from 'SERVICE/ExpCenter/HubService';

function getHubInfoList(param) {
    return {
        promise: HubService.getHubInfoList(param)
    };
}

export default createAction(getHubInfoList);