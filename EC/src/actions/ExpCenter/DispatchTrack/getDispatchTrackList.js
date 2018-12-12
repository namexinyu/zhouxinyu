import createAction from 'ACTION/createAction';
import DispatchService from 'SERVICE/ExpCenter/DispatchService';

function getAssistanceList(param) {
    return {
        promise: DispatchService.getDispatchList(param)
    };
}

export default createAction(getAssistanceList);