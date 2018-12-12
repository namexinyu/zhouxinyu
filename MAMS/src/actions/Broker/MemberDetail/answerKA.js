import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function answerKA(params) {
    return {
        promise: MemberDetailService.answerKA(params)
    };
}

export default createAction(answerKA);