import createAction from 'ACTION/createAction';
import BusType from 'SERVICE/ExpCenter/BusType';

function getBusTypeList(param) {
    return {
        promise: BusType.getBusTypeList(param)
    };
}

export default createAction(getBusTypeList);