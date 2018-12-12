import createAction from 'ACTION/createAction';
import BoardService from 'SERVICE/Assistant/BoardService';

let action = Object.keys(BoardService).reduce((result, data) => {
    let action = (param) => ({
        promise: BoardService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;