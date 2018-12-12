import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function insertPreSign(params) {
    return {
        promise: MemberDetailService.insertPreSign(params)
    };
}

export default createAction(insertPreSign);
