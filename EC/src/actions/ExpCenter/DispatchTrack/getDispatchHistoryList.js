import createAction from 'ACTION/createAction';
import DispatchService from 'SERVICE/ExpCenter/DispatchService';

function getDispatchHistoryList(param) {
    return {
        promise: DispatchService.getDispatchHistoryList(param)
    };
}

export default createAction(getDispatchHistoryList);