import createAction from 'ACTION/createAction';
import getNeedToDoData from 'SERVICE/Broker/NeedToDo';

function getNeedListDatas(params) {
    return {
        promise: getNeedToDoData.getAlready(params)
    };
};

if (!__PROD__) {
    getNeedToDoData.actionType = __filename;
};
    
export default createAction(getNeedListDatas);