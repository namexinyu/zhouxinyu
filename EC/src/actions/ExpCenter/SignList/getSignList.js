import createAction from 'ACTION/createAction';
import SceneService from 'SERVICE/ExpCenter/SceneService';

function getSignList(param) {
    return {
        promise: SceneService.getSignList(param)
    };
}

export default createAction(getSignList);