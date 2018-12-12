import createAction from 'ACTION/createAction';
import BusOrder from 'SERVICE/ExpCenter/BusOrder';

function GetBusOrderList(param) {
    return {
        promise: BusOrder.GetBusOrderList(param)
    };
}

export default createAction(GetBusOrderList);