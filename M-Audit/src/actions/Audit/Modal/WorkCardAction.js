import createAction from 'ACTION/createAction';
import WorkCardService from 'SERVICE/Audit/Modal/WorkCardService';

let action = Object.keys(WorkCardService).reduce((result, data) => {
    let action = (param) => ({
        promise: WorkCardService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;