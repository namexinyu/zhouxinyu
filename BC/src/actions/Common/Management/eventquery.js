import createAction from 'ACTION/createAction';
import EventManagement from 'SERVICE/Business/Management/eventmanagement';

function getQueryEvents(param) {
    return {
        promise: EventManagement.getQueryEvents(param)
    };
}

export default createAction(getQueryEvents);