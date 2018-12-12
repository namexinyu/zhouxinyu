import createAction from 'ACTION/createAction';
import AssistanceService from 'SERVICE/Common/AssistanceService';

function GetEntrustReplyList(param) {
    return {
        promise: AssistanceService.GetEntrustReplyList(param)
    };
}

export default createAction(GetEntrustReplyList);