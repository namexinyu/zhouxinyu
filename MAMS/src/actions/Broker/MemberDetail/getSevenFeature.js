import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getSevenFeature(params) {
    return {
        promise: MemberDetailService.getSevenFeature(params)
    };
}

export default createAction(getSevenFeature);