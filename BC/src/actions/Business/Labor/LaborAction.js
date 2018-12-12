import createAction from 'ACTION/createAction';
import LaborService from 'SERVICE/Business/Labor';

let action = Object.keys(LaborService).reduce((result, data) => {
    let action = (param) => ({
        promise: LaborService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});


function resetSetPriceModal(item) {
    return {
        payload: item
    };
}

if (!__PROD__) {
    resetSetPriceModal.actionType = 'resetSetPriceModal';
}

action['resetSetPriceModal'] = createAction(resetSetPriceModal);
export default action;