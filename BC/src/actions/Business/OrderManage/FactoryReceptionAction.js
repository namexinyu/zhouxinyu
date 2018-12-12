import createAction from 'ACTION/createAction';
import FactoryReceptionService from 'SERVICE/Business/OrderManage/FactoryReceptionService';

let action = Object.keys(FactoryReceptionService).reduce((result, data) => {
    let action = (param) => ({
        promise: FactoryReceptionService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_UOMS_')[1];
    result[data] = createAction(action);
    return result;
}, {});

export default action;