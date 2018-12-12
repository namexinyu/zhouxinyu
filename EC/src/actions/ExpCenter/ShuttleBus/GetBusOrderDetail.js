import createAction from 'ACTION/createAction';
import BusOrder from 'SERVICE/ExpCenter/BusOrder';

function GetBusOrderDetail(param) {
    return {
        promise: BusOrder.GetBusOrderDetail(param)
    };
}

export default createAction(GetBusOrderDetail);