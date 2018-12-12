import createAction from 'ACTION/createAction';
import BusinessService from 'SERVICE/Assistant/BusinessService';

function BusinessEntrust(param) {
    return {
        promise: BusinessService.GetInterviewList(param)
    };
}

export default createAction(BusinessEntrust);