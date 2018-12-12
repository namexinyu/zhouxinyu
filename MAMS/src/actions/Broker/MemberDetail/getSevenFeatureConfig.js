import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getSevenFeatureConfig(params) {
    return {
        promise: MemberDetailService.getSevenFeatureConfig(params)
    };
}

export default createAction(getSevenFeatureConfig);