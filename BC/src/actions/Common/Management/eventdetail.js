import createAction from 'ACTION/createAction';
import eventmanagement from 'SERVICE/Business/Management/eventmanagement';

function GetDepartEntrustList(param) {
    return {
        promise: eventmanagement.getQueryEvent(param)
    };
}

export default createAction(GetDepartEntrustList);