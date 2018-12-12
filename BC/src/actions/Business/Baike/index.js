import createAction from 'ACTION/createAction';
import BaikeService from 'SERVICE/Business/Baike/index';

let action = Object.keys(BaikeService).reduce((result, data) => {
    let action = (param) => ({
        promise: BaikeService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    result[data] = createAction(action);
    return result;
}, {});

export default action;