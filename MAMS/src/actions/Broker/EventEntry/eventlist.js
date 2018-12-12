import createAction from 'ACTION/createAction';
import EventService from 'SERVICE/Broker/EventService';

function getEventService(param) {
    return {
        promise: EventService.getEventquery(param)
    };
}

export default createAction(getEventService);