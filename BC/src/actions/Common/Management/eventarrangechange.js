import createAction from 'ACTION/createAction';
import Eventlist from 'SERVICE/Business/Management/eventmanagement';

function GetDepartEntrustList(param) {
    return {
        promise: Eventlist.getModOnDuty(param)
    };
}

export default createAction(GetDepartEntrustList);