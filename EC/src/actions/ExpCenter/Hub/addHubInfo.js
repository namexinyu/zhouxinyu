import createAction from 'ACTION/createAction';
import HubService from 'SERVICE/ExpCenter/HubService';

function addHubInfo(param) {
    return {
        promise: HubService.editHubInfo(param)
    };
}

export default createAction(addHubInfo);