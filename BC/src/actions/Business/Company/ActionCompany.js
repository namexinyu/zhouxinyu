import createAction from 'ACTION/createAction';
import CompanyService from 'SERVICE/Business/Company/index';

let action = Object.keys(CompanyService).reduce((result, data) => {
    let action = (param) => ({
        promise: CompanyService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;