import createAction from 'ACTION/createAction';
import IDCardService from 'SERVICE/Audit/Modal/IDCardService';

let action = Object.keys(IDCardService).reduce((result, data) => {
    let action = (param) => ({
        promise: IDCardService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;