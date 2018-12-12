import createAction from 'ACTION/createAction';

function updateWorkingReply(tmpReplyObj) {
    return {
        payload: {
            tmpReplyObj: tmpReplyObj
        }
    };
}

export default createAction(updateWorkingReply);