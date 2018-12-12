import createAction from 'ACTION/createAction';
import SceneService from 'SERVICE/ExpCenter/SceneService';

function addRefundData(param) {
    return {
        promise: SceneService.addRefundData(param)
    };
}

export default createAction(addRefundData);