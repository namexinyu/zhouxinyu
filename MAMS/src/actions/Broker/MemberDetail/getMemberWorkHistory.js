import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberWorkHistory(params) {
    return {
        promise: MemberDetailService.getMemberWorkHistory(params)
    };
}

export default createAction(getMemberWorkHistory);