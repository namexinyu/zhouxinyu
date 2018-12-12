import createAction from 'ACTION/createAction';
import BusOfferService from 'SERVICE/ExpCenter/BusOfferService';

let action = Object.keys(BusOfferService).reduce((result, data) => {
    let action = (param) => ({
        promise: BusOfferService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;