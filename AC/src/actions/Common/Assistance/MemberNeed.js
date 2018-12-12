import createAction from 'ACTION/createAction';
import MemberNeedService from 'SERVICE/Assistant/MemberNeedService';

function getMemberNeedList(param) {
    return {
        promise: MemberNeedService.GetInterviewList(param)
    };
}

export default createAction(getMemberNeedList);