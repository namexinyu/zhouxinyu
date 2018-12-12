import createAction from 'ACTION/createAction';
import SceneService from 'SERVICE/ExpCenter/SceneService';

function exportChargeList(param) {
    return {
        promise: SceneService.exportChargeList(param)
    };
}

export default createAction(exportChargeList);