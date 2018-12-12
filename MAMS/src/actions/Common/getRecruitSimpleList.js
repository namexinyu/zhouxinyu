import createAction from 'ACTION/createAction';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

function getRecruitSimpleList(params) {
    return {
        promise: MemberDetailService.getRecruitSimpleList(params)
    };
}

export default createAction(getRecruitSimpleList);