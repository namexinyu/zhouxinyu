import createAction from 'ACTION/createAction';
import SceneService from 'SERVICE/ExpCenter/SceneService';

function getPickUpList(param) {
    return {
        promise: SceneService.getPickUpList(param)
    };
}

export default createAction(getPickUpList);