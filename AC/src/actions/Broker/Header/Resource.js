import createAction from 'ACTION/createAction';
import ResourceService from 'SERVICE/Broker/ResourceService';

let action = Object.keys(ResourceService).reduce((result, data) => {
    let action = (param) => ({
        promise: ResourceService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;