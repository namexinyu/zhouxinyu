import createAction from 'ACTION/createAction';
import SceneService from 'SERVICE/ExpCenter/SceneService';

function getLaborFilterList(param) {
    return {
        promise: SceneService.getLaborFilterList(param)
    };
}

export default createAction(getLaborFilterList);