import createAction from 'ACTION/createAction';
import HubService from 'SERVICE/ExpCenter/HubService';

function getHubNameList(param) {
    return {
        promise: HubService.getHubNameList(param)
    };
}

export default createAction(getHubNameList);