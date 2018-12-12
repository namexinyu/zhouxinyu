import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function updateSevenFeature(params) {
    return {
        promise: MemberDetailService.updateSevenFeature(params)
    };
}

export default createAction(updateSevenFeature);