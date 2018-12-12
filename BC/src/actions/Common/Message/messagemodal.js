import createAction from 'ACTION/createAction';
import Eventlist from 'SERVICE/Business/Message/Message';

function GetDepartEntrustList(param) {
    return {
        promise: Eventlist.AddNotify(param)
    };
}

export default createAction(GetDepartEntrustList);