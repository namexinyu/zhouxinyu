import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function createDispatchOrder(params) {
    return {
        promise: MemberDetailService.createDispatchOrder(params)
    };
}

export default createAction(createDispatchOrder);