import createAction from 'ACTION/createAction';
import getNeedToDoData from 'SERVICE/Broker/NeedToDo';

function getNeedListData(params) {
    return {
        promise: getNeedToDoData.getNeedData(params)
    };
};

if (!__PROD__) {
    getNeedListData.actionType = __filename;
};
    
export default createAction(getNeedListData);