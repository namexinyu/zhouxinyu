import createAction from 'ACTION/createAction';
import MAMSRecruitService from 'SERVICE/Common/MAMSRecruitService';

function getRecruitTimeList(param) {
    return {
        promise: MAMSRecruitService.GetMAMSRecruitmentList(param)
    };
}

export default createAction(getRecruitTimeList);