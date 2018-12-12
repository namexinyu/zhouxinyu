import createAction from 'ACTION/createAction';
import EventManagement from 'SERVICE/Business/Management/eventmanagement';

function getDayEvent(param) {
    return {
        promise: EventManagement.getDayEvent(param)
    };
}

export default createAction(getDayEvent);