import createAction from 'ACTION/createAction';
import DeletePreSignService from 'SERVICE/Broker/DeletePreSign';

function getDeletePreSignList(param) {
    return {
        promise: DeletePreSignService.getDeletePreSign(param)
    };
}

export default createAction(getDeletePreSignList);