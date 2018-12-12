import createAction from 'ACTION/createAction';
import getNeedToDoData from 'SERVICE/Broker/NeedToDo';

function getPouredResouceList(params) {
    return {
        promise: getNeedToDoData.getPouredResouceList(params)
    };
};

if (!__PROD__) {
    getNeedToDoData.actionType = __filename;
};
    
export default createAction(getPouredResouceList);