import createAction from 'ACTION/createAction';
import Eventlist from 'SERVICE/Assistant/Message';

function GetDepartEntrustList(param) {
    return {
        promise: Eventlist.getDayEvent(param)
    };
}

export default createAction(GetDepartEntrustList);