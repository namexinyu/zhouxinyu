import createAction from 'ACTION/createAction';
import BankCardService from 'SERVICE/Audit/Modal/BankCardService';

let action = Object.keys(BankCardService).reduce((result, data) => {
    let action = (param) => ({
        promise: BankCardService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;