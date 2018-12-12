import createAction from 'ACTION/createAction';
import SceneService from 'SERVICE/ExpCenter/SceneService';

function getChargeList(param) {
    return {
        promise: SceneService.getChargeList(param)
    };
}

export default createAction(getChargeList);