import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getMemberPreSignInfo(params) {
    return {
        promise: MemberDetailService.getMemberAskInfo(params)
    };
}

export default createAction(getMemberPreSignInfo);
