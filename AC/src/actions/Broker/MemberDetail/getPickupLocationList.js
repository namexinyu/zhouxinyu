import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getPickupLocationList(params) {
    return {
        promise: MemberDetailService.getPickupLocationList(params)
    };
}

export default createAction(getPickupLocationList);