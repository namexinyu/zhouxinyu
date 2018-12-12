import createAction from 'ACTION/createAction';
import WorkBoardService from 'SERVICE/Business/WorkBoard';

let action = Object.keys(WorkBoardService).reduce((result, data) => {
    let action = (param) => ({
        promise: WorkBoardService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    // let actionName = data.split('BZ_')[1].split('_Interface')[0];
    result[data] = createAction(action);
    return result;
}, {});

export default action;