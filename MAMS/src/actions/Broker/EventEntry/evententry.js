import createAction from 'ACTION/createAction';
import EventService from 'SERVICE/Broker/EventService';

function getEventService(param) {
    return {
        promise: EventService.getEventEntry(param)
    };
}

export default createAction(getEventService);