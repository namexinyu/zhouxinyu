import createAction from 'ACTION/createAction';
import BusRenter from 'SERVICE/ExpCenter/BusRenter';

function getBusRenterList(param) {
    return {
        promise: BusRenter.getBusRenterList(param)
    };
}

export default createAction(getBusRenterList);