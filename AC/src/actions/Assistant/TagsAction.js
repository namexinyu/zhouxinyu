import createAction from 'ACTION/createAction';
import TagsService from 'SERVICE/Assistant/TagsService';

let action = Object.keys(TagsService).reduce((result, data) => {
    let action = (param) => ({
        promise: TagsService[data](param)
    });
    if (!__PROD__) action.actionType = data;
    let actionName = data;
    result[actionName] = createAction(action);
    return result;
}, {});

export default action;