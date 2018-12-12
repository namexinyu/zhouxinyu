import createAction from 'ACTION/createAction';
import CareerService from 'SERVICE/Broker/CareerService';

function getPerformance(param) {
    return {
        promise: CareerService.getPerformance(param)
    };
}

export default createAction(getPerformance);