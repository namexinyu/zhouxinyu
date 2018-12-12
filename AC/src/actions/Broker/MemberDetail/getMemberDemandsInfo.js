import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberDemandsInfo(params) {
    return {
        promise: MemberDetailService.getMemberDemandsInfo(params)
    };
}

export default createAction(getMemberDemandsInfo);
