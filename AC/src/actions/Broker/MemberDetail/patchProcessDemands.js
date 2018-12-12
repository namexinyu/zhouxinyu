import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function patchProcessDemands(params) {
    return {
        promise: MemberDetailService.patchProcessDemands(params)
    };
}

export default createAction(patchProcessDemands);
