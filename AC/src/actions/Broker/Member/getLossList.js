import createAction from 'ACTION/createAction';
import LossListService from 'SERVICE/Broker/LossListService';

function getLossList(param) {
    return {
        promise: LossListService.getLossList(param)
    };
}

export default createAction(getLossList);