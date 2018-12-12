import createAction from 'ACTION/createAction';
import MemberListService from 'SERVICE/Broker/MemberListService';

function getMemberList(params) {
    return {
        promise: MemberListService.getMemberList(params)
    };
}

export default createAction(getMemberList);