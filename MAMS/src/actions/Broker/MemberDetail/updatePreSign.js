import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function updatePreSign(params) {
    return {
        promise: MemberDetailService.updatePreSign(params)
    };
}

export default createAction(updatePreSign);
