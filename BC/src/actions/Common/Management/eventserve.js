import createAction from 'ACTION/createAction';
import EventManagement from 'SERVICE/Business/Management/eventmanagement';

function getDayService(param) {
    return {
        promise: EventManagement.getDayService(param)
    };
}

export default createAction(getDayService);