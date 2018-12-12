import createAction from 'ACTION/createAction';
import EventService from 'SERVICE/Business/Management/eventmanagement';

function getEventList(param) {
    return {
        promise: EventService.getEventList(param)
    };
}

export default createAction(getEventList);