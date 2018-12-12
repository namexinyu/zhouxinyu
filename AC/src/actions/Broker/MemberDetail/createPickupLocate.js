import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function createPickupLocate(params) {
    return {
        promise: MemberDetailService.createPickupLocate(params)
    };
}

export default createAction(createPickupLocate);