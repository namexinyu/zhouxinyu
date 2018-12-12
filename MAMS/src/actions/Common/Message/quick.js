import createAction from 'ACTION/createAction';
import Eventlist from 'SERVICE/Broker/Message';

function GetDepartEntrustList(param) {
    return {
        promise: Eventlist.PushMessageToDevice(param)
    };
}

export default createAction(GetDepartEntrustList);