import createAction from 'ACTION/createAction';
import MessageService from 'SERVICE/Broker/Message';

function getMessages(params) {
    return {
        promise: MessageService.GetNewNotifyLis(params)
    };
}

export default createAction(getMessages);