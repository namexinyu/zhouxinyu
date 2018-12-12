import createAction from 'ACTION/createAction';
import EverysignService from 'SERVICE/Assistant/EverysignService';

function EverysignEntrust(param) {
    return {
        promise: EverysignService.GetInterviewList(param)
    };
}

export default createAction(EverysignEntrust);