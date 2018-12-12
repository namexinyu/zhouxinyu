import createAction from 'ACTION/createAction';
import EnterpriseService from 'SERVICE/Business/Recruitment/Enterprise';

export default Object.keys(EnterpriseService).reduce((result, data) => {
    let action = (param) => ({
        promise: EnterpriseService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});