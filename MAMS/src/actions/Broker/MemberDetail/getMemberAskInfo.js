import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberAskInfo(params) {
    return {
        promise: MemberDetailService.getMemberAskInfo(params)
    };
}

export default createAction(getMemberAskInfo);
