import createAction from 'ACTION/createAction';
import Eventlist from 'SERVICE/Business/Management/eventmanagement';

function Eventlists(param) {
    return {
        promise: Eventlist.getQueryEvents(param)
    };
}

export default createAction(Eventlists);