import createAction from 'ACTION/createAction';
import eventmanagement from 'SERVICE/Business/Management/eventmanagement';

function GetDepartEntrustList(param) {
    return {
        promise: eventmanagement.getReplyEvent(param)
    };
}

export default createAction(GetDepartEntrustList);